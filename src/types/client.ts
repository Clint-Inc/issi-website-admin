export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  interest: 'Buy' | 'Rent' | 'Advisory' | 'General';
  budget_naira?: number;
  preferred_area?: string;
  notes?: string;
  source?: string;
  status: 'Active' | 'Inactive' | 'Converted' | 'Lost';
  created_at: string;
  updated_at: string;
}

export type ClientInput = Omit<Client, 'id' | 'status' | 'created_at' | 'updated_at'> & {
  status?: Client['status'];
};
