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
