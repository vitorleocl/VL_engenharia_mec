"""VL Engenharia — Serviço HVAC (FastAPI).

Endpoints principais:
  POST /v1/projects/calculate   -> cargas, equipamentos, dutos, lista de materiais (JSON)
  POST /v1/projects/generate    -> calcula + gera DXF, IFC, memorial (HTML/MD), JSON e ZIP
  GET  /v1/jobs/{id}/files/{nome}   |  GET /v1/jobs/{id}/bundle.zip
  POST /v1/rooms/from-dxf       -> extrai ambientes de um DXF de arquitetura
  GET  /v1/catalog/cities       -> cidades da tabela climática interna
"""
from __future__ import annotations

import hmac
import json
import os
import re
import shutil
import tempfile
import time
import uuid
import zipfile
from pathlib import Path

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from .climate import CITIES
from .dxf_gen import generate_dxf
from .dxf_import import rooms_from_dxf
from .engine import run
from .ifc_gen import generate_ifc
from .memorial import build_memorial
from .models import Project

DATA_DIR = Path(os.getenv("DATA_DIR", "/tmp/vl-hvac-jobs"))
JOB_TTL_H = float(os.getenv("JOB_TTL_HOURS", "24"))
MAX_UPLOAD_MB = 25
ALLOWED_FILES = {"planta_hvac.dxf", "modelo_hvac.ifc", "memorial.html", "memorial.md",
                 "resultado.json", "pacote_hvac.zip"}
JOB_RE = re.compile(r"^[0-9a-f]{32}$")

app = FastAPI(title="VL Engenharia — Serviço HVAC", version="1.0.0")


def auth(x_api_key: str | None = Header(default=None)) -> None:
    expected = os.getenv("API_KEY", "")
    if not expected:
        if os.getenv("DEV") == "1":
            return
        raise HTTPException(500, "API_KEY não configurada no servidor")
    if not x_api_key or not hmac.compare_digest(x_api_key, expected):
        raise HTTPException(401, "API key inválida")


def _cleanup() -> None:
    if not DATA_DIR.exists():
        return
    limit = time.time() - JOB_TTL_H * 3600
    for d in DATA_DIR.iterdir():
        if d.is_dir() and d.stat().st_mtime < limit:
            shutil.rmtree(d, ignore_errors=True)


def _job_dir(job_id: str) -> Path:
    if not JOB_RE.match(job_id):
        raise HTTPException(400, "job_id inválido")
    d = DATA_DIR / job_id
    if not d.is_dir():
        raise HTTPException(404, "job não encontrado ou expirado")
    return d


@app.get("/health")
def health():
    return {"status": "ok", "version": app.version}


@app.get("/v1/catalog/cities", dependencies=[Depends(auth)])
def cities():
    return {"aviso": "valores aproximados de referência — validar na NBR 16401-1",
            "cidades": {k: {"tbs": v[0], "tbu": v[1], "altitude_m": v[2]} for k, v in CITIES.items()}}


def _calc(prj: Project) -> dict:
    try:
        return run(prj)
    except ValueError as e:
        raise HTTPException(422, str(e))


@app.post("/v1/projects/calculate", dependencies=[Depends(auth)])
def calculate(prj: Project):
    return _calc(prj)


@app.post("/v1/projects/generate", dependencies=[Depends(auth)])
def generate(prj: Project):
    res = _calc(prj)
    _cleanup()
    job_id = uuid.uuid4().hex
    d = DATA_DIR / job_id
    d.mkdir(parents=True, exist_ok=True)
    resp = prj.responsible.model_dump()
    md, html = build_memorial(res, resp, prj.analysis_markdown)
    (d / "memorial.md").write_text(md, encoding="utf-8")
    (d / "memorial.html").write_text(html, encoding="utf-8")
    (d / "resultado.json").write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
    generate_dxf(res, str(d / "planta_hvac.dxf"), scale=prj.options.scale, responsible=resp)
    generate_ifc(res, str(d / "modelo_hvac.ifc"))
    with zipfile.ZipFile(d / "pacote_hvac.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for n in ("planta_hvac.dxf", "modelo_hvac.ifc", "memorial.html", "memorial.md", "resultado.json"):
            z.write(d / n, n)
    base = f"/v1/jobs/{job_id}"
    return {
        "job_id": job_id,
        "expires_in_hours": JOB_TTL_H,
        "totals": res["totals"],
        "warnings": res["warnings"],
        "files": {n: f"{base}/files/{n}" for n in sorted(ALLOWED_FILES)},
        "bundle": f"{base}/bundle.zip",
        "result": res,
    }


@app.get("/v1/jobs/{job_id}/files/{name}", dependencies=[Depends(auth)])
def get_file(job_id: str, name: str):
    if name not in ALLOWED_FILES:
        raise HTTPException(404, "arquivo desconhecido")
    p = _job_dir(job_id) / name
    if not p.is_file():
        raise HTTPException(404, "arquivo não encontrado")
    return FileResponse(p, filename=name)


@app.get("/v1/jobs/{job_id}/bundle.zip", dependencies=[Depends(auth)])
def get_bundle(job_id: str):
    p = _job_dir(job_id) / "pacote_hvac.zip"
    if not p.is_file():
        raise HTTPException(404, "pacote não encontrado")
    return FileResponse(p, filename="pacote_hvac.zip", media_type="application/zip")


@app.post("/v1/rooms/from-dxf", dependencies=[Depends(auth)])
async def from_dxf(file: UploadFile = File(...), layer: str = Form("AMBIENTES"),
                   unit_to_m: float = Form(0.001)):
    data = await file.read()
    if len(data) > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"arquivo maior que {MAX_UPLOAD_MB} MB")
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "in.dxf"
        p.write_bytes(data)
        try:
            return rooms_from_dxf(str(p), layer, unit_to_m)
        except Exception as e:  # DXF inválido / camada inexistente
            return JSONResponse(status_code=422, content={"detail": f"DXF não pôde ser lido: {e}"})
