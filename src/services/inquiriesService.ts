import { Inquiry } from '../types/inquiry';
import { apiFetch } from './api';
import { INITIAL_INQUIRIES } from './mockData';

let localInquiries: Inquiry[] = [...INITIAL_INQUIRIES];

export async function fetchInquiries(): Promise<Inquiry[]> {
  try {
    const data = await apiFetch<Inquiry[]>('/inquiries');
    if (Array.isArray(data)) {
      localInquiries = data;
      return data;
    }
    return localInquiries;
  } catch (err) {
    console.warn('[inquiriesService] Fetch failed, falling back to cache:', err);
    return localInquiries;
  }
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
  try {
    const updated = await apiFetch<Inquiry>(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    localInquiries = localInquiries.map((inq) => (inq.id === id ? updated : inq));
    return updated;
  } catch (err) {
    console.error(`[inquiriesService] Failed to update inquiry status ${id} via API:`, err);
    throw err;
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await apiFetch(`/inquiries/${id}`, {
      method: 'DELETE',
    });
    localInquiries = localInquiries.filter((inq) => inq.id !== id);
  } catch (err) {
    console.error(`[inquiriesService] Failed to delete inquiry ${id} via API:`, err);
    throw err;
  }
}
