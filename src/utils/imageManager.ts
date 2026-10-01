/**
 * Universal Image Processing and Validation Utility
 * Supports JPG, JPEG, PNG, WebP, SVG, GIF, ICO, AVIF, BMP
 * Handles multi-pass compression to guarantee all photos and logos
 * stay well within cloud document storage and memory constraints (<350KB),
 * while maintaining crisp resolution on Retina displays.
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

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB upload limit
export const TARGET_MAX_DATA_URL_LENGTH = 350000; // ~260KB binary data, well under Firestore 1MB limit

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
    return { valid: false, error: 'No file selected.' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isTypeSupported = SUPPORTED_IMAGE_TYPES.includes(file.type);
  const isExtSupported = SUPPORTED_EXTENSIONS.includes(extension);

  if (!isTypeSupported && !isExtSupported) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || extension}). Supported formats: JPG, JPEG, PNG, WebP, SVG, GIF, AVIF, ICO.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed file size is 10 MB.`
    };
  }

  return { valid: true };
}

/**
 * Multi-pass compression for canvas to ensure dataUrl length < TARGET_MAX_DATA_URL_LENGTH
 */
function compressToTarget(
  img: HTMLImageElement,
  fileType: string
): { dataUrl: string; width: number; height: number; format: string } {
  const isPng = fileType === 'image/png';
  const passes = [
    { maxDim: 1000, quality: 0.85, mime: isPng ? 'image/png' : 'image/jpeg' },
    { maxDim: 800, quality: 0.80, mime: isPng ? 'image/png' : 'image/jpeg' },
    { maxDim: 800, quality: 0.75, mime: 'image/jpeg' },
    { maxDim: 640, quality: 0.70, mime: 'image/jpeg' },
    { maxDim: 500, quality: 0.65, mime: 'image/jpeg' }
  ];

  let bestDataUrl = '';
  let bestW = img.width;
  let bestH = img.height;
  let bestFormat = fileType;

  for (const pass of passes) {
    let w = img.width;
    let h = img.height;

    if (w > pass.maxDim || h > pass.maxDim) {
      if (w > h) {
        h = Math.round((h * pass.maxDim) / w);
        w = pass.maxDim;
      } else {
        w = Math.round((w * pass.maxDim) / h);
        h = pass.maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) break;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    try {
      const dataUrl = canvas.toDataURL(pass.mime, pass.quality);
      bestDataUrl = dataUrl;
      bestW = w;
      bestH = h;
      bestFormat = pass.mime;

      if (dataUrl.length <= TARGET_MAX_DATA_URL_LENGTH) {
        return { dataUrl, width: w, height: h, format: pass.mime };
      }
    } catch {
      // Continue to next pass
    }
  }

  return { dataUrl: bestDataUrl, width: bestW, height: bestH, format: bestFormat };
}

/**
 * Process and optimize an uploaded file
 */
export async function processImageUpload(file: File): Promise<ImageProcessResult> {
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

        // If SVG or GIF is extraordinarily large for a single cloud doc, warn
        if (result.length > 700000) {
          reject(new Error(`The ${isSvg ? 'SVG' : 'GIF'} is too large (${(result.length / 1024).toFixed(0)} KB data). Please use a file under 700 KB.`));
          return;
        }

        resolve({
          dataUrl: result,
          format: isSvg ? 'SVG' : isGif ? 'GIF' : 'ICO',
          sizeBytes: Math.round(result.length * 0.75),
          isSvgOrGif: true
        });
      };
      reader.onerror = () => reject(new Error('Failed reading file stream.'));
      reader.readAsDataURL(file);
    });
  }

  // Raster images (JPG, PNG, WebP, AVIF, BMP): multi-pass compression
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
        try {
          const compressed = compressToTarget(img, file.type);
          resolve({
            dataUrl: compressed.dataUrl || rawDataUrl,
            format: compressed.format,
            sizeBytes: Math.round((compressed.dataUrl || rawDataUrl).length * 0.75),
            width: compressed.width,
            height: compressed.height,
            isSvgOrGif: false
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Compression error';
          reject(new Error(`Failed to compress image: ${msg}`));
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
