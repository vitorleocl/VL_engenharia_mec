import { doc, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { criarDocumentosGuiaPadrao } from './guiaTecnicoCatalogo';

/**
 * Inicializa somente documentos ausentes. Transação protege contra duas
 * primeiras aberturas simultâneas e nunca substitui modelos já configurados.
 * Deve ser chamada pelo fluxo autenticado do MASTER.
 */
export async function inicializarModelosGuiaAusentes(emailMaster: string): Promise<number> {
  const modelos = criarDocumentosGuiaPadrao(emailMaster);
  let criados = 0;

  for (const modelo of modelos) {
    const foiCriado = await runTransaction(db, async (transacao) => {
      const referencia = doc(db, 'guia_modelos', modelo.servico);
      const existente = await transacao.get(referencia);
      if (existente.exists()) return false;
      transacao.set(referencia, modelo);
      return true;
    });
    if (foiCriado) criados += 1;
  }

  return criados;
}
