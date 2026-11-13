# Movimento no site VL (sem alterar conteúdo)

Dois arquivos: `vl-site-motion.css` e `vl-site-motion.js`. Nenhum texto, cor ou layout muda.

## Instalação (Google AI / seu projeto React + Vite)
1. Copie os dois arquivos para `public/` (ou `src/`).
2. No `index.html`, antes de `</head>`: `<link rel="stylesheet" href="/vl-site-motion.css">`
3. No `index.html`, antes de `</body>`: `<script src="/vl-site-motion.js" defer></script>`
Pronto. O script espera o React montar, etiqueta os blocos por seletor (`#trabalhos`, `#servicos`, `#processo`, `#faq`, `#contato`, `header.top`, `.track .wk`, `.stars`, `.big`) e anima.

## O que acontece
- Entrada do herói em sequência (foto, título, texto, botões, indicadores).
- Seções entram uma vez ao rolar, com atraso crescente (cartões, linhas de serviços, avaliações, passos, perguntas, formulário).
- "5,0" conta de 0,0 até 5,0; estrelas aparecem uma a uma; números 1, 2, 3 dos passos "pulam" ao entrar.
- Cabeçalho ganha sombra ao rolar; barra fina de leitura no topo; linha azul desliza sob o item do menu da seção atual.
- Cartões de trabalhos levantam no hover; fotos dão zoom lento; botões respondem ao toque.
- Acordeões (serviços e dúvidas): o texto entra junto com a abertura.
- Troca de tema: cores fazem fusão em vez de piscar.
- Troca de rota interna: conteúdo entra com fade e sobe; volta ao topo.
- Rolagem suave nos links do menu.

## Segurança
- Só `opacity`, `translate` e `scale`. Animações usam `backwards`, então nunca travam hover nem o React.
- Não troca nem remove nós do React: usa atributos `data-*` e adiciona só dois elementos soltos no `<body>` (barra e indicador).
- Quem usa "reduzir movimento" no sistema vê o site exatamente como está hoje.
- Sem JavaScript, nada fica escondido.

## Observação sobre o carrossel
Na captura, as imagens dos cartões de "Trabalhos realizados" aparecem sobrepostas aos títulos (o título fica cortado). Na prévia, usei imagem em cima e texto embaixo. Vale revisar o CSS de `.wph` e `.tx` no site real.
