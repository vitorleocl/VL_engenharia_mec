"""Teste de fumaça ponta a ponta: API -> DXF/IFC/memorial. Rode: pytest -q"""
import json, os, zipfile
from pathlib import Path

os.environ["DEV"] = "1"
os.environ["DATA_DIR"] = "/tmp/vl-hvac-test-jobs"

import ezdxf, ifcopenshell
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
EX = Path(__file__).parent.parent / "examples"


def _payload(system):
    p = json.loads((EX / "exemplo_dutado.json").read_text())
    p["system"] = system
    return p


def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_auth_required(monkeypatch):
    monkeypatch.delenv("DEV")
    monkeypatch.setenv("API_KEY", "segredo")
    assert client.post("/v1/projects/calculate", json=_payload("split")).status_code == 401
    r = client.post("/v1/projects/calculate", json=_payload("split"), headers={"X-API-Key": "segredo"})
    assert r.status_code == 200


def test_validation_dutado_sem_ahu():
    p = _payload("dutado"); p.pop("ahu")
    assert client.post("/v1/projects/calculate", json=p).status_code == 422


def test_cidade_desconhecida():
    p = _payload("split"); p["climate"] = {"city": "Atlantis"}
    assert client.post("/v1/projects/calculate", json=p).status_code == 422


def test_split_calculo():
    r = client.post("/v1/projects/calculate", json=_payload("split")).json()
    assert len(r["units"]) == 4 and r["condensers"] and r["ducts"] == []
    assert all(l["total_w"] > 0 for l in r["loads"])


def test_generate_dutado_arquivos(tmp_path):
    r = client.post("/v1/projects/generate", json=_payload("dutado"))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["result"]["ducts"] and j["result"]["diffusers"]
    out = {}
    for n in ("planta_hvac.dxf", "modelo_hvac.ifc", "memorial.html"):
        f = client.get(j["files"][n]); assert f.status_code == 200
        (tmp_path / n).write_bytes(f.content); out[n] = tmp_path / n
    doc = ezdxf.readfile(out["planta_hvac.dxf"])
    assert len(list(doc.modelspace().query('LWPOLYLINE[layer=="HVAC-DUTO-INS"]'))) == len(j["result"]["ducts"])
    ifc = ifcopenshell.open(str(out["modelo_hvac.ifc"]))
    assert len(ifc.by_type("IfcDuctSegment")) == len(j["result"]["ducts"])
    assert len(ifc.by_type("IfcSpace")) == 4
    z = client.get(j["bundle"]); assert zipfile.ZipFile(__import__("io").BytesIO(z.content)).testzip() is None


def test_path_traversal():
    assert client.get("/v1/jobs/../../etc/passwd/files/x").status_code in (400, 404)
    assert client.get("/v1/jobs/" + "a" * 32 + "/files/../../x").status_code in (404, 405)


def test_from_dxf(tmp_path):
    d = ezdxf.new(); m = d.modelspace(); d.layers.add("AMBIENTES")
    m.add_lwpolyline([(0, 0), (5000, 0), (5000, 4000), (0, 4000)], close=True, dxfattribs={"layer": "AMBIENTES"})
    m.add_text("SALA 01", dxfattribs={"insert": (500, 500), "height": 100})
    p = tmp_path / "a.dxf"; d.saveas(p)
    r = client.post("/v1/rooms/from-dxf", files={"file": ("a.dxf", p.read_bytes())}, data={"layer": "AMBIENTES"})
    assert r.status_code == 200
    room = r.json()["rooms"][0]
    assert room["w"] == 5.0 and room["l"] == 4.0 and room["name"] == "SALA 01"


def test_ifc_geometria_em_metros(tmp_path):
    """Regressão: unidades em metros e orientação dos perfis (largura em X/Y, altura em Z)."""
    import ifcopenshell.geom as geom
    import numpy as np
    j = client.post("/v1/projects/generate", json=_payload("dutado")).json()
    (tmp_path / "m.ifc").write_bytes(client.get(j["files"]["modelo_hvac.ifc"]).content)
    f = ifcopenshell.open(str(tmp_path / "m.ifc"))
    st = geom.settings(); st.set("use-world-coords", True)

    def bbox(e):
        v = np.array(geom.create_shape(st, e).geometry.verts).reshape(-1, 3)
        return v.min(0), v.max(0)

    sala = next(x for x in f.by_type("IfcSpace") if x.Name == "Escritório")
    lo, hi = bbox(sala)
    assert np.allclose(lo, [10, 5, 0], atol=0.01) and np.allclose(hi, [18, 10, 2.7], atol=0.01)
    seg = j["result"]["ducts"][0]
    d = next(x for x in f.by_type("IfcDuctSegment") if x.Name == seg["id"])
    lo, hi = bbox(d)
    ext = sorted((hi - lo).round(3))
    assert np.allclose(ext, sorted([seg["length_m"], seg["width_m"], seg["height_m"]]), atol=0.01)


def test_generate_split_vrf_e_multipavimento():
    for system in ("split", "vrf"):
        p = _payload(system)
        extra = json.loads(json.dumps(p["rooms"][0])); extra.update(id="R9", name="Sala 2º pav", level=1, roof_exposed=True)
        p["rooms"].append(extra)
        r = client.post("/v1/projects/generate", json=p)
        assert r.status_code == 200, r.text
        res = r.json()["result"]
        assert {u["level"] for u in res["units"]} == {0, 1}
        assert (res["condensers"] != []) == (system == "split")
        assert client.get(r.json()["files"]["planta_hvac.dxf"]).status_code == 200
