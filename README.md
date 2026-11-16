# VL Engenharia — Manual de Implantação e Operação

Sistema Full-Stack Institucional + Painel Administrativo de Engenharia Mecânica e Emissão de Laudos Técnicos com ART (CREA-PE 1822299490).

---

## 1. Configuração de Variáveis de Ambiente

Crie os arquivos `.env` apropriados para cada ambiente.

### `.env.production` (Produção: `vl-engenharia-prod`)
```env
GEMINI_API_KEY="AIzaSy..."
GEMINI_MONTHLY_LIMIT=1000
VITE_MASTER_EMAIL="vitorleonardocl@gmail.com"

# Firebase Config (Produção)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="vl-engenharia-prod.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="vl-engenharia-prod"
VITE_FIREBASE_STORAGE_BUCKET="vl-engenharia-prod.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="520053391223"
VITE_FIREBASE_APP_ID="1:520053391223:web:..."
```

### `.env.staging` (Homologação: `vl-engenharia-staging`)
```env
GEMINI_API_KEY="AIzaSy..."
GEMINI_MONTHLY_LIMIT=200
VITE_MASTER_EMAIL="vitorleonardocl@gmail.com"

# Firebase Config (Staging)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="vl-engenharia-staging.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="vl-engenharia-staging"
VITE_FIREBASE_STORAGE_BUCKET="vl-engenharia-staging.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="987654321000"
VITE_FIREBASE_APP_ID="1:987654321000:web:..."
```

Para rodar localmente com o ambiente desejado:
```bash
# Para Staging:
npm run dev -- --mode staging

# Para Produção:
npm run dev -- --mode production
```

---

## Projetos técnicos e integração HVAC-R

A Central de Laudos e Projetos oferece cadastro de projetos HVAC-R, PPCI e Mecânicos. O módulo HVAC-R consome o microserviço Python da pasta `vl-hvac-service/` para cálculo de pré-dimensionamento, importação de ambientes DXF e geração de DXF, IFC, memorial e ZIP. Os projetos são salvos em `projetosEngenharia` no Firestore e mantidos em `localStorage` como fallback.

### Variáveis do backend Node

Configure no serviço Node/Express (não no bundle do frontend):

```env
HVAC_SERVICE_URL=https://url-interna-do-servico-hvac
HVAC_API_KEY=segredo-compartilhado-com-o-servico-hvac
HVAC_TIMEOUT_MS=90000
GEMINI_API_KEY=...
```

`FIREBASE_WEB_API_KEY`, `FIREBASE_PROJECT_ID` e `FIRESTORE_DATABASE_ID` são opcionais e, por padrão, usam os valores de `firebase-applet-config.json`. A chave `HVAC_API_KEY` nunca é enviada ao navegador. As rotas de HVAC validam o token Firebase e exigem perfil ativo de `master` ou `colaborador`; limitam geração a 5 jobs e importação DXF a 10 uploads por janela de 15 minutos. Arquivos aceitos para download são allowlisted e os jobs ficam vinculados ao usuário que os gerou.

### Deploy do microserviço

1. Crie um segundo serviço Railway/Render usando `vl-hvac-service/` como diretório raiz e o `Dockerfile` incluso.
2. Configure `API_KEY` no serviço Python com o mesmo valor de `HVAC_API_KEY` do serviço Node. Em produção, não habilite `DEV=1`.
3. Configure `HVAC_SERVICE_URL` no Node para a URL privada HTTPS/interna do serviço Python. Se usar URL pública, use HTTPS.
4. Em ambos os serviços, configure porta via `$PORT`. O health check Python é `/health`. Use volume persistente para `data/` no Node se quiser preservar o mapa temporário de acesso dos jobs após reinícios; os arquivos de geração expiram em até 24 h no serviço Python.
5. Regras Firestore: implante a regra da coleção `projetosEngenharia` junto às regras já existentes.

### Deploy do backend Node e roteamento `/api/*`

O domínio público da aplicação é servido pela Vercel. A pasta `api/` expõe o Express como função serverless e `vercel.json` configura a duração máxima da função. Assim, `/api/*` chega às rotas existentes no `server.ts` no mesmo domínio do frontend.

No projeto Vercel, configure estas variáveis de ambiente no ambiente de produção (e faça um novo deploy):

- `HVAC_SERVICE_URL`: URL do serviço Python.
- `HVAC_API_KEY`: segredo compartilhado com o serviço Python; prefira armazená-lo no Secret Manager.
- `GEMINI_API_KEY`: necessária para a análise textual com IA.
- `FIREBASE_WEB_API_KEY`, `FIREBASE_PROJECT_ID` e `FIRESTORE_DATABASE_ID`: opcionais, se precisar substituir os padrões do arquivo de configuração.

O frontend chama `/api/hvac/*` relativamente ao próprio domínio. O runtime Vercel define `VERCEL`, então o Express é exportado para a função sem abrir uma porta; no desenvolvimento local, o servidor continua iniciando normalmente via `npm run dev`.

Depois do deploy Vercel, teste `GET /api/hvac/health` sem autenticação: deve responder **401** (a rota existe e está exigindo sessão), em vez de 404. Pelo painel autenticado, uma resposta 503 nessa rota indica que o backend foi alcançado, mas a configuração/conectividade do microserviço Python ainda precisa ser corrigida.

O cálculo é feito exclusivamente pelo serviço Python. Os resultados e o memorial são de **pré-dimensionamento** e precisam de validação do responsável técnico. DXF não é DWG; IFC não é `.rvt`. Os dados de entrada/resultados ficam no projeto para permitir regenerar os artefatos após expirarem.

Para validar o serviço localmente, siga `vl-hvac-service/README.md` (`pip install -r requirements.txt`, `DEV=1 uvicorn app.main:app --reload` e `pytest -q`). Para usar a integração pelo painel, inicie também o Node com `HVAC_SERVICE_URL` e `HVAC_API_KEY` configurados e entre com uma sessão Firebase autorizada.

---

## 2. Backup Programado do Firestore (Cloud Scheduler + Storage)

Como laudos técnicos de engenharia envolvem responsabilidade civil e criminal (ART), a política de backup deve ser rigorosa:

1. **Criação do Bucket de Backup:**
   ```bash
   gcloud storage buckets create gs://vl-engenharia-backups-firestore --location=southamerica-east1
   ```
2. **Definição de Retenção (Lifecycle Rule):**
   - Retenção mínima de 5 anos (prazo prescricional de ART e obras de engenharia).
3. **Agendamento diário via Cloud Scheduler (às 02h da manhã):**
   ```bash
   gcloud scheduler jobs create http firestore-daily-backup \
       --schedule="0 2 * * *" \
       --uri="https://firestore.googleapis.com/v1/projects/vl-engenharia-prod/databases/(default):exportDocuments" \
       --message-body='{"outputUriPrefix":"gs://vl-engenharia-backups-firestore/daily"}' \
       --oauth-service-account-email="backup-sa@vl-engenharia-prod.iam.gserviceaccount.com"
   ```

---

## 3. Deploy no Firebase Hosting e Firestore Rules

```bash
# 1. Build da aplicação
npm run build

# 2. Deploy das regras de segurança e índices
firebase deploy --only firestore:rules,storage:rules

# 3. Deploy do frontend
firebase deploy --only hosting
```

---

## 4. Persistência Offline

O aplicativo vem configurado com persistência offline do Firestore (`persistentLocalCache` com IndexedDB) e fallback local reativo no painel administrativo. Em locais de campo (fábricas, canteiros ou minerações sem sinal de internet), todos os cadastros, laudos, checklists e orçamentos continuam 100% operacionais e sincronizam automaticamente ao restabelecer a conexão.
