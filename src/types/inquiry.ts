export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  property_id?: string;
  inquiry_type: 'Property' | 'Advisory' | 'General';
  status: 'New' | 'Read' | 'In Progress' | 'Resolved' | 'Archived';
  created_at: string;
  updated_at: string;
}
