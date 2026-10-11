import React from 'react';
import { Search, Plus, Server, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  activeTabTitle: string;
  onQuickAddProperty: () => void;
  onQuickAddClient: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTabTitle,
  onQuickAddProperty,
  onQuickAddClient,
  searchQuery,
  onSearchChange,
}) => {
  const { user } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = React.useState(false);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Search */}
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-xl font-bold text-slate-100 capitalize tracking-tight">
          {activeTabTitle}
        </h2>

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search properties, clients, inquiries..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all"
          />
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Backend Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Server className="w-3 h-3" />
          <span>FastAPI Online</span>
        </div>

        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-md shadow-gold-500/10 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAddProperty();
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-gold-400 transition-colors"
              >
                + New Property Listing
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAddClient();
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-gold-400 transition-colors"
              >
                + New Client Record
              </button>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-gold-400 font-semibold text-xs shadow-inner">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">{user?.displayName || 'Admin'}</p>
            <p className="text-[10px] text-slate-400">{user?.email || 'admin@hermanita.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
