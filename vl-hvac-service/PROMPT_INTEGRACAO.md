# PROMPT — Integrar o módulo "Projeto HVAC (DXF + IFC/Revit)" ao sistema de laudos da VL Engenharia

> Cole o texto abaixo (a partir de "## Contexto") no assistente de código que tem acesso ao repositório do
> sistema de laudos (Claude Code, Cursor etc.). O microserviço já está pronto na pasta `vl-hvac-service/`
> (README.md e `examples/exemplo_dutado.json` mostram o contrato).

---

## Contexto

Você vai trabalhar no sistema de laudos de engenharia da **VL Engenharia**: aplicação full-stack com
**backend Node.js** e **frontend HTML/CSS/JS**, que chama a **API do Claude por um proxy no servidor**, gera
laudos de vários tipos (LAR, LMP, LMG, LIV, LRM, LPG, PMOC, RTM, PCM, LAG), tem upload de mídias, cálculo de
risco HRN, templates de prompt especializados (inclusive um de **carga térmica HVAC — NBR 16401/ASHRAE**) e
**exportação em HTML**. O deploy é no **Railway/Render**.

**Antes de escrever código:** leia o repositório inteiro e siga as convenções que já existem (estrutura de
pastas, estilo das rotas, como os tipos de laudo e os templates de prompt são registrados, como o estado do
frontend é organizado, como a exportação HTML funciona, como os laudos são salvos e como o usuário é
autenticado). Reaproveite o que existir; não crie um padrão paralelo. Se algo abaixo conflitar com o que o
código já faz, siga o código e me avise no resumo final.

## Objetivo

Adicionar um módulo **"Projeto de Climatização (HVAC)"** que, a partir dos ambientes informados no sistema
(ou importados de um DXF de arquitetura), gere:

1. Cargas térmicas por ambiente, seleção de equipamentos, dutos, difusores, grelhas e lista de materiais;
2. **Planta 2D em DXF** (o engenheiro salva como DWG no AutoCAD);
3. **Modelo IFC** (o engenheiro importa/vincula no Revit);
4. **Memorial** em HTML/Markdown, integrado ao padrão visual dos laudos e à exportação HTML existente.

Os cálculos e arquivos são feitos por um **microserviço Python (FastAPI) separado**, que já está pronto.
O sistema de laudos apenas o consome. **Não reimplemente cálculo, DXF nem IFC em JavaScript.**

## Arquitetura

```
Navegador ──► Backend Node (auth existente) ──► Serviço HVAC (Python, X-API-Key) ──► DXF / IFC / memorial / JSON
                      │
                      └──► API do Claude (proxy existente) — apenas para o texto da análise crítica (item 7)
```

- O navegador **nunca** fala com o serviço HVAC e **nunca** vê a `HVAC_API_KEY`.
- O serviço HVAC roda como **segundo serviço** (Docker) no mesmo projeto Railway/Render, de preferência
  em rede privada; se for público, exige HTTPS + `X-API-Key`.

## Contrato do serviço HVAC (resumo)

Base: `HVAC_SERVICE_URL`. Header em todas as rotas `/v1/*`: `X-API-Key: <HVAC_API_KEY>`.

| Método | Rota | Uso |
|---|---|---|
| GET | `/health` | health check (sem chave) |
| GET | `/v1/catalog/cities` | cidades da tabela climática |
| POST | `/v1/projects/calculate` | só cálculo → JSON |
| POST | `/v1/projects/generate` | cálculo + arquivos → `{ job_id, totals, warnings, files, bundle, result }` |
| GET | `/v1/jobs/{id}/files/{nome}` | `planta_hvac.dxf`, `modelo_hvac.ifc`, `memorial.html`, `memorial.md`, `resultado.json` |
| GET | `/v1/jobs/{id}/bundle.zip` | pacote completo |
| POST | `/v1/rooms/from-dxf` | multipart: `file`, `layer` (padrão `AMBIENTES`), `unit_to_m` (0.001 = DXF em mm) |

Payload (ver `examples/exemplo_dutado.json`): `name`, `client`, `address`, `system` (`split`|`vrf`|`dutado`),
`setpoint_c`, `rh_pct`, `climate` (`{city}` ou `{tbs,tbu,altitude_m}`), `ahu {x,y}` (obrigatório em `dutado`),
`rooms[]` (`id`, `name`, `use`, `level`, `x`, `y`, `w`, `l`, `height_m`, `occupants?`, `lighting_w_m2?`,
`equipment_w?`, `roof_exposed`, `facades[]` com `orientation`, `length_m`, `glazing_area_m2`, `wall_u`,
`glazing_u`, `glazing_shgc`, `shading_factor`), `responsible {name, crea, art}`, `options`.
Valores de `use`: `escritorio`, `sala_reuniao`, `sala_aula`, `auditorio`, `loja`, `consultorio`,
`restaurante`, `dormitorio`, `laboratorio`, `recepcao`. Orientações: `N NE E SE S SW W NW`.
Erros de validação voltam como HTTP 422 com `detail`. Os arquivos gerados expiram em 24 h.

## Tarefas

### 1. Configuração
- Novas variáveis de ambiente: `HVAC_SERVICE_URL`, `HVAC_API_KEY`, `HVAC_TIMEOUT_MS` (padrão 90000).
  Documente no `.env.example` e no README do sistema. Falhe com mensagem clara se faltarem em produção.

### 2. Cliente do serviço (backend)
- Crie um módulo único (por exemplo `services/hvacClient`) com `health()`, `cities()`, `calculate(payload)`,
  `generate(payload)`, `downloadFile(jobId, name)` (stream), `bundle(jobId)` e `roomsFromDxf(buffer, layer, unitToM)`.
- Timeout por chamada; **sem retry** em `generate`; retry curto só em `health`.
- Converta HTTP 422 em erros por campo, em português, que o frontend consiga exibir ao lado do campo.
  Converta 401/5xx/timeout em mensagens genéricas ("Serviço de projeto HVAC indisponível") **sem vazar**
  URL, chave ou stack trace.

### 3. Rotas do backend (proxy autenticado)
- `POST /api/hvac/calculate`, `POST /api/hvac/generate`, `GET /api/hvac/cities`,
  `POST /api/hvac/rooms-from-dxf` (upload com limite de 25 MB, aceitar só `.dxf`),
  `GET /api/hvac/jobs/:jobId/files/:name` e `GET /api/hvac/jobs/:jobId/bundle` (repassam o stream).
- Use o middleware de autenticação/autorização existente. Valide `jobId` (`^[0-9a-f]{32}$`) e `name`
  (lista fixa de arquivos) antes de repassar. Aplique rate limit em `generate` e no upload de DXF.
- O `responsible` (nome, CREA, ART) deve vir da **configuração/perfil da VL Engenharia que o sistema já
  tem** — não deixe fixo no código nem peça ao usuário a cada projeto.

### 4. Persistência
- O job expira em 24 h. Salve com o projeto/laudo: o **payload de entrada**, o **`resultado.json`** e o
  `job_id`. Para reabrir depois, **regenere a partir do payload salvo** (o serviço é determinístico) ou
  armazene os arquivos no storage que o sistema já usa — escolha o que combinar melhor com a persistência atual.

### 5. Novo tipo de documento
- Registre "Projeto de Climatização (HVAC)" como tipo novo, seguindo exatamente como os outros tipos são
  registrados. Sugestão de sigla: **PHV** (confirme que não colide com as existentes).

### 6. Frontend — tela do projeto HVAC
- **Dados gerais:** nome, cliente, endereço, sistema (split/VRF/dutado), condições internas, cidade
  (carregada de `/api/hvac/cities`) ou TBS/TBU manuais; ponto da casa de máquinas (x, y) quando `dutado`.
- **Tabela editável de ambientes** (adicionar, duplicar, remover): id, nome, uso, pavimento, x, y, largura,
  comprimento, pé-direito, ocupantes (opcional), cobertura exposta, e uma **sub-tabela de fachadas** por
  ambiente (orientação, comprimento, área de vidro, fator de proteção solar).
- **Importar ambientes de DXF:** upload + campo de camada + unidade; preencher a tabela com o retorno e
  **destacar** ambientes com `is_rectangle: false` ("usa o retângulo envolvente — conferir").
- **Calcular:** mostra o quadro de cargas (W, TR, m³/h, equipamento sugerido), totais e a lista de `warnings`.
- **Gerar pacote:** botões para baixar DXF, IFC, memorial e ZIP. Estados de carregamento, erros por campo,
  desabilitar o botão durante a geração.
- **Aviso fixo e visível** (não removível): "Pré-dimensionamento por método simplificado. Os resultados
  precisam ser conferidos e validados pelo responsável técnico. O DXF abre no AutoCAD (salvar como DWG) e o
  IFC é importado/vinculado no Revit; não é arquivo .rvt nativo."
- Siga o visual e os componentes do restante do sistema.

### 7. Texto técnico com o Claude (recomendado)
Use o proxy do Claude **já existente**, com o template de carga térmica HVAC que o sistema tem, para redigir a
**introdução, a análise crítica e as recomendações** do memorial. **O modelo não recalcula nada**: recebe o
`resultado.json` e redige em cima dele. Template sugerido:

```
SYSTEM:
Você é engenheiro mecânico sênior redigindo o memorial técnico de um projeto de climatização para a
VL Engenharia. Use EXCLUSIVAMENTE os números do JSON fornecido; não recalcule, não arredonde de outro modo
e não invente valores, normas, marcas ou modelos. Se um dado necessário não estiver no JSON, escreva
"a confirmar em projeto". Cite apenas normas que constem em "Normas e referências" do memorial.
Mantenha o tom técnico em português do Brasil. Não afirme conformidade com norma; diga que os valores são
de pré-dimensionamento sujeitos à validação do responsável técnico.

USER:
Dados do projeto e resultados (JSON):
<resultado>{{resultado_json}}</resultado>

Redija, em Markdown:
1. Introdução (objeto, sistema adotado, área e nº de ambientes) — 1 parágrafo
2. Análise crítica dos resultados — apontar os 3 ambientes de maior carga específica (W/m²) e o que mais
   pesa em cada um (use components_w), e comentar os "warnings"
3. Recomendações e pontos a validar em campo/projeto — lista curta
Não repita as tabelas.
```
- Anexe o texto gerado ao memorial (seção própria "Análise do projetista (gerada com IA — revisar)").

### 8. Exportação HTML
- Incorpore o `memorial.html` (ou seus blocos) ao fluxo de exportação HTML existente, com a identidade
  visual da VL; inclua links/anexos para o DXF e o IFC conforme o modelo de exportação atual.

### 9. Deploy
- Adicione ao repositório (ou referencie) a pasta `vl-hvac-service/` com seu `Dockerfile`; configure como
  **segundo serviço** (porta via `$PORT`, health check `/health`, variável `API_KEY` igual à `HVAC_API_KEY`
  do backend). Lembre que o disco é efêmero — por isso o item 4. Documente o passo a passo no README.

### 10. Segurança e privacidade
- Chave só no servidor; validação de entrada no backend antes de repassar; checar que o usuário logado
  tem acesso ao projeto/laudo do `jobId`; logs **sem** dados de cliente ou payload completo; nomes de
  arquivo sanitizados nos downloads; limite de tamanho no upload.

### 11. Testes e critérios de aceite
- Testes do cliente (com mock do serviço) e das rotas (auth, validação, erros 422/5xx/timeout).
- Teste ponta a ponta com `examples/exemplo_dutado.json`: calcular → gerar → baixar DXF, IFC e memorial.
- **Aceite:** (a) fluxo completo funciona logado e falha com 401 sem login; (b) chave do serviço não aparece
  em nenhuma resposta nem no código do navegador; (c) DXF baixado abre e tem as camadas `HVAC-*`;
  (d) IFC baixado abre em um visualizador IFC e contém `IfcSpace`, `IfcDuctSegment` e `IfcAirTerminal`;
  (e) o aviso de pré-dimensionamento aparece na tela, no memorial e no selo do DXF; (f) projeto salvo
  reabre e regenera os arquivos; (g) erros de validação aparecem em português junto ao campo.

## O que NÃO fazer
- Não duplicar a lógica de cálculo no Node nem no navegador.
- Não expor `HVAC_API_KEY` nem a URL do serviço ao navegador.
- Não afirmar que o DXF é DWG nem que o IFC é .rvt.
- Não remover nem suavizar os avisos de pré-dimensionamento.
- Não preencher CREA/ART por conta própria; use os dados configurados do responsável técnico.
- Não alterar os tipos de laudo, templates e exportações existentes além do necessário para integrar.

## Entrega
Ao final, devolva um resumo curto: arquivos criados/alterados, variáveis de ambiente novas, como rodar os
testes, como subir o segundo serviço, e qualquer ponto em que você seguiu o código existente em vez deste
prompt. Liste também o que ficou **pendente ou não pôde ser testado**.
