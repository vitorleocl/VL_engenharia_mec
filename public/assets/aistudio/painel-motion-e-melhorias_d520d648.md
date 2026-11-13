# Painel VL: movimento e melhorias (Visão geral)

## 1. Movimento (sem alterar conteúdo)
Arquivos: `vl-painel-motion.css` e `vl-painel-motion.js`. Instalação no `index.html` do projeto:
- antes de `</head>`: `<link rel="stylesheet" href="/vl-painel-motion.css">`
- antes de `</body>`: `<script src="/vl-painel-motion.js" defer></script>`

O que acontece: cabeçalho aparece; itens do menu entram em sequência; título, texto e botão "Novo laudo" sobem; faixa de indicadores aparece e cada número "pula" ao entrar; cartões e linhas da tabela entram em cascata. Troca de página: só o miolo (`main`) anima, cabeçalho e menu ficam parados. Troca de tema: fusão de cores. Ícones do menu avançam no hover; botões respondem ao toque. "Reduzir movimento" do sistema desliga tudo.

## 2. Melhorias sugeridas (todas usando só dados que já existem na tela)
1. **Fluxo dos laudos**: barra segmentada (Em elaboração 1 · Com ART 1) e orçamentos abertos 0. Responde "onde estão meus laudos?" sem abrir a Central.
2. **Filtros rápidos na tabela**: Todos / ART emitida / Aguardando, com contagem.
3. **Status com ponto de cor e texto** (não só cor), melhor para daltônicos e impressão.
4. **Linha clicável com seta** ao passar o mouse (já é clicável, mas nada indica).
5. **Selo "Master"** no menu estava colado em "Auditoria e acessos": dar espaço.

## 3. Problemas de conteúdo que vale corrigir
- Códigos em dois formatos: `LAU-2026/002` e `LAR-2026-001`. Padronize um só (ex.: `LAR-AAAA-NNN`).
- Cliente do laudo LAR-2026-001 aparece como "Cliente" (nome genérico). Exigir cliente real antes de salvar.
- "Aguardando" não diz o que se espera (ART? assinatura? cliente?). Trocar por "Aguardando ART" ou similar.
- Saudação fixa em "Boa noite": calcular pela hora local.
- Cartão "0 Orçamentos abertos" ao lado de menu "Orçamentos 4": deixar claro o que cada número conta.

## 4. Próximos passos de produto
- Bloco "Precisa da sua atenção" (vencimentos de laudos e ART pendente), ordenado por urgência.
- Atalhos "Novo orçamento / Novo checklist" ao lado de "Novo laudo".
- Estado vazio útil quando não há laudos ("Crie o primeiro laudo a partir de um checklist concluído").
- Indicador de sincronização do checklist de campo no cabeçalho.
