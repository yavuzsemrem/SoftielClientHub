import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (
  file: Blob | Uint8Array | ArrayBuffer,
  path: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const storageRef = ref(storage, path);
    const uploadResult: UploadResult = await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(uploadResult.ref);
    return { url, error: null };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { url: null, error: error.message };
  }
};

export const deleteFile = async (path: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

export const getFileUrl = async (path: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

