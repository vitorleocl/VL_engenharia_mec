"""Gera planta HVAC 2D em DXF (R2018, unidades em mm). O AutoCAD salva como DWG."""
from __future__ import annotations

import datetime as dt

import ezdxf
from ezdxf.enums import TextEntityAlignment as TA

MM = 1000.0
LAYERS = {
    "ARQ-AMBIENTE": 8, "ARQ-TEXTO": 8,
    "HVAC-DUTO-INS": 4, "HVAC-FLEX": 8, "HVAC-DIFUSOR": 3, "HVAC-GRELHA": 6,
    "HVAC-EQUIP": 1, "HVAC-REFRIG": 5, "HVAC-DRENO": 150,
    "HVAC-TEXTO": 2, "HVAC-QUADRO": 7, "HVAC-SELO": 7, "HVAC-LEGENDA": 7,
}


def _txt(msp, s, x, y, h, layer, align=TA.MIDDLE_CENTER, rot=0.0):
    t = msp.add_text(s, height=h, rotation=rot, dxfattribs={"layer": layer, "style": "STD"})
    t.set_placement((x, y), align=align)
    return t


def _rect(msp, x0, y0, x1, y1, layer):
    msp.add_lwpolyline([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], close=True, dxfattribs={"layer": layer})


def generate_dxf(res: dict, path: str, scale: int = 50, responsible: dict | None = None) -> None:
    doc = ezdxf.new("R2018", setup=True)
    doc.units = ezdxf.units.MM
    doc.header["$INSUNITS"] = 4
    doc.styles.add("STD", font="arial.ttf")
    for name, color in LAYERS.items():
        doc.layers.add(name, color=color)
    doc.linetypes.add("TRACEJADO", pattern=[0.5, 0.25, -0.25])  # noqa: only if absent
    msp = doc.modelspace()
    th = scale * 2.0          # altura de texto (2 mm no papel)
    th_big = scale * 3.5

    rooms = res["rooms"]
    loads = {l["room_id"]: l for l in res["loads"]}
    levels = sorted({r["level"] for r in rooms})
    gx0 = min(r["x"] for r in rooms)
    gy0 = min(r["y"] for r in rooms)
    gx1 = max(r["x"] + r["w"] for r in rooms)
    gy1 = max(r["y"] + r["l"] for r in rooms)
    pitch = (gx1 - gx0) + 12.0
    off = {lv: i * pitch for i, lv in enumerate(levels)}

    def P(lv, x, y):  # metros -> mm com deslocamento por pavimento
        return ((x + off[lv]) * MM, y * MM)

    for lv in levels:
        x, y = P(lv, gx0, gy1 + 2.5)
        _txt(msp, f"PLANTA DE CLIMATIZAÇÃO — PAVIMENTO {lv}  (ESC. 1:{scale})", x, y, th_big, "HVAC-TEXTO", TA.LEFT)

    # ambientes
    for r in rooms:
        lv = r["level"]
        x0, y0 = P(lv, r["x"], r["y"])
        x1, y1 = P(lv, r["x"] + r["w"], r["y"] + r["l"])
        _rect(msp, x0, y0, x1, y1, "ARQ-AMBIENTE")
        ld = loads[r["id"]]
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        _txt(msp, r["name"].upper(), cx, y1 - th * 1.5, th, "ARQ-TEXTO")
        _txt(msp, f"{ld['area_m2']} m² | {ld['total_w']} W | {ld['total_tr']} TR", cx, y1 - th * 3.0, th * 0.9, "HVAC-TEXTO")

    # dutos (duplas linhas)
    for s in res["ducts"]:
        lv, w = s["level"], s["width_m"]
        if abs(s["y1"] - s["y2"]) < 1e-9:  # horizontal
            xa, xb = sorted((s["x1"], s["x2"]))
            a, b = P(lv, xa, s["y1"] - w / 2), P(lv, xb, s["y1"] + w / 2)
            rot, mx, my = 0.0, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + w * MM / 2 + th * 0.8
        else:
            ya, yb = sorted((s["y1"], s["y2"]))
            a, b = P(lv, s["x1"] - w / 2, ya), P(lv, s["x1"] + w / 2, yb)
            rot, mx, my = 90.0, (a[0] + b[0]) / 2 + w * MM / 2 + th * 0.8, (a[1] + b[1]) / 2
        _rect(msp, a[0], a[1], b[0], b[1], "HVAC-DUTO-INS")
        _txt(msp, f"{int(w*1000)}x{int(s['height_m']*1000)} | {s['flow_m3h']} m³/h", mx, my, th * 0.8, "HVAC-TEXTO", rot=rot)

    # flexíveis
    for f in res["flex"]:
        a, b = P(f["level"], f["x1"], f["y1"]), P(f["level"], f["x2"], f["y2"])
        msp.add_line(a, b, dxfattribs={"layer": "HVAC-FLEX"})

    # difusores
    for i, d in enumerate(res["diffusers"], 1):
        cx, cy = P(d["level"], d["x"], d["y"])
        h = d["size_m"] * MM / 2
        _rect(msp, cx - h, cy - h, cx + h, cy + h, "HVAC-DIFUSOR")
        msp.add_line((cx - h, cy - h), (cx + h, cy + h), dxfattribs={"layer": "HVAC-DIFUSOR"})
        msp.add_line((cx - h, cy + h), (cx + h, cy - h), dxfattribs={"layer": "HVAC-DIFUSOR"})
        _txt(msp, f"D{i:02d} {d['flow_m3h']}", cx, cy - h - th, th * 0.8, "HVAC-TEXTO")

    # grelhas de retorno
    for i, g in enumerate(res["grilles"], 1):
        cx, cy = P(g["level"], g["x"], g["y"])
        hw, hh = g["w_m"] * MM / 2, g["h_m"] * MM / 2
        _rect(msp, cx - hw, cy - hh, cx + hw, cy + hh, "HVAC-GRELHA")
        for k in (-0.5, 0, 0.5):
            msp.add_line((cx - hw, cy + k * hh), (cx + hw, cy + k * hh), dxfattribs={"layer": "HVAC-GRELHA"})
        _txt(msp, f"GR{i:02d} {int(g['w_m']*1000)}x{int(g['h_m']*1000)}", cx, cy - hh - th, th * 0.8, "HVAC-TEXTO")

    # unidades internas
    for i, u in enumerate(res["units"], 1):
        cx, cy = P(u["level"], u["x"], u["y"])
        hw, hd = u["w_m"] * MM / 2, u["d_m"] * MM / 2
        _rect(msp, cx - hw, cy - hd, cx + hw, cy + hd, "HVAC-EQUIP")
        cap = f"{u['nominal_btuh']} BTU/h" if "nominal_btuh" in u else f"{u['nominal_kw']} kW"
        _txt(msp, f"UE-{i:02d} {cap}", cx, cy + hd + th, th * 0.9, "HVAC-TEXTO")
    for i, c in enumerate(res["condensers"], 1):
        cx, cy = P(c["level"], c["x"], c["y"])
        _rect(msp, cx - 450, cy - 300, cx + 450, cy + 300, "HVAC-EQUIP")
        msp.add_circle((cx, cy), 220, dxfattribs={"layer": "HVAC-EQUIP"})
        _txt(msp, f"UC-{i:02d} {c['nominal_btuh']}", cx, cy - 300 - th, th * 0.9, "HVAC-TEXTO")
    for p in res["pipes"]:
        a, b = P(p["level"], p["x1"], p["y1"]), P(p["level"], p["x2"], p["y2"])
        msp.add_line(a, b, dxfattribs={"layer": "HVAC-REFRIG"})
        msp.add_line((a[0] + 150, a[1]), (b[0] + 150, b[1]), dxfattribs={"layer": "HVAC-DRENO"})
        _txt(msp, f"{p['liquido']}/{p['gas']} L={p['length_m']} m", (a[0] + b[0]) / 2 - th, (a[1] + b[1]) / 2,
             th * 0.7, "HVAC-TEXTO", rot=90.0)
    for a in res["equipment"].get("ahus", []):
        cx, cy = P(a["level"], a["x"], a["y"])
        _rect(msp, cx - 600, cy - 400, cx + 600, cy + 400, "HVAC-EQUIP")
        _txt(msp, f"FC/AHU {a['nominal_tr']} TR", cx, cy, th, "HVAC-TEXTO")

    # quadro de cargas
    qx = (gx1 + off[levels[-1]] + 6.0) * MM
    qy = gy1 * MM
    cols = [3.0, 1.2, 1.6, 1.0, 1.6, 3.6]
    heads = ["AMBIENTE", "ÁREA m²", "CARGA W", "TR", "VAZÃO m³/h", "EQUIPAMENTO"]
    rh = 0.28 * MM
    eq_by_room = {u["room_id"]: u for u in res["units"]}
    rows = []
    for l in res["loads"]:
        u = eq_by_room.get(l["room_id"])
        eq = (f"{u['quantidade']}x {u.get('nominal_btuh') or str(u.get('nominal_kw')) + ' kW'}" if u else "ver FC/AHU")
        rows.append([l["name"], l["area_m2"], l["total_w"], l["total_tr"], l["supply_m3h"], eq])
    tw = sum(cols) * MM
    _txt(msp, "QUADRO DE CARGAS TÉRMICAS", qx, qy + rh * 1.5, th_big, "HVAC-QUADRO", TA.LEFT)
    for ri, row in enumerate([heads] + rows):
        y = qy - ri * rh
        msp.add_line((qx, y), (qx + tw, y), dxfattribs={"layer": "HVAC-QUADRO"})
        x = qx
        for ci, val in enumerate(row):
            _txt(msp, str(val), x + 80, y - rh / 2, th * 0.85, "HVAC-QUADRO", TA.MIDDLE_LEFT)
            x += cols[ci] * MM
    yb = qy - (len(rows) + 1) * rh
    msp.add_line((qx, yb), (qx + tw, yb), dxfattribs={"layer": "HVAC-QUADRO"})
    t = res["totals"]
    _txt(msp, f"TOTAL: {t['total_w']} W = {t['total_tr']} TR = {t['total_btuh']} BTU/h", qx, yb - rh, th, "HVAC-QUADRO", TA.LEFT)

    # legenda
    ly = yb - rh * 4
    _txt(msp, "LEGENDA", qx, ly, th_big, "HVAC-LEGENDA", TA.LEFT)
    items = [("HVAC-DUTO-INS", "Duto retangular de insuflamento (LxA mm | vazão)"),
             ("HVAC-DIFUSOR", "Difusor de insuflamento (tag + m³/h)"),
             ("HVAC-GRELHA", "Grelha de retorno (tag + LxA mm)"),
             ("HVAC-FLEX", "Duto flexível isolado"),
             ("HVAC-EQUIP", "Equipamento (UE/UC/FC)"),
             ("HVAC-REFRIG", "Tubulação de refrigerante (líquido/gás)"),
             ("HVAC-DRENO", "Dreno de condensado")]
    for i, (lyr, desc) in enumerate(items, 1):
        y = ly - i * rh
        msp.add_line((qx, y), (qx + 1200, y), dxfattribs={"layer": lyr})
        _txt(msp, desc, qx + 1500, y, th * 0.85, "HVAC-LEGENDA", TA.MIDDLE_LEFT)

    # selo
    p = res["project"]
    resp = responsible or {}
    sy = gy0 * MM - 8.0 * MM
    sx = gx0 * MM
    _rect(msp, sx, sy - 3.6 * MM, sx + 16.0 * MM, sy, "HVAC-SELO")
    lines = [f"PROJETO: {p['name']}", f"CLIENTE: {p['client']}   LOCAL: {p['address']}",
             f"SISTEMA: {p['system'].upper()}   ESCALA: 1:{scale}   DATA: {dt.date.today():%d/%m/%Y}",
             f"RESP. TÉCNICO: {resp.get('name', '')}  CREA: {resp.get('crea', '')}  ART: {resp.get('art', '')}",
             "PRÉ-DIMENSIONAMENTO — sujeito a conferência e validação do responsável técnico"]
    for i, s in enumerate(lines):
        _txt(msp, s, sx + 200, sy - (i + 0.7) * 0.65 * MM, th, "HVAC-SELO", TA.MIDDLE_LEFT)

    doc.saveas(path)
