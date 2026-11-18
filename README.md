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

## Central de Laudos

A Central de Laudos reúne a emissão, edição, assinatura e publicação dos laudos técnicos da VL Engenharia.

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

---

## 5. Módulo de Prospecção B2B

O módulo `/admin/prospeccao` é restrito ao MASTER. Os dados ficam nas coleções Firestore `leads`, `campanhas`, `mensagens_modelo`, `envios`, `supressao` e `config_prospeccao`. Aplique as regras atualizadas antes de habilitar o painel:

```bash
firebase deploy --only firestore:rules
npm run test:prospeccao
npm run lint
npm run build
```

O catálogo inicial está em `config/servicos-prospeccao.json`. Os códigos e descrições de CNAE foram comparados com o endpoint oficial de subclasses do IBGE/CONCLA (`https://servicodados.ibge.gov.br/api/v2/cnae/subclasses`); segmentos sem correspondência inequívoca usam palavras-chave para revisão humana. O MASTER pode editar as normas, argumentos e dados de segmentos no painel; as alterações operacionais são gravadas em `config_prospeccao/principal`.

### Backend e segredos

As rotas de envio, busca e descadastro exigem o Express ativo (Vercel `api/[...path].ts` ou servidor Node). Firebase Hosting estático sozinho não executa essas rotas. Configure os segredos no ambiente do backend, nunca no navegador:

- `FIREBASE_SERVICE_ACCOUNT_JSON` **ou** `GOOGLE_APPLICATION_CREDENTIALS`: credencial de serviço Firebase Admin com acesso ao mesmo projeto Firestore usado pelo front-end.
- `VITE_FIRESTORE_DATABASE_ID`: database ID não-default, caso o projeto use um.
- `PROSPECCAO_UNSUBSCRIBE_SECRET`: segredo aleatório longo para assinar tokens de descadastro.
- `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `ZOHO_FROM_NAME`, `ZOHO_FROM_EMAIL`: SMTP Zoho. Use senha de aplicativo gerada em **Conta Zoho → Segurança → Senhas de aplicativo**, não sua senha principal.
- `GEMINI_API_KEY`: usada apenas no servidor para sugerir variações de texto.
- Opcionais: `PROSPECCAO_CNPJ_API_URL`/`PROSPECCAO_CNPJ_API_KEY` para um fornecedor que consulte a base aberta; `GOOGLE_PLACES_API_KEY`; `PROSPECCAO_DKIM_SELECTORS`.

Copie `.env.example` como referência. No Vercel, cadastre os mesmos valores em Project Settings → Environment Variables. Nunca publique JSON de service account nem credenciais Zoho no Firebase Hosting.

### Fluxo e limites

- O modo **dry-run começa ligado**. O envio direto só é possível após o MASTER desligá-lo em Configurações.
- WhatsApp funciona em modo assistido (`wa.me`), com revisão/envio manual. Não há automação por gateway não oficial.
- E-mail oferece preparação via `mailto:` e, se SMTP estiver configurado, envio individual Zoho após confirmação. Máximo efetivo de 30 e-mails/dia, janela seg–sex configurada para `America/Recife`, limite de intervalo mínimo, validação de MX e verificação da supressão no servidor.
- O link `/api/prospeccao/descadastrar?token=...` grava hashes de e-mail/telefone em `supressao`; não mantém o contato em claro. Tokens expiram em 180 dias e o endpoint aplica rate limit simples por IP.
- Busca CNPJ online depende de um provedor compatível configurado por ambiente. A importação CSV funciona sem esse serviço. Google Places é opcional e fornece somente dados que o próprio Places disponibiliza.
- Todas as mensagens devem ser revisadas individualmente. Campanhas são listas/rascunhos; iniciar uma campanha não dispara em lote. Follow-up automatizado, controle de duas tentativas por campanha, pausa por taxa de bounce e monitoramento de respostas não estão implementados nesta etapa.

### Entregabilidade e conformidade

Antes de enviar, publique SPF, DKIM e DMARC para o domínio remetente e confirme os registros com o painel. O checklist DNS é indicativo; os registros corretos e limites devem ser confirmados no console Zoho. Respeite os limites do plano, aqueça a conta gradualmente e pare ao observar bounces ou reclamações. Use apenas contatos corporativos de pessoas jurídicas, registre fonte/finalidade de legítimo interesse e honre descadastro imediatamente. Não importe listas compradas nem contate endereços pessoais sem base legal.

Zoho Mail API/OAuth, rascunhos nativos IMAP/API, leitura IMAP de respostas/bounces, webhook WhatsApp Cloud API, extração de contatos de sites com `robots.txt` e follow-up não estão ativados nesta etapa; não configure envio em massa esperando esses recursos. O modo disponível de rascunho é `mailto:` e o WhatsApp é assistido.
