/**
 * Utilitário para redimensionamento e otimização de imagens antes de salvar.
 * Evita distorções no layout, previne estouro de limite de payload no Firestore
 * e garante qualidade nítida para impressão e PDF.
 */
export async function redimensionarImagemArquivo(
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao carregar imagem para redimensionamento'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Manter proporção de aspecto (aspect ratio)
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        // Desenho com anti-aliasing de alta qualidade
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const resizedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(resizedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
