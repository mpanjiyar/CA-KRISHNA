import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';
import { processImageUpload, verifyImageUrl } from '../utils/imageManager';

let storageInstance: ReturnType<typeof getStorage> | null = null;
try {
  storageInstance = getStorage(app);
} catch {
  storageInstance = null;
}

export interface UploadResult {
  url: string;
  source: 'firebase_storage' | 'optimized_cloud_payload' | 'cdn_url';
  sizeBytes: number;
}

/**
 * Universal Image Upload Handler
 * 1. Attempts to upload to Firebase Storage to get a permanent HTTPS download URL.
 * 2. If Firebase Storage bucket is unavailable (e.g. 404, not provisioned on GCP),
 *    gracefully falls back to optimized multi-pass compressed data URL (<250KB)
 *    which safely persists in Firestore documents without exceeding the 1MB limit.
 */
export async function uploadImageFile(file: File, folder: string = 'media'): Promise<UploadResult> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // 1. Try Firebase Storage if instance exists
  if (storageInstance) {
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${folder}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storageInstance, storagePath);

      // Set explicit content type metadata
      const metadata = { contentType: file.type || 'image/jpeg' };
      const uploadSnapshot = await uploadBytes(storageRef, file, metadata);
      const downloadUrl = await getDownloadURL(uploadSnapshot.ref);

      if (downloadUrl && downloadUrl.startsWith('http')) {
        return {
          url: downloadUrl,
          source: 'firebase_storage',
          sizeBytes: file.size
        };
      }
    } catch (storageError: unknown) {
      // Firebase Storage bucket not provisioned on GCP or unavailable; continue to optimized payload
      console.warn('Firebase Storage upload notice (using optimized cloud payload):', storageError);
    }
  }

  // 2. High-performance fallback: multi-pass compression (<250KB) for Firestore persistence
  const processed = await processImageUpload(file);
  return {
    url: processed.dataUrl,
    source: 'optimized_cloud_payload',
    sizeBytes: processed.sizeBytes
  };
}

/**
 * Handle direct URL input (Cloudinary, AWS S3, Imgur, Google Drive, etc.)
 */
export async function processDirectUrl(url: string): Promise<UploadResult> {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error('URL cannot be empty.');
  }

  const isValid = await verifyImageUrl(trimmed);
  if (!isValid) {
    throw new Error('Could not verify image from the provided URL. Please check the link.');
  }

  return {
    url: trimmed,
    source: 'cdn_url',
    sizeBytes: trimmed.length
  };
}
