import React, { useState, useEffect } from 'react';
import { X, UserCheck, Briefcase } from 'lucide-react';
import { Client, ClientInput } from '../../types/client';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientInput) => Promise<void>;
  initialData?: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<ClientInput>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    interest: 'Buy',
    budget_naira: 250000000,
    preferred_area: 'Lekki Phase 1',
    source: 'Instagram',
    notes: '',
    status: 'Active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone || '',
        location: initialData.location || '',
        interest: initialData.interest,
        budget_naira: initialData.budget_naira || undefined,
        preferred_area: initialData.preferred_area || '',
        source: initialData.source || '',
        notes: initialData.notes || '',
        status: initialData.status,
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        interest: 'Buy',
        budget_naira: 300000000,
        preferred_area: 'Ikoyi / Lekki',
        source: 'Instagram',
        notes: '',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              {initialData ? 'Edit Client Record' : 'Add New Client Lead'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="client-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Dr. Okey Nduka"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="okey@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+2348137855192"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Primary Interest</label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              >
                <option value="Buy">Property Purchase (Buy)</option>
                <option value="Rent">Lease / Rental</option>
                <option value="Advisory">Portfolio Advisory</option>
                <option value="General">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Budget (₦ Naira)</label>
              <input
                type="number"
                value={formData.budget_naira || ''}
                onChange={(e) => setFormData({ ...formData, budget_naira: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="300000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Preferred Location / Area</label>
              <input
                type="text"
                value={formData.preferred_area}
                onChange={(e) => setFormData({ ...formData, preferred_area: e.target.value })}
                placeholder="e.g. Lekki Phase 1, Ikoyi"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Lead Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g. Instagram, Referral, Website"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Lead Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              >
                <option value="Active">Active Lead</option>
                <option value="Converted">Converted Client</option>
                <option value="Inactive">Inactive</option>
                <option value="Lost">Lost Opportunity</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Notes & Preferences</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Record client requirements, title document preferences, inspection feedback..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="client-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-5 py-2 rounded-xl shadow-lg shadow-gold-500/20 transition-all"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Client' : 'Add Client Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
