import React, { useState } from 'react';
import { Plus, Search, Users, Mail, Phone, MapPin, DollarSign, Edit3, Trash2, Tag } from 'lucide-react';
import { Client, ClientInput } from '../types/client';
import { ClientFormModal } from '../components/clients/ClientFormModal';

interface ClientsPageProps {
  clients: Client[];
  searchQuery: string;
  onCreateClient: (input: ClientInput) => Promise<void>;
  onUpdateClient: (id: string, input: Partial<ClientInput>) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  searchQuery,
  onCreateClient,
  onUpdateClient,
  onDeleteClient,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Converted' | 'Inactive' | 'Lost'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.preferred_area && c.preferred_area.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus !== 'All') return c.status === filterStatus;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingClient(c);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: ClientInput) => {
    if (editingClient) {
      await onUpdateClient(editingClient.id, data);
    } else {
      await onCreateClient(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar & Status Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['All', 'Active', 'Converted', 'Inactive', 'Lost'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-gold-500/20 text-xs flex items-center gap-2 transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Lead</span>
        </button>
      </div>

      {/* CLIENTS TABLE */}
      {filteredClients.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No client records found</h3>
          <p className="text-xs text-slate-400">Try changing search query or status filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Client Name & Contact</th>
                  <th className="p-4">Interest & Budget</th>
                  <th className="p-4">Preferred Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Source</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-100">{client.full_name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20 text-[10px]">
                          {client.interest}
                        </span>
                        {client.budget_naira && (
                          <p className="text-[11px] font-bold text-slate-200">
                            ₦{client.budget_naira.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-300 font-medium">{client.preferred_area || 'Not specified'}</span>
                    </td>

                    <td className="p-4">
                      <select
                        value={client.status}
                        onChange={(e) => onUpdateClient(client.id, { status: e.target.value as any })}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border bg-slate-950 focus:outline-none cursor-pointer ${
                          client.status === 'Active'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : client.status === 'Converted'
                            ? 'text-gold-400 border-gold-500/30'
                            : client.status === 'Lost'
                            ? 'text-rose-400 border-rose-500/30'
                            : 'text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Converted">Converted</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-400">{client.source || 'Direct'}</span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteClient(client.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingClient}
      />
    </div>
  );
};
