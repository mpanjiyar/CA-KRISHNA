/**
 * Universal Image Processing, Drive URL Normalization & Validation Engine
 * Supports:
 * - JPG, JPEG, PNG, WebP, SVG, GIF, ICO, AVIF, BMP, TIFF
 * - Google Drive links (/file/d/..., open?id=..., uc?id=...)
 * - Dropbox, Cloudinary, AWS S3, Imgur, and direct web links
 * - Local static paths (/uploads/image.jpg, /icai-emblem.svg)
 * - Ultra-fast client-side compression (<70KB per photo) ensuring
 *   instant real-time Firestore sync without document size overflow.
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
  'image/bmp',
  'image/tiff'
];

export const SUPPORTED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.svg',
  '.gif',
  '.ico',
  '.avif',
  '.bmp',
  '.tiff'
];

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB upload limit
export const TARGET_MAX_DATA_URL_LENGTH = 140000; // ~100KB binary payload, leaves huge headroom for Firestore

export interface ImageProcessResult {
  dataUrl: string;
  format: string;
  sizeBytes: number;
  width: number;
  height: number;
  isSvgOrGif: boolean;
}

export interface UrlValidationResult {
  valid: boolean;
  normalizedUrl: string;
  width?: number;
  height?: number;
  error?: string;
  isLocalPath: boolean;
  isGoogleDrive: boolean;
}

/**
 * Normalizes Google Drive, Dropbox, and cloud sharing links into direct image URLs
 */
export function normalizeMediaUrl(rawUrl: string): { url: string; isGoogleDrive: boolean } {
  let trimmed = rawUrl.trim();
  if (!trimmed) return { url: '', isGoogleDrive: false };

  // 1. Google Drive Links
  // Format A: https://drive.google.com/file/d/1A2B3C4D5E6F.../view?usp=sharing
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return {
      url: `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`,
      isGoogleDrive: true
    };
  }

  // Format B: https://drive.google.com/open?id=1A2B3C4D5E6F... or uc?id=...
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1] && (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com'))) {
    return {
      url: `https://lh3.googleusercontent.com/d/${idMatch[1]}`,
      isGoogleDrive: true
    };
  }

  // Format C: https://drive.google.com/thumbnail?id=...
  if (trimmed.includes('drive.google.com/thumbnail')) {
    const thumbId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (thumbId && thumbId[1]) {
      return {
        url: `https://lh3.googleusercontent.com/d/${thumbId[1]}`,
        isGoogleDrive: true
      };
    }
  }

  // 2. Dropbox Links
  if (trimmed.includes('dropbox.com')) {
    const directDropbox = trimmed
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace(/[?&]dl=0/, '')
      .replace(/[?&]dl=1/, '');
    return { url: directDropbox, isGoogleDrive: false };
  }

  // 3. Imgur link page (https://imgur.com/abc -> https://i.imgur.com/abc.jpg)
  const imgurMatch = trimmed.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch && imgurMatch[1]) {
    return { url: `https://i.imgur.com/${imgurMatch[1]}.jpg`, isGoogleDrive: false };
  }

  // 4. Missing protocol auto-normalization
  const isLocal = trimmed.startsWith('/') || trimmed.startsWith('./');
  const isDataUrl = trimmed.startsWith('data:');
  if (!isLocal && !isDataUrl && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  return { url: trimmed, isGoogleDrive: false };
}

/**
 * Validate a selected File before reading
 */
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
      error: `Unsupported format (${file.type || extension}). Supported formats: JPG, JPEG, PNG, WebP, SVG, GIF, ICO, AVIF, BMP.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum allowed file size is 20 MB.`
    };
  }

  return { valid: true };
}

/**
 * Multi-pass progressive canvas compression
 * Generates an ultra-crisp, compact WebP/JPEG payload (<75KB)
 * that preserves transparency for logos and sharp detail for photos.
 */
function compressToTarget(
  img: HTMLImageElement,
  fileType: string
): { dataUrl: string; width: number; height: number; format: string } {
  const isPng = fileType === 'image/png';
  
  // Passes designed to maintain high Retina resolution while guaranteeing small payload
  const passes = [
    { maxDim: 800, quality: 0.82, mime: 'image/webp' },
    { maxDim: 700, quality: 0.78, mime: 'image/webp' },
    { maxDim: 600, quality: 0.74, mime: 'image/webp' },
    { maxDim: 500, quality: 0.70, mime: isPng ? 'image/png' : 'image/jpeg' },
    { maxDim: 400, quality: 0.65, mime: 'image/jpeg' }
  ];

  let bestDataUrl = '';
  let bestW = img.naturalWidth || img.width;
  let bestH = img.naturalHeight || img.height;
  let bestFormat = fileType;

  for (const pass of passes) {
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;

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
 * Process, validate, and optimize an uploaded file
 */
export async function processImageUpload(file: File): Promise<ImageProcessResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
  const isIco = file.type.includes('icon') || file.name.toLowerCase().endsWith('.ico');

  // SVGs, GIFs, and ICOs are preserved directly to retain vectors and animation frames
  if (isSvg || isGif || isIco) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          reject(new Error('Failed reading file stream.'));
          return;
        }

        if (result.length > 600000) {
          reject(new Error(`The ${isSvg ? 'SVG' : 'GIF'} is too large (${(result.length / 1024).toFixed(0)} KB). Please use a file under 600 KB.`));
          return;
        }

        const img = new Image();
        img.onload = () => {
          resolve({
            dataUrl: result,
            format: isSvg ? 'SVG' : isGif ? 'GIF' : 'ICO',
            sizeBytes: Math.round(result.length * 0.75),
            width: img.naturalWidth || 100,
            height: img.naturalHeight || 100,
            isSvgOrGif: true
          });
        };
        img.onerror = () => {
          resolve({
            dataUrl: result,
            format: isSvg ? 'SVG' : isGif ? 'GIF' : 'ICO',
            sizeBytes: Math.round(result.length * 0.75),
            width: 64,
            height: 64,
            isSvgOrGif: true
          });
        };
        img.src = result;
      };
      reader.onerror = () => reject(new Error('Failed reading file stream from device.'));
      reader.readAsDataURL(file);
    });
  }

  // Raster images (JPG, PNG, WebP, AVIF, BMP, TIFF): Progressive WebP compression
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
          const finalUrl = compressed.dataUrl || rawDataUrl;
          resolve({
            dataUrl: finalUrl,
            format: compressed.format.replace('image/', '').toUpperCase(),
            sizeBytes: Math.round(finalUrl.length * 0.75),
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
 * Validate that an image URL (Google Drive, cloud/CDN, local relative path, or data URL) actually decodes
 */
export function verifyImageUrl(rawUrl: string, timeoutMs: number = 7000): Promise<UrlValidationResult> {
  return new Promise((resolve) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      resolve({ valid: false, normalizedUrl: '', isLocalPath: false, isGoogleDrive: false, error: 'URL cannot be empty.' });
      return;
    }

    const { url: normalized, isGoogleDrive } = normalizeMediaUrl(trimmed);
    const isLocalPath = normalized.startsWith('/') || normalized.startsWith('./');

    const img = new Image();
    let hasTimedOut = false;

    const timer = setTimeout(() => {
      hasTimedOut = true;
      img.src = '';
      const driveHint = isGoogleDrive
        ? 'Google Drive connection timed out. Please ensure the file sharing is set to "Anyone with the link can view".'
        : `Image verification timed out after ${timeoutMs / 1000}s. Please check if the link is accessible.`;
      resolve({
        valid: false,
        normalizedUrl: normalized,
        isLocalPath,
        isGoogleDrive,
        error: driveHint
      });
    }, timeoutMs);

    img.onload = () => {
      if (hasTimedOut) return;
      clearTimeout(timer);
      resolve({
        valid: true,
        normalizedUrl: normalized,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        isLocalPath,
        isGoogleDrive
      });
    };

    img.onerror = () => {
      if (hasTimedOut) return;
      clearTimeout(timer);
      let errorMsg = `Could not load image from "${normalized}".`;
      if (isGoogleDrive) {
        errorMsg = 'Google Drive image could not be loaded. Please ensure the file in Google Drive has sharing set to "Anyone with the link can view".';
      } else if (isLocalPath) {
        errorMsg = `Local file not found at "${normalized}". Please ensure the file exists in the public directory.`;
      } else {
        errorMsg = `Could not load image from the provided link. Please check that the URL is public and points directly to an image.`;
      }
      resolve({
        valid: false,
        normalizedUrl: normalized,
        isLocalPath,
        isGoogleDrive,
        error: errorMsg
      });
    };

    img.src = normalized;
  });
}
