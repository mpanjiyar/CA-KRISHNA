/**
 * Universal Image Processing and Validation Utility
 * Supports JPG, JPEG, PNG, WebP, SVG, GIF, ICO, AVIF, BMP
 * Handles compression, preservation of SVGs and animated GIFs,
 * and robust size & format validation.
 */

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/avif',
  'image/bmp'
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico', '.avif', '.bmp'];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface ImageProcessResult {
  dataUrl: string;
  format: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  isSvgOrGif: boolean;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isTypeSupported = SUPPORTED_IMAGE_TYPES.includes(file.type);
  const isExtSupported = SUPPORTED_EXTENSIONS.includes(extension);

  if (!isTypeSupported && !isExtSupported) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || extension}). Please upload JPG, JPEG, PNG, WebP, SVG, GIF, AVIF, or ICO.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed size is 10 MB.`
    };
  }

  return { valid: true };
}

/**
 * Process and optimize an uploaded file
 */
export async function processImageUpload(
  file: File,
  maxDimension: number = 1400
): Promise<ImageProcessResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
  const isIco = file.type.includes('icon') || file.name.toLowerCase().endsWith('.ico');

  // SVGs, GIFs, and ICOs are read directly to preserve vector paths and animation frames
  if (isSvg || isGif || isIco) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          reject(new Error('Failed reading file data.'));
          return;
        }
        resolve({
          dataUrl: result,
          format: isSvg ? 'SVG' : isGif ? 'GIF' : 'ICO',
          sizeBytes: file.size,
          isSvgOrGif: true
        });
      };
      reader.onerror = () => reject(new Error('Failed reading file stream.'));
      reader.readAsDataURL(file);
    });
  }

  // Raster images (JPG, PNG, WebP, AVIF, BMP): optimize & compress for fast loading & reliable cloud sync
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        reject(new Error('Failed reading image preview.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale oversized images cleanly
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
          resolve({
            dataUrl: rawDataUrl,
            format: file.type,
            sizeBytes: file.size,
            width: img.width,
            height: img.height,
            isSvgOrGif: false
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer WebP or PNG/JPEG based on source transparency
        const hasAlpha = file.type === 'image/png' || file.type === 'image/webp';
        const targetMime = hasAlpha ? 'image/png' : 'image/jpeg';
        const quality = 0.90;

        try {
          const optimizedDataUrl = canvas.toDataURL(targetMime, quality);
          resolve({
            dataUrl: optimizedDataUrl,
            format: targetMime,
            sizeBytes: Math.round(optimizedDataUrl.length * 0.75),
            width,
            height,
            isSvgOrGif: false
          });
        } catch {
          resolve({
            dataUrl: rawDataUrl,
            format: file.type,
            sizeBytes: file.size,
            width,
            height,
            isSvgOrGif: false
          });
        }
      };

      img.onerror = () => {
        reject(new Error('The uploaded file appears to be corrupted or cannot be decoded as an image.'));
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => reject(new Error('Failed to read file from storage.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate that an image URL (cloud/CDN or data URL) actually loads
 */
export function verifyImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
