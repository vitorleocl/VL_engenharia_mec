"""Gera modelo IFC4 (IfcOpenShell) com ambientes, dutos, terminais e equipamentos.

O Revit importa/vincula IFC; os elementos chegam como geometria com propriedades
(Pset VL_HVAC). Não é um .rvt nativo — para famílias nativas use revit/pyrevit_create_from_json.py.
"""
from __future__ import annotations

import numpy as np
import ifcopenshell
import ifcopenshell.api as api


def _matrix(origin, direction=(0, 0, 1)) -> np.ndarray:
    """Matriz 4x4 que leva o eixo local Z para 'direction' e posiciona em 'origin'."""
    z = np.array(direction, float)
    z /= np.linalg.norm(z)
    if abs(z[2]) > 0.99:        # vertical: X local = X global (largura em X, profundidade em Y)
        x = np.array([1.0, 0.0, 0.0])
    else:
        x = np.cross(np.array([0.0, 0.0, 1.0]), z)
        x /= np.linalg.norm(x)
    y = np.cross(z, x)
    m = np.eye(4)
    m[:3, 0], m[:3, 1], m[:3, 2], m[:3, 3] = x, y, z, origin
    return m


def _rect_profile(f, w: float, d: float):
    pos = f.create_entity("IfcAxis2Placement2D", Location=f.create_entity("IfcCartesianPoint", Coordinates=(0.0, 0.0)))
    return f.create_entity("IfcRectangleProfileDef", ProfileType="AREA", XDim=w, YDim=d, Position=pos)


def generate_ifc(res: dict, path: str) -> None:
    f = api.run("project.create_file", version="IFC4")
    proj = api.run("root.create_entity", file=f, ifc_class="IfcProject", name=res["project"]["name"])
    api.run("unit.assign_unit", file=f, length={"is_metric": True, "raw": "METERS"})  # unidades em metros
    ctx = api.run("context.add_context", file=f, context_type="Model")
    body = api.run("context.add_context", file=f, context_type="Model", context_identifier="Body",
                   target_view="MODEL_VIEW", parent=ctx)
    site = api.run("root.create_entity", file=f, ifc_class="IfcSite", name="Terreno")
    bld = api.run("root.create_entity", file=f, ifc_class="IfcBuilding", name=res["project"]["name"])
    api.run("aggregate.assign_object", file=f, products=[site], relating_object=proj)
    api.run("aggregate.assign_object", file=f, products=[bld], relating_object=site)

    fh = res["meta"]["floor_height_m"]
    storeys: dict[int, object] = {}
    for lv in sorted({r["level"] for r in res["rooms"]}):
        st = api.run("root.create_entity", file=f, ifc_class="IfcBuildingStorey", name=f"Pavimento {lv}")
        st.Elevation = lv * fh
        api.run("aggregate.assign_object", file=f, products=[st], relating_object=bld)
        storeys[lv] = st

    def box(prod, w, d, h, origin, direction=(0, 0, 1)):
        prof = _rect_profile(f, w, d)
        rep = api.run("geometry.add_profile_representation", file=f, context=body, profile=prof, depth=h)
        api.run("geometry.assign_representation", file=f, product=prod, representation=rep)
        api.run("geometry.edit_object_placement", file=f, product=prod, matrix=_matrix(origin, direction))

    def pset(prod, **props):
        ps = api.run("pset.add_pset", file=f, product=prod, name="VL_HVAC")
        api.run("pset.edit_pset", file=f, pset=ps, properties=props)

    loads = {l["room_id"]: l for l in res["loads"]}

    for r in res["rooms"]:
        sp = api.run("root.create_entity", file=f, ifc_class="IfcSpace", name=r["name"])
        sp.LongName = r["id"]
        api.run("aggregate.assign_object", file=f, products=[sp], relating_object=storeys[r["level"]])
        box(sp, r["w"], r["l"], r["height_m"], (r["x"] + r["w"] / 2, r["y"] + r["l"] / 2, r["level"] * fh))
        ld = loads[r["id"]]
        pset(sp, area_m2=float(ld["area_m2"]), carga_total_W=float(ld["total_w"]),
             carga_sensivel_W=float(ld["sensible_w"]), carga_latente_W=float(ld["latent_w"]),
             carga_TR=float(ld["total_tr"]), vazao_insuflamento_m3h=float(ld["supply_m3h"]),
             ar_externo_m3h=float(ld["ar_externo_m3h"]), ocupantes=int(ld["occupants"]))

    for s in res["ducts"]:
        d = api.run("root.create_entity", file=f, ifc_class="IfcDuctSegment", name=s["id"],
                    predefined_type="RIGIDSEGMENT")
        dx, dy = s["x2"] - s["x1"], s["y2"] - s["y1"]
        zc = s["z_bottom_m"] + s["height_m"] / 2
        # extrusão ao longo da direção do trecho; perfil: largura (plano) x altura (vertical)
        horiz = abs(dy) < 1e-9
        direction = (np.sign(dx), 0, 0) if horiz else (0, np.sign(dy), 0)
        start = (s["x1"], s["y1"], zc)
        prof = _rect_profile(f, s["width_m"], s["height_m"])
        rep = api.run("geometry.add_profile_representation", file=f, context=body, profile=prof, depth=s["length_m"])
        api.run("geometry.assign_representation", file=f, product=d, representation=rep)
        # eixo local X = largura (horizontal, perpendicular ao trecho); Y = altura (vertical)
        z = np.array(direction, float)
        xloc = np.array([0.0, 1.0, 0.0]) if horiz else np.array([1.0, 0.0, 0.0])
        m = _matrix(start, direction)
        m[:3, 0], m[:3, 1] = xloc, np.cross(z, xloc)
        api.run("geometry.edit_object_placement", file=f, product=d, matrix=m)
        api.run("spatial.assign_container", file=f, products=[d], relating_structure=storeys[s["level"]])
        pset(d, vazao_m3h=float(s["flow_m3h"]), largura_mm=int(s["width_m"] * 1000),
             altura_mm=int(s["height_m"] * 1000), velocidade_ms=float(s["velocity_ms"]),
             perda_Pa_m=float(s["friction_pa_m"]), tipo=s["kind"])

    for i, dif in enumerate(res["diffusers"], 1):
        t = api.run("root.create_entity", file=f, ifc_class="IfcAirTerminal", name=f"D{i:02d}",
                    predefined_type="DIFFUSER")
        box(t, dif["size_m"], dif["size_m"], 0.10, (dif["x"], dif["y"], dif["z_m"] - 0.30))
        api.run("spatial.assign_container", file=f, products=[t], relating_structure=storeys[dif["level"]])
        pset(t, vazao_m3h=float(dif["flow_m3h"]), ambiente=dif["room_id"])

    for i, g in enumerate(res["grilles"], 1):
        t = api.run("root.create_entity", file=f, ifc_class="IfcAirTerminal", name=f"GR{i:02d}",
                    predefined_type="GRILLE")
        lv = g["level"]
        box(t, g["w_m"], g["h_m"], 0.05, (g["x"], g["y"], lv * fh + 2.4))
        api.run("spatial.assign_container", file=f, products=[t], relating_structure=storeys[lv])
        pset(t, vazao_m3h=float(g["flow_m3h"]), ambiente=g["room_id"])

    for i, u in enumerate(res["units"], 1):
        e = api.run("root.create_entity", file=f, ifc_class="IfcUnitaryEquipment", name=f"UE-{i:02d}",
                    predefined_type="SPLITSYSTEM")
        box(e, u["w_m"], u["d_m"], 0.30, (u["x"], u["y"], u["z_m"]))
        api.run("spatial.assign_container", file=f, products=[e], relating_structure=storeys[u["level"]])
        cap = u.get("nominal_btuh") or u.get("nominal_kw")
        pset(e, capacidade_nominal=float(cap), unidade="BTU/h" if "nominal_btuh" in u else "kW",
             ambiente=u["room_id"])

    for i, c in enumerate(res["condensers"], 1):
        e = api.run("root.create_entity", file=f, ifc_class="IfcUnitaryEquipment", name=f"UC-{i:02d}",
                    predefined_type="SPLITSYSTEM")
        box(e, 0.90, 0.60, 0.70, (c["x"], c["y"], c["level"] * fh))
        api.run("spatial.assign_container", file=f, products=[e], relating_structure=storeys[c["level"]])
        pset(e, capacidade_nominal_btuh=float(c["nominal_btuh"]), ambiente=c["room_id"])

    for a in res["equipment"].get("ahus", []):
        e = api.run("root.create_entity", file=f, ifc_class="IfcUnitaryEquipment", name=f"FC-{a['level']}",
                    predefined_type="AIRHANDLER")
        box(e, 1.20, 0.80, 1.20, (a["x"], a["y"], a["level"] * fh))
        api.run("spatial.assign_container", file=f, products=[e], relating_structure=storeys[a["level"]])
        pset(e, capacidade_TR=float(a["nominal_tr"]), vazao_m3h=float(a["vazao_ar_m3h"]))

    f.write(path)
