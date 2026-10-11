import React, { useState } from 'react';
import { Inbox, Mail, Phone, Calendar, ChevronRight, Trash2, Filter } from 'lucide-react';
import { Inquiry } from '../types/inquiry';
import { Property } from '../types/property';
import { InquiryDetailDrawer } from '../components/inquiries/InquiryDetailDrawer';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  properties: Property[];
  searchQuery: string;
  onUpdateStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  onDeleteInquiry: (id: string) => Promise<void>;
}

export const InquiriesPage: React.FC<InquiriesPageProps> = ({
  inquiries,
  properties,
  searchQuery,
  onUpdateStatus,
  onDeleteInquiry,
}) => {
  const [filterTab, setFilterTab] = useState<Inquiry['status'] | 'All'>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab !== 'All') return inq.status === filterTab;
    return true;
  });

  const getLinkedProperty = (propId?: string) => {
    if (!propId) return null;
    return properties.find((p) => p.id === propId) || null;
  };

  return (
    <div className="space-y-6">
      {/* Inbox Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg">
        {(['All', 'New', 'Read', 'In Progress', 'Resolved', 'Archived'] as const).map((tab) => {
          const count = tab === 'All' ? inquiries.length : inquiries.filter((i) => i.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                filterTab === tab
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  filterTab === tab ? 'bg-slate-950 text-gold-400' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* INBOX LIST */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No inquiries found</h3>
          <p className="text-xs text-slate-400">All caught up! No contact messages match this filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => setSelectedInquiry(inq)}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-100 text-sm group-hover:text-gold-400 transition-colors">
                    {inq.name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      inq.status === 'New'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : inq.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : inq.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {inq.inquiry_type}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-200">{inq.subject}</p>
                <p className="text-xs text-slate-400 line-clamp-1">{inq.message}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">{inq.email}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(inq.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="p-2 text-slate-500 group-hover:text-gold-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Slide-Over Drawer */}
      <InquiryDetailDrawer
        inquiry={selectedInquiry}
        linkedProperty={getLinkedProperty(selectedInquiry?.property_id)}
        onClose={() => setSelectedInquiry(null)}
        onUpdateStatus={async (id, status) => {
          await onUpdateStatus(id, status);
          if (selectedInquiry?.id === id) {
            setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
          }
        }}
        onDelete={async (id) => {
          await onDeleteInquiry(id);
          setSelectedInquiry(null);
        }}
      />
    </div>
  );
};
