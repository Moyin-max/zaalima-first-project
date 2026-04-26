import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.company) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = signup(form.name, form.email, form.password);
      setLoading(false);
      if (!result?.ok) {
        setError(result?.error || 'Unable to create account right now.');
        return;
      }
      navigate('/chat');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface flex">
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
            Get your team<br />up and running<br />in minutes.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Onboard your enterprise onto the most powerful corporate SOP intelligence platform. Start for free, scale as you grow.
          </p>
        </div>
        <div className="relative z-10 space-y-3">
          {[
            '✓ Unlimited SOP uploads',
            '✓ AI-powered semantic search',
            '✓ Enterprise-grade security',
            '✓ 99.9% uptime guarantee',
          ].map(f => (
            <div key={f} className="flex items-center gap-3 text-slate-300 text-sm font-medium">{f}</div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
            </div>
            <span className="text-xl font-black font-h3 text-slate-900">OpsMind AI</span>
          </div>

          <h1 className="text-3xl font-black font-h2 text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Start your enterprise AI journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">business</span>
                <input
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-error-container/30 border border-error/20 rounded-lg px-4 py-3">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <span className="text-sm text-error font-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-400">
              By creating an account you agree to our{' '}
              <a href="#" className="text-secondary hover:underline font-medium">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-secondary hover:underline font-medium">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
