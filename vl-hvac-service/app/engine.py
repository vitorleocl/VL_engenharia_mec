"""Orquestra: clima -> cargas -> equipamentos -> lançamento de dutos/unidades -> lista de materiais."""
from __future__ import annotations

import math
from collections import Counter, defaultdict

from .climate import resolve_climate
from .ducts import flex_diameter_mm, grille_size, size_rectangular
from .equipment import select_ahu, select_split, select_vrf_indoor
from .loads import W_PER_TR, W_TO_BTUH, room_load
from .models import Project, Room


def _bbox(rooms: list[Room]) -> tuple[float, float, float, float]:
    return (min(r.x for r in rooms), min(r.y for r in rooms),
            max(r.x + r.w for r in rooms), max(r.y + r.l for r in rooms))


def _diffusers(room: Room, q_total: float, max_per: float) -> list[dict]:
    n = max(1, math.ceil(q_total / max_per))
    cols = max(1, round(math.sqrt(n * room.w / room.l)))
    rows = math.ceil(n / cols)
    q_each = q_total / n
    size = 0.60 if q_each > 250 else 0.30
    out = []
    for k in range(n):
        i, j = k % cols, k // cols
        out.append({
            "room_id": room.id, "level": room.level,
            "x": round(room.x + (i + 0.5) / cols * room.w, 3),
            "y": round(room.y + (j + 0.5) / rows * room.l, 3),
            "size_m": size, "flow_m3h": round(q_each),
        })
    return out


def _build_ducts(level: int, rooms: list[Room], loads: dict, prj: Project, z_top: float) -> list[dict]:
    ax, ay, opt = prj.ahu.x, prj.ahu.y, prj.options
    nodes = [(r.x + r.w / 2, r.y + r.l / 2, loads[r.id]["supply_m3h"], r.id) for r in rooms]
    segs: list[dict] = []

    def add(kind: str, x1, y1, x2, y2, q):
        length = abs(x2 - x1) + abs(y2 - y1)
        if length < 0.05:
            return
        sz = size_rectangular(q, opt.friction_pa_m, opt.max_duct_height_m, opt.max_velocity_ms)
        segs.append({
            "id": f"DT-{level}-{len(segs) + 1:02d}", "kind": kind, "level": level,
            "x1": round(x1, 3), "y1": round(y1, 3), "x2": round(x2, 3), "y2": round(y2, 3),
            "length_m": round(length, 2), "flow_m3h": round(q), **sz,
            "z_bottom_m": round(z_top - sz["height_m"], 3),
        })

    for side in (-1, 1):
        sn = [n for n in nodes if ((n[0] - ax) * side > 1e-9) or (side == 1 and abs(n[0] - ax) <= 1e-9)]
        sn.sort(key=lambda n: abs(n[0] - ax))
        remaining, prev_x = sum(n[2] for n in sn), ax
        for cx, cy, q, _rid in sn:
            add("tronco", prev_x, ay, cx, ay, remaining)
            add("ramal", cx, ay, cx, cy, q)
            remaining -= q
            prev_x = cx
    return segs


def run(prj: Project) -> dict:
    opt = prj.options
    c = prj.climate
    clim = resolve_climate(c.city, c.tbs, c.tbu, c.altitude_m)
    warnings: list[str] = []
    if clim["from_table"]:
        warnings.append("Condições externas vieram da tabela interna aproximada: validar com a NBR 16401-1.")

    loads = {r.id: room_load(r, prj, clim) for r in prj.rooms}
    levels = sorted({r.level for r in prj.rooms})
    rooms_by_level = {lv: [r for r in prj.rooms if r.level == lv] for lv in levels}

    # sobreposição de ambientes (mesmo pavimento)
    for lv, rs in rooms_by_level.items():
        for i, a in enumerate(rs):
            for b in rs[i + 1:]:
                if a.x < b.x + b.w and b.x < a.x + a.w and a.y < b.y + b.l and b.y < a.y + a.l:
                    warnings.append(f"Ambientes '{a.id}' e '{b.id}' se sobrepõem no pavimento {lv}.")
    for r in prj.rooms:
        ld = loads[r.id]
        if ld["w_per_m2"] > 250:
            warnings.append(f"'{r.name}': carga específica {ld['w_per_m2']} W/m² está alta — conferir entradas.")

    units, condensers, pipes, diffusers, grilles, ducts, flex = [], [], [], [], [], [], []
    equipment: dict = {"system": prj.system}
    ahus: list[dict] = []

    if prj.system in ("split", "vrf"):
        for lv, rs in rooms_by_level.items():
            x0, y0, x1, y1 = _bbox(rs)
            for r in rs:
                ld = loads[r.id]
                sel = select_split(ld["total_w"]) if prj.system == "split" else select_vrf_indoor(ld["total_w"])
                cy = r.y + r.l / 2
                bottom = (cy - y0) <= (y1 - cy)
                ux, uy = r.x + r.w / 2, (r.y + 0.3 if bottom else r.y + r.l - 0.3)
                big = prj.system == "vrf" or sel.get("nominal_btuh", 0) > 24000
                units.append({"room_id": r.id, "level": lv, "x": round(ux, 3), "y": round(uy, 3),
                              "w_m": 0.9 if big else 1.0, "d_m": 0.9 if big else 0.3,
                              "z_m": round(lv * prj.floor_height_m + r.height_m - (0.3 if big else 0.4), 3),
                              **sel})
                if prj.system == "split":
                    cyc = (y0 - 1.5) if bottom else (y1 + 1.5)
                    for k in range(sel["quantidade"]):
                        condensers.append({"room_id": r.id, "level": lv, "x": round(ux + k * 1.1, 3),
                                           "y": round(cyc, 3), "nominal_btuh": sel["nominal_btuh"]})
                    plen = abs(cyc - uy) + 1.5
                    pipes.append({"room_id": r.id, "level": lv, "x1": round(ux, 3), "y1": round(uy, 3),
                                  "x2": round(ux, 3), "y2": round(cyc, 3), "length_m": round(plen, 1),
                                  "liquido": sel["tubo_liquido"], "gas": sel["tubo_gas"]})
        if prj.system == "vrf":
            tot_kw = sum(loads[r.id]["total_w"] for r in prj.rooms) / 1000
            equipment["outdoor_vrf"] = {"carga_total_kw": round(tot_kw, 1),
                                        "capacidade_minima_kw_com_diversidade": round(tot_kw * opt.diversity_ahu, 1),
                                        "obs": "Selecionar ODU do fabricante; traçado de refrigerante a detalhar."}
    else:  # dutado
        for lv, rs in rooms_by_level.items():
            z_top = lv * prj.floor_height_m + min(r.height_m for r in rs) - 0.10
            ducts += _build_ducts(lv, rs, loads, prj, z_top)
            for r in rs:
                ld = loads[r.id]
                ds = _diffusers(r, ld["supply_m3h"], opt.diffuser_max_m3h)
                for d in ds:
                    d["z_m"] = round(z_top, 3)
                diffusers += ds
                cx, cy = r.x + r.w / 2, r.y + r.l / 2
                for d in ds:
                    flex.append({"room_id": r.id, "level": lv, "x1": round(cx, 3), "y1": round(cy, 3),
                                 "x2": d["x"], "y2": d["y"], "dn_mm": flex_diameter_mm(d["flow_m3h"]),
                                 "length_m": round(abs(d["x"] - cx) + abs(d["y"] - cy) + 0.5, 2)})
                q_ret = max(ld["supply_m3h"] - ld["ar_externo_m3h"], 0.8 * ld["supply_m3h"])
                gw, gh = grille_size(q_ret)
                grilles.append({"room_id": r.id, "level": lv, "x": round(r.x + r.w - 0.5, 3),
                                "y": round(r.y + 0.5, 3), "w_m": gw, "h_m": gh, "flow_m3h": round(q_ret)})
            lsum = sum(loads[r.id]["total_w"] for r in rs)
            qsum = sum(loads[r.id]["supply_m3h"] for r in rs)
            ahus.append({"level": lv, "x": prj.ahu.x, "y": prj.ahu.y, **select_ahu(lsum, opt.diversity_ahu, qsum)})
        for s in ducts:
            if s["velocity_ms"] > opt.max_velocity_ms + 1e-6:
                warnings.append(f"Duto {s['id']}: velocidade {s['velocity_ms']} m/s acima do limite.")
        equipment["ahus"] = ahus
        warnings.append("Dutos: lançamento esquemático (tronco no eixo da casa de máquinas + ramais ortogonais); "
                        "compatibilizar com arquitetura, estrutura e forro antes de emitir.")

    # lista de materiais
    bom: list[dict] = []
    if ducts:
        area = sum(2 * (s["width_m"] + s["height_m"]) * s["length_m"] for s in ducts)
        bom.append({"item": "Duto retangular chapa galvanizada", "un": "m²", "qtd": round(area * 1.10, 1)})
        bom.append({"item": "Isolamento térmico de duto", "un": "m²", "qtd": round(area * 1.10, 1)})
        for dn in sorted({f["dn_mm"] for f in flex}):
            tot = sum(f["length_m"] for f in flex if f["dn_mm"] == dn)
            bom.append({"item": f"Duto flexível isolado Ø{dn} mm", "un": "m", "qtd": round(tot * 1.1, 1)})
        cnt = Counter(int(d["size_m"] * 1000) for d in diffusers)
        for sz, n in sorted(cnt.items()):
            bom.append({"item": f"Difusor de insuflamento {sz}x{sz} mm", "un": "un", "qtd": n})
        gc = Counter((int(g["w_m"] * 1000), int(g["h_m"] * 1000)) for g in grilles)
        for (w, h), n in sorted(gc.items()):
            bom.append({"item": f"Grelha de retorno {w}x{h} mm", "un": "un", "qtd": n})
        for a in ahus:
            bom.append({"item": f"Fan-coil/AHU {a['nominal_tr']} TR (pav. {a['level']})", "un": "un", "qtd": a["quantidade"]})
    if units:
        uc = Counter((u.get("nominal_btuh") or u.get("nominal_kw"), u["tipo"]) for u in units for _ in range(u["quantidade"]))
        for (cap, tipo), n in sorted(uc.items(), key=lambda kv: str(kv[0])):
            un = "BTU/h" if prj.system == "split" else "kW"
            bom.append({"item": f"Unidade interna {tipo} {cap} {un}", "un": "un", "qtd": n})
    if condensers:
        cc = Counter(c_["nominal_btuh"] for c_ in condensers)
        for cap, n in sorted(cc.items()):
            bom.append({"item": f"Unidade condensadora {cap} BTU/h", "un": "un", "qtd": n})
        by_pipe: dict = defaultdict(float)
        for p_ in pipes:
            by_pipe[(p_["liquido"], p_["gas"])] += p_["length_m"]
        for (liq, gas), m in sorted(by_pipe.items()):
            bom.append({"item": f"Par de tubos de cobre isolados {liq} / {gas}", "un": "m", "qtd": round(m * 1.1, 1)})
        bom.append({"item": "Dreno PVC 25 mm", "un": "m", "qtd": round(sum(p_["length_m"] for p_ in pipes) * 0.6, 1)})

    tot_w = sum(l["total_w"] for l in loads.values())
    by_level = {str(lv): round(sum(loads[r.id]["total_w"] for r in rs)) for lv, rs in rooms_by_level.items()}
    return {
        "project": {"name": prj.name, "client": prj.client, "address": prj.address,
                    "system": prj.system, "setpoint_c": prj.setpoint_c, "rh_pct": prj.rh_pct},
        "climate": clim,
        "rooms": [r.model_dump() for r in prj.rooms],
        "loads": list(loads.values()),
        "totals": {"total_w": round(tot_w), "total_tr": round(tot_w / W_PER_TR, 2),
                   "total_btuh": round(tot_w * W_TO_BTUH), "by_level_w": by_level,
                   "supply_m3h": round(sum(l["supply_m3h"] for l in loads.values())),
                   "area_m2": round(sum(r.area for r in prj.rooms), 1)},
        "equipment": equipment, "units": units, "condensers": condensers, "pipes": pipes,
        "diffusers": diffusers, "grilles": grilles, "ducts": ducts, "flex": flex,
        "bom": bom, "warnings": warnings,
        "meta": {"method": "simplificado de pré-dimensionamento",
                 "floor_height_m": prj.floor_height_m,
                 "ahu": prj.ahu.model_dump() if prj.ahu else None},
    }
