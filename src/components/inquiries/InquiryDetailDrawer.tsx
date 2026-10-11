import React from 'react';
import { X, Mail, Phone, Calendar, Building, Trash2, CheckCircle2, Clock, Archive } from 'lucide-react';
import { Inquiry } from '../../types/inquiry';
import { Property } from '../../types/property';

interface InquiryDetailDrawerProps {
  inquiry: Inquiry | null;
  linkedProperty?: Property | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const InquiryDetailDrawer: React.FC<InquiryDetailDrawerProps> = ({
  inquiry,
  linkedProperty,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!inquiry) return null;

  const statuses: Inquiry['status'][] = ['New', 'Read', 'In Progress', 'Resolved', 'Archived'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-widest">
              Inquiry Details #{inquiry.id.slice(0, 8)}
            </span>
            <h3 className="font-bold text-slate-100 text-base">{inquiry.subject}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 flex-1">
          {/* Status Pipeline Stepper */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Status Lifecycle
            </label>
            <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {statuses.map((st) => {
                const isActive = inquiry.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(inquiry.id, st)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all text-center truncate ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sender Info Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-slate-200 text-sm flex items-center justify-between">
              <span>{inquiry.name}</span>
              <span className="text-[10px] font-normal text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(inquiry.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </h4>

            <div className="space-y-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>{inquiry.email}</span>
              </a>

              {inquiry.phone && (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-gold-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>{inquiry.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Linked Property Preview */}
          {linkedProperty && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs">
                <Building className="w-4 h-4" />
                <span>Associated Property Listing</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={linkedProperty.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                  alt={linkedProperty.title}
                  className="w-16 h-12 object-cover rounded-lg border border-slate-700"
                />
                <div>
                  <p className="font-semibold text-slate-200 text-xs">{linkedProperty.title}</p>
                  <p className="text-[10px] text-slate-400">{linkedProperty.location}</p>
                  <p className="text-[11px] font-bold text-gold-400">₦{linkedProperty.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Message Body
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 whitespace-pre-wrap leading-relaxed">
              {inquiry.message}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={() => onDelete(inquiry.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-medium text-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Inquiry</span>
          </button>

          <a
            href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-md transition-all text-xs"
          >
            <Mail className="w-4 h-4" />
            <span>Reply via Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};
