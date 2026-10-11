import React from 'react';
import { Building2, Users, Inbox, TrendingUp, DollarSign, ArrowUpRight, Shield, CheckCircle, Clock } from 'lucide-react';
import { Property } from '../types/property';
import { Client } from '../types/client';
import { Inquiry } from '../types/inquiry';
import { BASE_URL } from '../services/api';

interface DashboardProps {
  properties: Property[];
  clients: Client[];
  inquiries: Inquiry[];
  onSelectTab: (tab: string) => void;
  onOpenInquiry: (inq: Inquiry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  properties,
  clients,
  inquiries,
  onSelectTab,
  onOpenInquiry,
}) => {
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const activeClientsCount = clients.filter((c) => c.status === 'Active').length;

  const saleCount = properties.filter((p) => p.type === 'Sale').length;
  const rentCount = properties.filter((p) => p.type === 'Rent').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
            Hermanita Executive Operations
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Luxury Real Estate Overview
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor real-time property listings, buyer inquiries, and high-net-worth client lead pipelines directly connected to Firestore and FastAPI.
          </p>
        </div>

        <div className="flex gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={() => onSelectTab('properties')}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-gold-500/20 text-xs transition-all text-center"
          >
            Manage Properties
          </button>
          <button
            onClick={() => onSelectTab('inquiries')}
            className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl text-xs transition-colors text-center border border-slate-700"
          >
            View Inquiries ({newInquiriesCount} New)
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Portfolio Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Portfolio Value</span>
            <div className="p-2 bg-gold-500/10 text-gold-400 rounded-xl border border-gold-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">
              ₦{(totalValue / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Combined Listing Asset Value</p>
          </div>
        </div>

        {/* Card 2: Active Properties */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Listings</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{properties.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {saleCount} For Sale &bull; {rentCount} For Rent
            </p>
          </div>
        </div>

        {/* Card 3: Client Leads */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Client Leads</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{activeClientsCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Total CRM Client Records: {clients.length}</p>
          </div>
        </div>

        {/* Card 4: New Inquiries */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Inquiries</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black text-slate-100 tracking-tight">{inquiries.length}</p>
            <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
              {newInquiriesCount} Actionable New Messages
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List (Col 2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Recent Website Inquiries</h3>
              <p className="text-xs text-slate-400">Click an inquiry to review details & update status</p>
            </div>
            <button
              onClick={() => onSelectTab('inquiries')}
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {inquiries.slice(0, 5).map((inq) => (
              <div
                key={inq.id}
                onClick={() => onOpenInquiry(inq)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-800/40 px-3 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-xs group-hover:text-gold-400 transition-colors">
                      {inq.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                        inq.status === 'New'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : inq.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{inq.subject}</p>
                </div>

                <div className="text-right shrink-0 pl-4">
                  <p className="text-[10px] text-slate-500">
                    {new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <span className="text-[10px] text-gold-400 font-semibold group-hover:underline">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Quick Stats (Col 1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-slate-100 text-base border-b border-slate-800 pb-4">
            Listing Distribution
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                <span>For Sale Listings</span>
                <span>{saleCount} ({properties.length ? Math.round((saleCount / properties.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-gold-500 to-gold-400 h-full rounded-full"
                  style={{ width: `${properties.length ? (saleCount / properties.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-semibold">
                <span>For Rent Listings</span>
                <span>{rentCount} ({properties.length ? Math.round((rentCount / properties.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                  style={{ width: `${properties.length ? (rentCount / properties.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">FastAPI System Status</span>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>CORS & Firestore Initialized</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Running at <code className="text-gold-400 break-all">{BASE_URL}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
