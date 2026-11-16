# VL Engenharia — Serviço HVAC

Microserviço (FastAPI) que recebe os ambientes de um projeto e devolve:

- **Cargas térmicas** por ambiente (método simplificado de pré-dimensionamento)
- **Seleção de equipamentos** (split, VRF ou sistema dutado com fan-coil/AHU)
- **Dutos** retangulares dimensionados por perda de carga constante, difusores, grelhas, flexíveis
- **Planta 2D em DXF** (camadas HVAC, quadro de cargas, legenda, selo) — o AutoCAD salva como DWG
- **Modelo IFC4** (ambientes, dutos, terminais, equipamentos, propriedades `VL_HVAC`) — o Revit importa/vincula
- **Memorial** em HTML e Markdown + **lista de materiais** + `resultado.json`

## Rodar localmente

```bash
pip install -r requirements.txt
DEV=1 uvicorn app.main:app --reload          # DEV=1 dispensa a API key (só para testes locais)
pytest -q                                     # 10 testes ponta a ponta
curl -X POST localhost:8000/v1/projects/generate -H 'content-type: application/json' -d @examples/exemplo_dutado.json
```

Docs interativas: `http://localhost:8000/docs`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `API_KEY` | **Obrigatória** em produção. Enviada no header `X-API-Key`. |
| `DATA_DIR` | Pasta dos jobs gerados (padrão `/tmp/vl-hvac-jobs`; disco efêmero no Railway/Render). |
| `JOB_TTL_HOURS` | Tempo de retenção dos arquivos gerados (padrão 24). |
| `DEV=1` | Só para desenvolvimento: desliga a autenticação. |

## Endpoints

| Método | Rota | Função |
|---|---|---|
| GET | `/health` | Verificação de saúde (sem auth) |
| GET | `/v1/catalog/cities` | Cidades da tabela climática interna |
| POST | `/v1/projects/calculate` | Só cálculo (JSON) |
| POST | `/v1/projects/generate` | Cálculo + DXF + IFC + memorial + ZIP |
| GET | `/v1/jobs/{id}/files/{nome}` | Baixa `planta_hvac.dxf`, `modelo_hvac.ifc`, `memorial.html`, `memorial.md`, `resultado.json` |
| GET | `/v1/jobs/{id}/bundle.zip` | Pacote completo |
| POST | `/v1/rooms/from-dxf` | Extrai ambientes de um DXF (multipart: `file`, `layer`, `unit_to_m`) |

## Entrada (resumo)

`examples/exemplo_dutado.json` é um payload completo. Campos principais:

- `name`, `client`, `address`, `system` (`split` | `vrf` | `dutado`), `setpoint_c`, `rh_pct`
- `climate`: `{ "city": "Paulista" }` **ou** `{ "tbs": 32, "tbu": 25.5, "altitude_m": 10 }`
- `ahu`: `{ "x", "y" }` — obrigatório em `dutado` (casa de máquinas/shaft)
- `rooms[]`: `id`, `name`, `use`, `level`, `x`, `y`, `w`, `l` (metros), `height_m`, `occupants?`,
  `lighting_w_m2?`, `equipment_w?`, `roof_exposed`, `facades[]` (`orientation`, `length_m`,
  `glazing_area_m2`, `wall_u`, `glazing_u`, `glazing_shgc`, `shading_factor`)
- `responsible`: `{ name, crea, art }` (vai para o selo e o memorial)
- `options`: fator de segurança, ΔT de insuflamento, perda de carga dos dutos, escala de plotagem etc.

## Limitações (importante)

- **Pré-dimensionamento.** Carga térmica simplificada (não é o cálculo horário RTS/CTF). Os
  coeficientes ficam em `app/loads.py` para calibração. Resultado sujeito a conferência e
  assinatura do responsável técnico.
- **Tabela climática aproximada** (`app/climate.py`): validar com a NBR 16401-1 ou informar `tbs/tbu`.
- **Ambientes retangulares.** O modelo usa retângulos (x, y, w, l). A importação de DXF usa o bbox.
- **Dutos esquemáticos:** tronco no eixo da casa de máquinas e ramais ortogonais. Precisa de
  compatibilização com arquitetura, estrutura e forro.
- **VRF:** seleção de unidades internas e capacidade mínima da externa; traçado de refrigerante a detalhar.
- **DXF, não DWG.** Abra no AutoCAD e salve como DWG.
- **IFC, não .rvt.** O Revit importa/vincula o IFC. Para elementos nativos há `revit/pyrevit_create_from_json.py`,
  **que não foi testado no Revit** — rode primeiro em um projeto de teste.

## Estrutura

```
app/models.py      entrada (pydantic)        app/loads.py      carga térmica
app/climate.py     clima e psicrometria      app/equipment.py  seleção de equipamentos
app/ducts.py       dimensionamento de dutos  app/engine.py     orquestração, layout, materiais
app/dxf_gen.py     planta 2D (ezdxf)         app/ifc_gen.py    modelo IFC (IfcOpenShell)
app/memorial.py    memorial HTML/MD          app/dxf_import.py ambientes a partir de DXF
app/main.py        API                       revit/            script pyRevit (não testado)
```
