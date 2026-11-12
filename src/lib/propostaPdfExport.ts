import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface ExportarPropostaPdfOptions {
  codigo?: string;
  clienteNome?: string;
  revisao?: string;
}

/**
 * Compila todas as folhas A4 (.sheet) dentro de um container DOM em um arquivo PDF multi-página
 * sem depender de window.open() ou popups externos (compatível com iframes e desktop/mobile).
 */
export async function exportarPropostaParaPdf(
  container: HTMLElement,
  options: ExportarPropostaPdfOptions = {}
): Promise<string> {
  const sheets = container.querySelectorAll<HTMLElement>('.sheet');
  if (!sheets || sheets.length === 0) {
    throw new Error('Nenhuma folha A4 encontrada para exportação em PDF.');
  }

  // Aguarda fontes carregarem com limite de segurança para nunca travar
  try {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1200)),
      ]);
    }
  } catch {
    // Segue mesmo se a API de fontes não responder
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  for (let i = 0; i < sheets.length; i++) {
    if (i > 0) {
      pdf.addPage('a4', 'p');
    }

    const sheetEl = sheets[i];
    const canvas = await html2canvas(sheetEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
      onclone: (clonedDoc) => {
        clonedDoc.documentElement.classList.remove('dark');
        clonedDoc.documentElement.removeAttribute('data-theme');
        clonedDoc.body.classList.remove('dark');
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  const codigoClean = (options.codigo || 'PROP').replace(/[^a-zA-Z0-9_-]/g, '-');
  const clienteClean = (options.clienteNome || 'Cliente')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30) || 'Cliente';
  const revisao = (options.revisao || '00').replace(/[^a-zA-Z0-9_-]/g, '');

  const nomeArquivo = `Proposta_${codigoClean}_${clienteClean}_Rev${revisao}.pdf`;
  pdf.save(nomeArquivo);
  return nomeArquivo;
}
