import React from 'react';
import { Server, ShieldCheck, Database, Key, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BASE_URL } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { showToast } = useToast();

  const handleTestBackend = async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        showToast(`Backend connection healthy: ${JSON.stringify(data)}`, 'success');
      } else {
        showToast(`Backend returned HTTP status ${res.status}`, 'error');
      }
    } catch (err: any) {
      showToast(`Could not connect to FastAPI at ${BASE_URL}: ${err.message}`, 'error');
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Backend Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">FastAPI Backend System</h3>
              <p className="text-xs text-slate-400">RESTful API & Firebase Firestore Integration</p>
            </div>
          </div>

          <button
            onClick={handleTestBackend}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-gold-400 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Test Health Endpoint</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">API Base URL</span>
            <p className="font-bold text-gold-400 break-all">{BASE_URL}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Database Engine</span>
            <p className="font-bold text-slate-200">Firebase Firestore (academy-portal-af625: sales)</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 bg-gold-500/10 text-gold-400 rounded-xl border border-gold-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Active Admin Session</h3>
            <p className="text-xs text-slate-400">Authenticated profile details</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Display Name</span>
            <span className="font-semibold text-slate-100">{user?.displayName || 'Executive Admin'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Email Address</span>
            <span className="font-semibold text-slate-100">{user?.email || 'admin@hermanita.com'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Session Mode</span>
            <span className="font-semibold text-gold-400">
              {isDemoMode ? 'Demo Bypass Mode' : 'Firebase Verified Auth Token'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
