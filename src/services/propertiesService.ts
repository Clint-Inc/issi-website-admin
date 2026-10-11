import { Property, PropertyInput } from '../types/property';
import { apiFetch } from './api';
import { INITIAL_PROPERTIES } from './mockData';

let localProperties: Property[] = [...INITIAL_PROPERTIES];

export async function fetchProperties(): Promise<Property[]> {
  try {
    const data = await apiFetch<Property[]>('/properties');
    if (Array.isArray(data)) {
      localProperties = data;
      return data;
    }
    return localProperties;
  } catch (err) {
    console.warn('[propertiesService] Fetch failed, falling back to cache:', err);
    return localProperties;
  }
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  try {
    const newProp = await apiFetch<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    localProperties.unshift(newProp);
    return newProp;
  } catch (err) {
    console.error('[propertiesService] Failed to create property via API:', err);
    throw err;
  }
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
  try {
    const updated = await apiFetch<Property>(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    localProperties = localProperties.map((p) => (p.id === id ? updated : p));
    return updated;
  } catch (err) {
    console.error(`[propertiesService] Failed to update property ${id} via API:`, err);
    throw err;
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    await apiFetch(`/properties/${id}`, {
      method: 'DELETE',
    });
    localProperties = localProperties.filter((p) => p.id !== id);
  } catch (err) {
    console.error(`[propertiesService] Failed to delete property ${id} via API:`, err);
    throw err;
  }
}
