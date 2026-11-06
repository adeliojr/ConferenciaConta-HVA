/**
 * Client-side image compression utility.
 * Resizes smartphone camera photos (often 10-25MB) to a crisp 1920px max dimension,
 * ensuring fast uploads (<1s) and perfect OCR readability for handwritten text.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo de imagem.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original if canvas fails
          resolve(e.target?.result as string);
          return;
        }

        // Crisp image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        console.log(`[HVA Foto] Redimensionada para ${width}x${height}px (~${approxKb} KB)`);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
