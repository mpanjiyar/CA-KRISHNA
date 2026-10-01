import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';
import { processImageUpload, verifyImageUrl, UrlValidationResult } from '../utils/imageManager';

let storageInstance: ReturnType<typeof getStorage> | null = null;
try {
  storageInstance = getStorage(app);
} catch {
  storageInstance = null;
}

export interface UploadResult {
  url: string;
  source: 'firebase_storage' | 'optimized_cloud_payload' | 'cdn_url' | 'local_path';
  sizeBytes: number;
  format?: string;
  width?: number;
  height?: number;
}

/**
 * Universal Image Upload Handler
 * 1. Tries Firebase Storage to get a permanent HTTPS download URL if provisioned.
 * 2. If Firebase Storage is unavailable (e.g. 404 on GCP),
 *    gracefully falls back to optimized multi-pass compressed payload (<250KB)
 *    which safely persists in Firestore documents and synchronizes in real time.
 */
export async function uploadImageFile(file: File, folder: string = 'branding'): Promise<UploadResult> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // 1. Try Firebase Storage if instance exists
  if (storageInstance) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storageInstance, storagePath);

      const metadata = { contentType: file.type || 'image/jpeg' };
      const uploadSnapshot = await uploadBytes(storageRef, file, metadata);
      const downloadUrl = await getDownloadURL(uploadSnapshot.ref);

      if (downloadUrl && downloadUrl.startsWith('http')) {
        return {
          url: downloadUrl,
          source: 'firebase_storage',
          sizeBytes: file.size,
          format: file.type.replace('image/', '').toUpperCase()
        };
      }
    } catch {
      // Gracefully continue to optimized cloud payload
    }
  }

  // 2. High-performance fallback: multi-pass compression for instant Firestore persistence
  const processed = await processImageUpload(file);
  return {
    url: processed.dataUrl,
    source: 'optimized_cloud_payload',
    sizeBytes: processed.sizeBytes,
    format: processed.format,
    width: processed.width,
    height: processed.height
  };
}

/**
 * Validate and process direct URL input (Cloudinary, AWS S3, Imgur, /uploads/image.jpg, etc.)
 */
export async function processDirectUrl(url: string): Promise<UploadResult> {
  const result: UrlValidationResult = await verifyImageUrl(url);

  if (!result.valid) {
    throw new Error(result.error || 'Failed to verify image from the provided URL.');
  }

  return {
    url: result.normalizedUrl,
    source: result.isLocalPath ? 'local_path' : 'cdn_url',
    sizeBytes: result.normalizedUrl.length,
    width: result.width,
    height: result.height,
    format: result.normalizedUrl.split('.').pop()?.toUpperCase() || 'IMAGE'
  };
}
