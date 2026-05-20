import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigate('/chat');
    }, 800);
  };

  const FIELD_CLS = "w-full border border-slate-200 dark:border-[#2a2f4a] rounded-xl py-3 text-sm bg-white dark:bg-[#1a1d27] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all";

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0f1117] flex transition-colors">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-container relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[22px]">psychology</span>
            </div>
            <div>
              <div className="text-white text-xl font-black font-h3 leading-none">OpsMind AI</div>
              <div className="text-secondary text-[10px] uppercase tracking-widest font-bold mt-0.5">Enterprise Intelligence</div>
            </div>
          </div>
          <h2 className="text-white text-4xl font-black font-h2 leading-tight mb-4">
            Your enterprise<br />SOPs, answered<br />instantly.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            AI-powered access to your company's entire knowledge base. Compliance, procedures, and workflows — all in one place.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: 'speed', label: 'Avg Response', value: '1.2s' },
            { icon: 'description', label: 'SOPs Indexed', value: '8,420' },
            { icon: 'people', label: 'Active Users', value: '2,100+' },
            { icon: 'check_circle', label: 'System Health', value: '99.9%' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 hover-lift">
              <span className="material-symbols-outlined text-secondary text-xl mb-2 block">{stat.icon}</span>
              <div className="text-white text-xl font-black font-h3">{stat.value}</div>
              <div className="text-slate-400 text-xs font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
            </div>
            <span className="text-xl font-black font-h3 text-slate-900 dark:text-white">OpsMind AI</span>
          </div>

          <h1 className="text-3xl font-black font-h2 text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your enterprise account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className={`${FIELD_CLS} pl-11 pr-4`} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-secondary hover:underline font-semibold">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={`${FIELD_CLS} pl-11 pr-12`} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-error-container/30 border border-error/20 rounded-xl px-4 py-3 animate-fade-in">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <span className="text-sm text-error font-medium">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary-container text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover-lift">
              {loading ? (
                <><span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>Signing in...</>
              ) : (
                <>Sign in<span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary font-bold hover:underline">Create account</Link>
          </p>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-[#21253a]">
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mb-3 font-medium">Quick access demo</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setEmail('employee@company.com'); setPassword('Secure@123'); }}
                className="text-xs border border-slate-200 dark:border-[#2a2f4a] rounded-xl py-2.5 px-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#21253a] transition-colors font-medium hover-lift"
              >
                <span className="material-symbols-outlined text-[16px] mr-1.5 align-middle">person</span>Employee Login
              </button>
              <button
                onClick={() => { setEmail('admin@company.com'); setPassword('Admin@Secure#1'); }}
                className="text-xs border border-slate-200 dark:border-[#2a2f4a] rounded-xl py-2.5 px-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#21253a] transition-colors font-medium hover-lift"
              >
                <span className="material-symbols-outlined text-[16px] mr-1.5 align-middle">admin_panel_settings</span>Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
