export interface Property {
  id: string;
  title: string;
  location: string;
  area: string;
  price: number;
  beds: number;
  baths: number;
  type: 'Sale' | 'Rent';
  description: string;
  images: string[];
  image_labels?: string[];
  specs: string[];
  details: Record<string, string>;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyInput = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
