import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

if (typeof window !== 'undefined' && pdfjsLib) {
  // Configura o worker oficial do pdfjs-dist via Vite asset URL
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Converte a primeira página de um arquivo PDF (data URL ou ArrayBuffer) em imagem JPEG em alta resolução.
 */
export async function converterPdfParaImagem(pdfDataOrUrl: string | ArrayBuffer): Promise<string> {
  try {
    let loadingTask;
    if (typeof pdfDataOrUrl === 'string') {
      if (pdfDataOrUrl.startsWith('data:application/pdf;base64,') || pdfDataOrUrl.startsWith('data:;base64,')) {
        const base64Data = pdfDataOrUrl.replace(/^data:[^;]*;base64,/, '');
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        loadingTask = pdfjsLib.getDocument({ data: bytes });
      } else {
        loadingTask = pdfjsLib.getDocument(pdfDataOrUrl);
      }
    } else {
      loadingTask = pdfjsLib.getDocument({ data: pdfDataOrUrl });
    }

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    // Escala 2.0 para nitidez de impressão A4
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Não foi possível inicializar contexto 2d');
    }

    // Fundo branco limpo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Erro ao converter PDF em imagem:', error);
    throw error;
  }
}
