// Presigned uploads are content-typed image/jpeg, so normalize any picked image
// (PNG/HEIC/etc.) to a downscaled JPEG before uploading.
export async function toJpegBlob(file: Blob, maxDimension = 1280, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // fall back to the original bytes if decoding fails

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality);
  });
}
