import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', company: 'Acme Corp', role: user?.role || 'employee' });
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ queryAlerts: true, systemUpdates: true, weeklyReport: false, securityAlerts: true });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="ml-64 pt-24 pb-16 px-8 bg-surface min-h-screen">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold">
          <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
          Settings saved successfully!
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black font-h2 text-primary-container">Settings</h2>
          <p className="text-sm text-slate-500 mt-1.5">Manage your account preferences and system configuration.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-secondary">person</span>
              <h3 className="font-bold text-slate-900 text-lg">Profile Settings</h3>
            </div>
            <div className="flex items-center gap-5 mb-6">
              <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full border-2 border-slate-200" />
              <div>
                <button type="button" className="text-sm text-secondary font-semibold hover:underline">Change avatar</button>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', name: 'name', type: 'text', icon: 'person' },
                { label: 'Work Email', name: 'email', type: 'email', icon: 'mail' },
                { label: 'Company', name: 'company', type: 'text', icon: 'business' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">{f.icon}</span>
                    <input
                      type={f.type}
                      value={profile[f.name]}
                      onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">admin_panel_settings</span>
                  <select
                    value={profile.role}
                    onChange={e => setProfile(p => ({ ...p, role: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all appearance-none"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-secondary">notifications</span>
              <h3 className="font-bold text-slate-900 text-lg">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'queryAlerts', label: 'Query Alerts', desc: 'Get notified when your queries are processed' },
                { key: 'systemUpdates', label: 'System Updates', desc: 'Receive updates about system maintenance and upgrades' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly summary of enterprise usage analytics' },
                { key: 'securityAlerts', label: 'Security Alerts', desc: 'Critical security notifications and access logs' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{n.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{n.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key] ? 'bg-secondary' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[n.key] ? 'left-6' : 'left-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="material-symbols-outlined text-secondary">security</span>
              <h3 className="font-bold text-slate-900 text-lg">Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Current Password</label>
                <input type="password" placeholder="Enter current password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">New Password</label>
                  <input type="password" placeholder="New password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="Confirm password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="text-error font-semibold text-sm hover:underline">Delete Account</button>
            <button type="submit" className="bg-primary-container text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
