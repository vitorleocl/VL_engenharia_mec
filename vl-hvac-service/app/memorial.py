"""Memorial descritivo e de cálculo (Markdown + HTML) a partir do resultado do motor."""
from __future__ import annotations

import datetime as dt
import html

Block = tuple  # ("h1"|"h2"|"p"|"ul"|"table", payload)


def _blocks(res: dict, resp: dict) -> list[Block]:
    p, t, c = res["project"], res["totals"], res["climate"]
    b: list[Block] = [("h1", f"Memorial de Cálculo e Descritivo — Climatização: {p['name']}")]
    b.append(("p", f"Cliente: {p['client'] or '—'} | Local: {p['address'] or '—'} | "
                   f"Data: {dt.date.today():%d/%m/%Y}"))
    b.append(("h2", "1. Objeto"))
    b.append(("p", f"Pré-dimensionamento do sistema de climatização tipo **{p['system']}** para "
                   f"{len(res['rooms'])} ambiente(s), área condicionada total de {t['area_m2']} m²."))
    b.append(("h2", "2. Normas e referências"))
    b.append(("ul", ["ABNT NBR 16401-1 — Instalações de ar-condicionado: projetos das instalações",
                     "ABNT NBR 16401-2 — Parâmetros de conforto térmico",
                     "ABNT NBR 16401-3 — Qualidade do ar interior",
                     "ASHRAE Fundamentals — psicrometria e cargas térmicas (referência)",
                     "Portaria/Lei 13.589/2018 (PMOC), quando aplicável"]))
    b.append(("h2", "3. Premissas"))
    b.append(("ul", [f"Condições internas: {p['setpoint_c']} °C / {p['rh_pct']} % UR",
                     f"Condições externas: TBS {c['tbs']} °C / TBU {c['tbu']} °C (altitude {c['altitude_m']} m)"
                     f"{' — valores de referência da tabela interna, a validar' if c['from_table'] else ''}",
                     "Método: simplificado de pré-dimensionamento (condução com ΔT equivalente por orientação, "
                     "ganho solar por vidro com fator de carga, cargas internas por ocupação, iluminação e "
                     "equipamentos, ar externo por pessoa + área)",
                     "Fator de segurança aplicado conforme parâmetros do projeto"]))
    b.append(("h2", "4. Resultado das cargas térmicas"))
    rows = [[l["name"], l["area_m2"], l["occupants"], l["sensible_w"], l["latent_w"], l["total_w"],
             l["total_tr"], l["w_per_m2"], l["supply_m3h"]] for l in res["loads"]]
    b.append(("table", (["Ambiente", "Área m²", "Pessoas", "Sensível W", "Latente W", "Total W", "TR",
                         "W/m²", "Vazão m³/h"], rows)))
    b.append(("p", f"**Carga total: {t['total_w']} W = {t['total_tr']} TR = {t['total_btuh']} BTU/h.**"))
    b.append(("h2", "5. Composição das cargas por ambiente (W)"))
    comp_rows = []
    for l in res["loads"]:
        cw = l["components_w"]
        comp_rows.append([l["name"], cw["paredes"], cw["vidros_conducao"], cw["vidros_solar"], cw["cobertura"],
                          cw["pessoas_sensivel"] + cw["pessoas_latente"], cw["iluminacao"], cw["equipamentos"],
                          cw["ar_externo_sensivel"] + cw["ar_externo_latente"]])
    b.append(("table", (["Ambiente", "Paredes", "Vidros cond.", "Vidros solar", "Cobertura", "Pessoas",
                         "Ilum.", "Equip.", "Ar externo"], comp_rows)))
    b.append(("h2", "6. Equipamentos selecionados"))
    if res["units"]:
        rws = [[u["room_id"], u["tipo"], u.get("nominal_btuh") or f"{u.get('nominal_kw')} kW", u["quantidade"]]
               for u in res["units"]]
        b.append(("table", (["Ambiente", "Tipo", "Capacidade nominal (BTU/h ou kW)", "Qtd"], rws)))
    for a in res["equipment"].get("ahus", []):
        b.append(("p", f"Pavimento {a['level']}: {a['quantidade']} x {a['nominal_tr']} TR — vazão {a['vazao_ar_m3h']} m³/h "
                       f"(carga necessária {a['carga_necessaria_tr']} TR com diversidade)."))
    if "outdoor_vrf" in res["equipment"]:
        o = res["equipment"]["outdoor_vrf"]
        b.append(("p", f"Unidade externa VRF: carga {o['carga_total_kw']} kW; mínimo com diversidade "
                       f"{o['capacidade_minima_kw_com_diversidade']} kW. {o['obs']}"))
    if res["ducts"]:
        b.append(("h2", "7. Dutos"))
        rws = [[s["id"], s["kind"], s["length_m"], s["flow_m3h"], f"{int(s['width_m']*1000)}x{int(s['height_m']*1000)}",
                s["velocity_ms"], s["friction_pa_m"]] for s in res["ducts"]]
        b.append(("table", (["Trecho", "Tipo", "Comp. m", "Vazão m³/h", "LxA mm", "Vel. m/s", "Perda Pa/m"], rws)))
    b.append(("h2", "8. Lista de materiais (quantitativo preliminar)"))
    b.append(("table", (["Item", "Un", "Qtd"], [[i["item"], i["un"], i["qtd"]] for i in res["bom"]])))
    b.append(("h2", "9. Observações e limitações"))
    b.append(("ul", res["warnings"] + [
        "Os valores deste documento são de PRÉ-DIMENSIONAMENTO e devem ser conferidos pelo responsável técnico.",
        "A seleção final de equipamentos deve usar as tabelas do fabricante nas condições de projeto.",
        "Compatibilizar com arquitetura, estrutura, elétrica e hidráulica antes da emissão.",
    ]))
    b.append(("h2", "10. Responsável técnico"))
    b.append(("p", f"{resp.get('name') or '—'} — CREA {resp.get('crea') or '—'} — ART {resp.get('art') or '—'}"))
    return b


def _inline(s: str) -> str:
    s = html.escape(str(s))
    while "**" in s:
        s = s.replace("**", "<strong>", 1).replace("**", "</strong>", 1)
    return s


def render_md(blocks: list[Block]) -> str:
    out = []
    for kind, pl in blocks:
        if kind == "h1":
            out.append(f"# {pl}\n")
        elif kind == "h2":
            out.append(f"## {pl}\n")
        elif kind == "p":
            out.append(f"{pl}\n")
        elif kind == "ul":
            out.append("\n".join(f"- {i}" for i in pl) + "\n")
        elif kind == "table":
            head, rows = pl
            out.append("| " + " | ".join(head) + " |")
            out.append("|" + "---|" * len(head))
            out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows]
            out.append("")
    return "\n".join(out)


def render_html(blocks: list[Block]) -> str:
    css = ("body{font-family:Arial,sans-serif;max-width:980px;margin:24px auto;padding:0 18px;color:#0B1E3D;font-size:13px;line-height:1.55}"
           "h1{font-size:20px;border-bottom:3px solid #1565D8;padding-bottom:8px}h2{font-size:15px;margin-top:22px;color:#1565D8}"
           "table{border-collapse:collapse;width:100%;margin:8px 0}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left}"
           "th{background:#eaf1ff;color:#0B1E3D}strong{color:#0B1E3D}")
    out = [f"<!doctype html><html lang='pt-BR'><meta charset='utf-8'><style>{css}</style><body>"]
    for kind, pl in blocks:
        if kind in ("h1", "h2"):
            out.append(f"<{kind}>{_inline(pl)}</{kind}>")
        elif kind == "p":
            out.append(f"<p>{_inline(pl)}</p>")
        elif kind == "ul":
            out.append("<ul>" + "".join(f"<li>{_inline(i)}</li>" for i in pl) + "</ul>")
        elif kind == "table":
            head, rows = pl
            out.append("<table><tr>" + "".join(f"<th>{_inline(h)}</th>" for h in head) + "</tr>")
            out += ["<tr>" + "".join(f"<td>{_inline(c)}</td>" for c in r) + "</tr>" for r in rows]
            out.append("</table>")
    out.append("</body></html>")
    return "\n".join(out)


def build_memorial(
    res: dict,
    responsible: dict | None = None,
    analysis_markdown: str = "",
) -> tuple[str, str]:
    blocks = _blocks(res, responsible or {})
    markdown = render_md(blocks)
    rendered_html = render_html(blocks)
    if analysis_markdown.strip():
        section_title = "Análise do projetista (gerada com IA — revisar)"
        markdown += f"\n## {section_title}\n\n{analysis_markdown.strip()}\n"
        analysis_html = (
            f"<h2>{html.escape(section_title)}</h2>"
            f"<pre style='white-space:pre-wrap;font:inherit;background:#f7faf9;padding:12px;border-left:3px solid #0a6'>"
            f"{html.escape(analysis_markdown.strip())}</pre>"
        )
        rendered_html = rendered_html.replace("</body>", f"{analysis_html}</body>")
    return markdown, rendered_html
