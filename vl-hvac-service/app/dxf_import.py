"""Extrai ambientes (retângulos) de um DXF de arquitetura: polilinhas fechadas numa camada."""
from __future__ import annotations

import ezdxf


def _shoelace(pts: list[tuple[float, float]]) -> float:
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]))) / 2


def rooms_from_dxf(path: str, layer: str, unit_to_m: float = 0.001) -> dict:
    """unit_to_m: 0.001 (DXF em mm), 0.01 (cm) ou 1.0 (m).

    Usa o retângulo envolvente (bbox) de cada polilinha fechada; a área real
    (fórmula de Gauss) vai junto para conferência. Textos (TEXT/MTEXT) dentro do
    bbox viram o nome do ambiente.
    """
    doc = ezdxf.readfile(path)
    msp = doc.modelspace()
    texts = []
    for e in msp.query("TEXT MTEXT"):
        s = e.dxf.text if e.dxftype() == "TEXT" else e.plain_text()
        ins = e.dxf.insert
        texts.append((ins.x * unit_to_m, ins.y * unit_to_m, s.strip().replace("\n", " ")))

    rooms, skipped = [], 0
    for e in msp.query("LWPOLYLINE"):
        if e.dxf.layer != layer or not e.closed:
            continue
        pts = [(float(p[0]) * unit_to_m, float(p[1]) * unit_to_m) for p in e.get_points("xy")]
        if len(pts) < 3:
            skipped += 1
            continue
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
        name = next((s for tx, ty, s in texts if x0 <= tx <= x1 and y0 <= ty <= y1 and s), "")
        rooms.append({"id": f"A{len(rooms) + 1:02d}", "name": name or f"Ambiente {len(rooms) + 1}",
                      "x": round(x0, 3), "y": round(y0, 3), "w": round(x1 - x0, 3), "l": round(y1 - y0, 3),
                      "area_real_m2": round(_shoelace(pts), 2),
                      "is_rectangle": bool(abs(_shoelace(pts) - (x1 - x0) * (y1 - y0)) < 0.02 * (x1 - x0) * (y1 - y0))})
    return {"layer": layer, "count": len(rooms), "rooms": rooms,
            "note": "Ambientes não retangulares usam o bbox; confira 'is_rectangle' e 'area_real_m2'."}
