# Guia de implementação: PDF das propostas da VL Engenharia

Referência visual: `Proposta_PROP-2026-002_Alpha_novo-layout.pdf`. Código de referência (HTML + CSS A4, fontes e imagens embutidas): `proposta-novo-layout.html`.

## 1. O que foi encontrado no PDF atual (PROP-2026/002)

| Achado | Evidência | Efeito |
|---|---|---|
| O PDF é uma pilha de fotos | Produzido por jsPDF 4.2.1; 13 JPEGs de 1588×2246 px, nenhuma fonte embutida, nenhum texto | 5,9 MB, texto não selecionável nem pesquisável, e-mail e telefone sem link, chave PIX não copiável, QR Code borrado |
| Uma seção por página | 10 das 13 páginas têm 40% ou mais de área vazia | O valor só aparece na página 12 |
| Texto interno vazou para o cliente | Pág. 9: "Você pode inserir fotos adicionais… pelo editor rico" e uma caixa de foto vazia | Aparência de documento inacabado |
| Dados que se contradizem | "6 bombas" (pág. 9 e 12) × "01 Ativo Principal" (pág. 11); razão social completa na capa × "Alpha" nas págs. 7 e 12 | Questionamento do cliente e risco comercial |
| Promessas sem conteúdo | Pág. 8 cita "cronograma executivo" e "condições facilitadas de parcelamento"; a pág. 12 tem só 50% + 50% e nenhum cronograma | Expectativa não cumprida |
| Metodologia genérica | Fases 2 e 3 citam líquidos penetrantes, espessura de chapas, soldas e NBR 13857 em uma proposta de vibração FFT | Parece modelo reaproveitado |
| Faltam dados de controle | Sem data de emissão (a validade de 15 dias não tem início nem fim), sem revisão, sem CNPJ da VL | Documento sem rastreabilidade |
| PIX | QR sem valor; chave é o CPF pessoal do titular | Cliente precisa digitar o valor |

## 2. Gerar PDF vetorial (maior ganho)

1. Remover jsPDF + html2canvas. Criar uma rota só de impressão (por exemplo `/admin/orcamentos/:id/imprimir`) que renderiza a proposta em HTML/CSS no tamanho A4.
2. Gerar o PDF com o motor de impressão do Chromium: `page.pdf({ preferCSSPageSize: true, printBackground: true })` no Playwright ou Puppeteer, ou `window.print()` no botão atual.
3. CSS essencial: `@page { size: 210mm 297mm; margin: 0 }`, `print-color-adjust: exact`, `break-inside: avoid` nos blocos, `break-after: page` só onde a página deve terminar.
4. Esperar `document.fonts.ready` e o carregamento das imagens antes de gerar.
5. Usar o logotipo em SVG, foto em JPEG de até 150 KB e fontes em subset. Nada de `box-shadow` grande, `backdrop-filter` ou gradientes de fundo.
6. Definir `<title>` do documento e o nome do arquivo: `Proposta_PROP-2026-002_Alpha_Rev00.pdf`.

Resultado medido no protótipo: 6 páginas, 157 KB (97% menor), texto selecionável, links de WhatsApp, e-mail e índice funcionando.

## 3. Estrutura e fluxo de páginas

- Ordem: capa com resumo e preço, Etapa 1 (partes e escopo), Etapa 2 (metodologia), Etapa 3 (investimento e aceite), anexo institucional. Se preferir a credencial antes do preço, basta reordenar os blocos no editor.
- Paginação por conteúdo, não por seção: agrupar seções em "folhas" e deixar o fluxo quebrar só entre blocos.
- Um rodapé de controle (legenda) em todas as folhas: contratante, código, revisão, emissão, validade, folha n/N. Isso substitui o cabeçalho repetido 13 vezes.
- Modos de exportação: "Executiva" (folhas 1 a 4) e "Completa" (com anexo).

## 4. Campos novos no modelo de dados

- `emitidaEm`, `validadeDias` e `validaAte` (calculado), `revisao`.
- `contratada.cnpj` (a VL).
- `parcelas[]` com percentual, gatilho e valor calculado.
- `pix.copiaECola` e QR gerados a partir de chave, nome, cidade e valor da parcela (padrão BR Code, CRC16 validado).
- `incluso[]` e `foraDoEscopo[]`.
- `cronograma[]` (marcos e prazos).
- `ativos[]`, de onde saem a quantidade da tabela de preço e o texto de "ativos inspecionados" (fonte única).

## 5. Verificação antes de exportar

Bloquear ou avisar quando houver:
- Texto-padrão ou de editor ("conforme especificação do cliente", "pelo editor rico", caixas de imagem vazias).
- Campo obrigatório vazio (CNPJ da VL, e-mail do cliente).
- Soma do memorial diferente do total, ou quantidade diferente de `ativos[]`.
- Razão social diferente do cadastro do cliente.
- Validade vencida.
- Página com menos de 35% de preenchimento.
- Código PIX com CRC inválido.

## 6. Conteúdo que eu sugeri e que você precisa validar

- "Fora do escopo": reparos e trocas de peças, paradas e acessos a cargo do contratante, reanálise sob nova proposta.
- Linha "Medições e análise" (mancais, FFT, ISO 20816, falhas típicas): ajuste ao que a VL realmente executa.
- Cronograma e "Como aprovar", derivados dos prazos que já estavam na proposta (48 h úteis, 7 dias úteis, 50% + 50%).
- Parcelas de R$ 1.140,00 e QR PIX com o valor da 1ª parcela. O payload original foi decodificado e regenerado com o mesmo resultado (chave, titular, cidade, CRC); só o valor foi acrescentado. Teste no app do banco antes de usar.
- No índice, "condições facilitadas de parcelamento" virou "pagamento em 2 parcelas", para bater com a página de preço.
- A fase 02 da metodologia ganhou parênteses mais claros na lista de normas; o conteúdo é o mesmo.
- Considere usar a chave PIX do CNPJ em vez do CPF pessoal.
- Considere variantes de metodologia por tipo de serviço (vibração, NR-12, NR-13, PMOC), para a proposta não carregar fases de outro serviço.
