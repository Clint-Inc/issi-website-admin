import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BASE_URL } from '../services/api';

export const Login: React.FC = () => {
  const { loginWithEmail, signupWithEmail, loginAsDemo } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        showToast('Successfully authenticated via Firebase Auth', 'success');
      } else {
        await signupWithEmail(email, password, fullName);
        showToast('Admin account created successfully! Signed in.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    showToast('Signed in as Executive Admin (Demo Mode)', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center shadow-xl shadow-gold-500/20 font-black text-slate-950 text-2xl">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">HERMANITA REALTY</h1>
          <p className="text-xs text-gold-400 tracking-widest uppercase font-semibold">Executive Admin Portal</p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-slate-800 text-gold-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-slate-800 text-gold-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Executive Admin Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hermanitarealty.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : 'Create Admin Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            OR INSTANT ACCESS
          </span>
        </div>

        {/* Demo Admin Bypass Button */}
        <button
          onClick={handleDemoAccess}
          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs group"
        >
          <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
          <span>Launch Demo Admin Portal</span>
        </button>

        <p className="text-center text-[10px] text-slate-500 break-all px-2">
          FastAPI Backend: <code className="text-slate-400">{BASE_URL}</code>
        </p>
      </div>
    </div>
  );
};
