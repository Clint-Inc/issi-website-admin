/**
 * uploadService.ts
 * Upload image files from device (laptop/phone) to FastAPI backend.
 */

import { BASE_URL } from './api';

export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Failed to upload image');
    }

    const data = await res.json();
    return data.url;
  } catch (backendError) {
    console.warn('[uploadService] Backend upload failed, using Data URL fallback:', backendError);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(backendError);
      reader.readAsDataURL(file);
    });
  }
}
