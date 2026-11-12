Você é um engenheiro full-stack sênior trabalhando no sistema da VL Engenharia (painel técnico). O sistema JÁ existe e funciona: Orçamentos (editor de proposta no "Modelo Aprovado, 6 folhas A4"), Checklist de campo, Central de laudos (editor de laudo), Clientes e Equipamentos. NÃO reconstrua nada. Corrija e evolua o que existe, mantendo o visual do painel (tema escuro, mesmos componentes).

ANEXOS
1. laudo-novo-layout.html e Laudo_LAR-2026-001_novo-layout.pdf: modelo aprovado do laudo (A4, 6 folhas). É a referência exata de HTML, CSS, estrutura e textos. A faixa amarela "MINUTA ILUSTRATIVA" e os trechos amarelos "preencher" são estados do sistema (ver Parte D), não conteúdo fixo.
2. proposta-novo-layout.html: referência já implantada do orçamento (mesmo sistema visual).
3. Três prints do sistema atual: editor de orçamento, editor de laudo, checklist de campo.

IDEIA CENTRAL
Hoje cada tela é uma ilha e o usuário redigita a mesma informação. O fluxo deve ser uma cadeia de registros ligados por ID, sem redigitar:
Cliente + Equipamento → Orçamento aprovado → Checklist de campo (vistoria) → Laudo (rascunho gerado) → ART anexada → Emissão com código de verificação.

PASSO 0: LEIA ANTES DE ALTERAR
Leia o código das telas e do gerador de PDF. Descreva em até 15 linhas: como orçamento, checklist e laudo são armazenados e ligados hoje, e onde os dados se duplicam. Liste os arquivos que vai alterar. Só continue depois disso. Peça confirmação antes de qualquer migração destrutiva.

PARTE A: ORÇAMENTOS (corrigir o que os prints mostram)
Problemas observados e correções:
A1. Valor total R$ 0,00: a linha do memorial ficou com unitário 0,00 (qtd 6), então o cabeçalho mostra "Valor: R$ 0,00". O orçamento PROP-2026/002 valia R$ 2.280,00 (6 × R$ 380,00). Restaure o unitário a partir do histórico e bloqueie exportar/baixar PDF com total zerado.
A2. Dados duplicados: o memorial de cálculo existe no formulário e de novo como tabela dentro do texto rico; prazo, condições de pagamento e validade estão digitados como texto com ícones, e o QR aparece como imagem enorme dentro do texto. Faça do formulário a única fonte: memorial, prazo, parcelas, validade, cronograma, PIX e nota fiscal viram campos estruturados e são renderizados pelo layout do PDF. Remova esses blocos duplicados do texto rico (migrando o conteúdo, sem perder informação) e deixe o texto rico apenas para textos livres.
A3. QR do PIX: hoje é uma imagem enviada ("Inserir Imagem do QR Code"). Gere o código "copia e cola" no padrão BR Code (EMV) com chave, titular (máx. 25 caracteres), cidade e valor da 1ª parcela, CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF) sobre todo o texto incluindo "6304", e o QR em SVG com zona de silêncio de 4 módulos. Remova o upload manual de QR. Teste automático: chave 10287093409, nome "VITOR LEONARDO CORDEIRO L", cidade "RECIFE", sem valor, resulta exatamente em 00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0.
A4. Contador antigo: o cabeçalho da seção mostra "SEÇÃO 4 DE 13" com apenas 6 seções. Calcule pelo número real.
A5. Faixa de aviso "Edição de Instância Isolada": o texto "…credenciais fixas" colide com "6 de 6 páginas ativas no PDF". Quebre em duas linhas ou mova o contador para a direita com largura fixa.
A6. Legibilidade: tabela dentro do editor escuro com texto cinza sobre fundo escuro (baixo contraste). Garanta contraste mínimo 4,5:1 e ofereça "Folha clara (como no PDF)" como visual padrão da área de edição.
A7. Navegação redundante: lista de 6 seções com "Anterior / Próxima / Página 4 de 6". Remova o paginador e deixe só a lista.
A8. Nota fiscal mudou para "Sem NFS-e (Recibo + ART)". Mantenha o campo, mas mostre aviso quando divergir da versão anterior do orçamento e peça confirmação ao salvar.
A9. Cabeçalho do editor: título quebra em duas linhas e os botões se espremem. Agrupe: ação principal "Baixar PDF"; secundárias em menu "Mais" (Imprimir direto, Histórico, Modelo Base, Excluir).

PARTE B: CHECKLIST DE CAMPO
Problemas: só caixas de marcar (sem Conforme / Não conforme / N.A.), sem observação por item, "Anexar foto" global e não por item, checklist de "Prensa hidráulica · Metalúrgica Recife" enquanto o laudo em andamento é do ativo PGX-9708 (NR-11), e "Enviar ao laudo" sem escolher qual laudo.
Implemente:
B1. Cada item tem 3 botões grandes (mínimo 48 px de altura): Conforme, Não conforme, N.A. Sem estado inicial marcado. Ícone + texto, não só cor.
B2. Por item: campo de observação (obrigatório quando Não conforme), botão de foto com câmera do celular (várias fotos, com legenda curta), e campo opcional de medição (valor + unidade + valor de referência). Ao marcar Não conforme, pedir a classificação de risco (Baixo, Médio, Alto, Crítico) e a ação recomendada sugerida.
B3. Cabeçalho do checklist ligado a um Equipamento e a um Orçamento aprovado (seleção, não texto livre), com data e hora automáticas, e geolocalização opcional.
B4. Modelos de checklist por tipo de serviço (NR-11 içamento, NR-12 máquinas, NR-13, PMOC, vibração FFT). Cada item tem número, texto, norma de referência e item de laudo ao qual pertence. Editáveis em Configurações.
B5. Progresso "n de N verificados" e botão "Concluir vistoria" só habilitado quando todos os itens tiverem resultado. Itens Não conforme sem observação bloqueiam a conclusão.
B6. Offline de verdade: salvar cada resposta localmente (IndexedDB) a cada toque, fila de sincronização visível ("3 itens pendentes"), foto comprimida no aparelho (máx. 1600 px no lado maior, JPEG qualidade 80) e envio em segundo plano. Se houver conflito, manter ambas as versões e avisar.
B7. "Enviar ao laudo" vira "Gerar laudo a partir desta vistoria": cria (ou atualiza) um laudo rascunho já preenchido (Parte C), sem duplicar se já existir um laudo ligado a este checklist.
B8. Histórico de vistorias: lista com equipamento, data, resultado (n conformes / n não conformes) e laudo gerado.

PARTE C: EDITOR DE LAUDOS
Problemas: cliente aparece literalmente como "Cliente / Sem CNPJ" e "Orçamento: Não associado"; as 4 seções têm o mesmo texto padrão ("Minuta Padrão") que afirma "atendimento pleno aos requisitos" antes de qualquer inspeção; o texto trata o título do laudo como se fosse o ativo ("…no ativo Laudo de Liberação e Conformidade NR-11 / NR-12"); o status da tela diz "ART: Pendente de Emissão" enquanto o PDF imprimiu "ART Homologada" com número; o botão de anexar a ART (obrigatório) fica no fim da página; há muitos botões no cabeçalho; "Redação IA" e "Expandir com IA" sem salvaguardas.
Implemente:
C1. Criação do laudo a partir de Orçamento aprovado + Equipamento + Checklist. Preencha automaticamente cliente (razão social, CNPJ, contato), local, ativo/TAG, fabricante, modelo, nº de série, capacidade, data da vistoria e norma(s). O botão "Associar Orçamento" e "Importar Checklist" viram seleção obrigatória na criação.
C2. Estrutura do laudo em campos, não só texto rico: parecer do perito (Liberado / Liberado com restrições / Não liberado), local e acompanhante da vistoria, método, normas de referência (lista com título), instrumentos (nome, nº de série, certificado de calibração, validade), limitações e premissas (texto padrão editável), próxima inspeção recomendada (data), histórico de revisões.
C3. Cada seção (item) tem: título, resultado (Conforme / Não conforme / N.A., herdado do checklist e editável), critério de referência, constatação (texto rico), medições (tabela opcional), evidências fotográficas com legenda. Grupos vazios (medições, fotos) não aparecem no PDF.
C4. Não conformidades como registros: ID (NC-01, NC-02…), descrição, risco, ação recomendada, prazo, item e foto de referência. Geradas a partir dos itens Não conforme do checklist e editáveis. O parecer sugerido é calculado: sem NC = Liberado; NC de risco Baixo ou Médio = Liberado com restrições; NC Alto ou Crítico = Não liberado. O perito pode alterar, com justificativa registrada.
C5. Texto padrão ("Minuta Padrão") deve ser neutro e só descrever o método, sem afirmar conformidade. Corrija o bug do "ativo" usando o campo Ativo/TAG. O texto de cada seção deve vir marcado como "a preencher" até o perito editar.
C6. Linha do tempo de estado no topo: Rascunho → Em revisão → ART anexada → Emitido. O anexo da ART fica logo abaixo dessa linha do tempo, com o número da ART como campo obrigatório. O texto "ART Homologada / Registrada" no PDF só aparece quando o arquivo da ART estiver anexado e o número preenchido. Enquanto não estiver emitido, o PDF sai com a faixa "MINUTA, sem validade até a anexação da ART e a emissão" (como no modelo).
C7. Cabeçalho enxuto: ação principal conforme o estado ("Revisar", "Anexar ART", "Emitir laudo"); secundárias no menu "Mais" (Revisões, Importar checklist, Exportar minuta, Excluir). Mostre "Salvo às hh:mm" e um indicador de pendências ("4 pendências").
C8. IA de redação com salvaguardas: só reescreve e organiza o que o perito já registrou nos campos e no checklist, nunca inventa medições, normas, datas ou resultados. Todo texto gerado por IA entra marcado "revisar" e não permite emitir o laudo até o perito aceitar ou editar cada trecho. Registrar no histórico quando um trecho veio de IA.
C9. Emissão: ao emitir, congelar a revisão (somente leitura), gerar o código de verificação (ex.: LAR-2026-001-7K4Q), registrar o hash do PDF e publicar a página pública /verificar/{código}, que mostra apenas: número, revisão, cliente (razão social), ativo, data da vistoria, parecer, responsável técnico, número da ART e status (vigente ou substituído por revisão posterior). Correções depois da emissão geram nova revisão (Rev. 01), nunca editam a anterior.

PARTE D: PDF DO LAUDO (layout aprovado)
D1. Reproduza o laudo-novo-layout.html: capa com parecer em destaque (escala Liberado, Liberado com restrições, Não liberado) e quadro de dados; folha de resumo e escopo; checklist normativo com chips de resultado; constatações por item com evidências; não conformidades e plano de ação; parecer conclusivo, responsável técnico e bloco de autenticidade com QR para /verificar.
D2. Mesma tecnologia do orçamento: rota só de impressão, HTML/CSS A4, @page { size: 210mm 297mm; margin: 0 }, Chromium (window.print() ou page.pdf com preferCSSPageSize e printBackground). Remova jsPDF e html2canvas do laudo também. Fontes Barlow Semi Condensed e Source Serif 4 self-hosted. Meta: texto selecionável, links ativos, menos de 500 KB. O PDF atual (6 imagens JPEG, 2 MB) é substituído.
D3. Paginação por conteúdo: cada item de constatação começa em bloco sem quebra interno (break-inside: avoid); fotos em grade de 2 (item) ou 3 (complementar). Se o número de itens ou fotos exceder a folha, o laudo cresce em folhas, mantendo cabeçalho, rodapé de controle (cliente, laudo, revisão, vistoria, ART, folha n/N) e a numeração "Folha n / N" correta.
D4. Campos vazios obrigatórios aparecem destacados em amarelo no PDF de minuta e bloqueiam a emissão (Parte E).
D5. Nome do arquivo: Laudo_LAR-AAAA-NNN_Cliente_RevNN.pdf.

PARTE E: VERIFICAÇÕES ANTES DE BAIXAR / EMITIR
Mostre uma lista de pendências clicável (cada item leva ao campo) e bloqueie a emissão quando houver erro:
- Cliente sem CNPJ, sem contato ou ainda com o texto "Cliente".
- Equipamento sem fabricante, modelo, nº de série ou capacidade.
- Texto-padrão não editado, trechos de IA não revisados, legendas de foto vazias.
- Item Não conforme sem NC, ou NC sem risco, ação ou prazo.
- Parecer incompatível com as NC (ex.: "Liberado" com NC de risco Alto).
- Instrumento sem certificado ou com calibração vencida na data da vistoria.
- Norma sem edição informada (ex.: NBR 8400).
- ART sem arquivo ou sem número; número da ART divergente entre tela e PDF.
- Checklist ligado a equipamento diferente do laudo.
- Folha com menos de 35% de preenchimento (apenas aviso).
No orçamento: total zerado, soma diferente do memorial, quantidade diferente dos ativos, validade vencida, CRC do PIX inválido.

MODELO DE DADOS (resumo)
Equipamento(id, tag, fabricante, modelo, serie, capacidade, clienteId). ChecklistModelo(id, tipoServico, itens[numero, texto, norma, secaoLaudo]). Vistoria(id, equipamentoId, orcamentoId, modeloId, respostas[itemId, resultado, observacao, risco, medicao, fotos[]], iniciadaEm, concluidaEm). Laudo(id, numero, revisao, estado, orcamentoId, vistoriaId, equipamentoId, parecer, justificativaParecer, local, acompanhante, metodo, normas[], instrumentos[], secoes[], naoConformidades[], proximaInspecao, art{numero, arquivoId}, emitidoEm, codigoVerificacao, hashPdf). Reaproveite as tabelas existentes e migre sem apagar dados.

REGRAS
- Não invente dados. Textos marcados como sugestão no modelo (classificação de risco padrão, limitações e premissas) ficam em Configurações, editáveis por tipo de serviço.
- Não mude cores, tipografia nem espaçamentos do modelo sem avisar.
- Preserve o que já funciona: salvar, histórico de revisões, status, excluir, edição de instância isolada, modo claro/escuro do painel.
- Laudos já existentes continuam abrindo e exportando. Ofereça "Converter para o novo layout" com confirmação; sem migração em massa.
- Trabalhe em etapas, nesta ordem: Parte A, Parte B, Parte C, Parte D, Parte E. Ao final de cada uma, mostre o que mudou e como testou, e só avance depois do teste.

CRITÉRIOS DE ACEITE
1. Orçamento PROP-2026/002 mostra R$ 2.280,00, sem blocos duplicados, e o PIX sai gerado com o valor da 1ª parcela (teste do BR Code passa).
2. No celular, é possível concluir um checklist sem internet, com fotos por item, e ele sincroniza ao voltar a conexão.
3. "Gerar laudo a partir desta vistoria" cria um laudo com cliente, equipamento, itens, resultados e NC preenchidos, sem redigitar.
4. O PDF do laudo sai com 6 folhas para o exemplo LAR-2026-001, igual ao modelo, com menos de 500 KB, texto selecionável e QR de verificação funcionando.
5. Sem arquivo e número de ART, o PDF sai como minuta e não afirma que a ART está homologada.
6. Todas as verificações da Parte E funcionam e bloqueiam a emissão quando aplicável.
7. Orçamentos e laudos antigos continuam abrindo.

Ao final, entregue: resumo do que mudou, arquivos alterados, como testou e o que ficou pendente.
