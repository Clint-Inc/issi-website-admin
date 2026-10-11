import React from 'react';
import { LayoutDashboard, Building2, Users, Inbox, Settings, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadInquiriesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, unreadInquiriesCount }) => {
  const { logout, isDemoMode } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'clients', label: 'Client CRM', icon: Users },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: Inbox,
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20 font-bold text-slate-950 text-lg">
              H
            </div>
            <div>
              <h1 className="font-bold text-slate-100 tracking-wide text-sm">HERMANITA</h1>
              <p className="text-[10px] text-gold-400 tracking-widest font-medium uppercase">REALTY ADMIN</p>
            </div>
          </div>
          {isDemoMode && (
            <span title="Running in Demo Mode" className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              DEMO
            </span>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Management Portal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500/15 to-gold-500/5 text-gold-400 border border-gold-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gold-500 text-slate-950 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
            Live Website
          </span>
          <span className="text-[10px] text-slate-500">:5173</span>
        </a>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
