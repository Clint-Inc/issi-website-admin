import { Client, ClientInput } from '../types/client';
import { apiFetch } from './api';
import { INITIAL_CLIENTS } from './mockData';

let localClients: Client[] = [...INITIAL_CLIENTS];

export async function fetchClients(): Promise<Client[]> {
  try {
    const data = await apiFetch<Client[]>('/clients');
    if (Array.isArray(data)) {
      localClients = data;
      return data;
    }
    return localClients;
  } catch (err) {
    console.warn('[clientsService] Fetch failed, falling back to cache:', err);
    return localClients;
  }
}

export async function createClient(input: ClientInput): Promise<Client> {
  try {
    const created = await apiFetch<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    localClients.unshift(created);
    return created;
  } catch (err) {
    console.error('[clientsService] Failed to create client via API:', err);
    throw err;
  }
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  try {
    const updated = await apiFetch<Client>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    localClients = localClients.map((c) => (c.id === id ? updated : c));
    return updated;
  } catch (err) {
    console.error(`[clientsService] Failed to update client ${id} via API:`, err);
    throw err;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    await apiFetch(`/clients/${id}`, {
      method: 'DELETE',
    });
    localClients = localClients.filter((c) => c.id !== id);
  } catch (err) {
    console.error(`[clientsService] Failed to delete client ${id} via API:`, err);
    throw err;
  }
}
