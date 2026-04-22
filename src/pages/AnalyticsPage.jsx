import React, { useState } from 'react';

const CHART_DATA = [
  { day: 'Mon', value: 60, queries: '12.4k' },
  { day: 'Tue', value: 80, queries: '18.2k' },
  { day: 'Wed', value: 75, queries: '16.1k' },
  { day: 'Thu', value: 95, queries: '22.4k' },
  { day: 'Fri', value: 65, queries: '14.8k' },
  { day: 'Sat', value: 40, queries: '8.2k' },
  { day: 'Sun', value: 35, queries: '7.1k' },
];

export default function AnalyticsPage() {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <main className="ml-64 pt-24 pb-16 px-8 bg-surface min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black font-h2 text-primary-container">System Analytics & Settings</h2>
          <p className="text-sm text-slate-500 mt-1.5">Monitor enterprise intelligence performance and manage core system configurations.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'TOTAL QUERIES', value: '142,891', delta: '+12.5%', icon: 'analytics' },
            { label: 'AVG RESPONSE TIME', value: '1.2s', delta: '-150ms', icon: 'timer' },
            { label: 'SYSTEM HEALTH', value: '99.9%', delta: 'Uptime', icon: 'check_circle' },
            { label: 'SOPS INDEXED', value: '8,420', delta: '+42 today', icon: 'description' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-secondary/40 transition-all shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <span className="material-symbols-outlined text-secondary text-xl">{s.icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black font-h3 text-slate-900">{s.value}</span>
                <span className="text-secondary text-xs font-bold pb-0.5">{s.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Query Volume (Last 7 Days)</h3>
              <button className="text-xs font-bold text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">Export</button>
            </div>
            <div className="p-6">
              <div className="h-48 flex items-end gap-3 px-4 relative">
                {CHART_DATA.map((d, i) => (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-2 group relative"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === i && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                        {d.day}: {d.queries}
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t-lg cursor-pointer transition-colors ${hoveredBar === i ? 'bg-secondary' : 'bg-slate-100 hover:bg-secondary/60'}`}
                      style={{ height: `${d.value}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-4 mt-3">
                {CHART_DATA.map(d => (
                  <span key={d.day} className="flex-1 text-center text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Most Cited */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Most Cited Documents</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Document</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Cites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Incident_Response_v2.pdf', '1,204'],
                  ['Network_Security_Audit.xlsx', '892'],
                  ['Cloud_Onboarding_SOP.docx', '756'],
                  ['Identity_Auth_Flow.pdf', '512'],
                  ['Disaster_Recovery_Plan.pdf', '429'],
                ].map(([name, count]) => (
                  <tr key={name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 text-xs font-medium text-slate-700 truncate max-w-[160px]">{name}</td>
                    <td className="px-6 py-3.5 text-right text-xs text-secondary font-bold">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="px-6 py-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-xl">Core System Configuration</h3>
            <p className="text-xs text-slate-500 mt-1">Manage infrastructure, database connections, and secure API integration.</p>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vector DB */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-secondary">storage</span>
                <h4 className="font-bold text-slate-900 text-sm">Vector Database (MongoDB Atlas)</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Connection String</label>
                  <div className="flex">
                    <input
                      className="flex-1 border border-slate-200 rounded-l-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-secondary/30"
                      type="password"
                      defaultValue="mongodb+srv://opsmind-cluster.xyz.mongodb.net/embeddings"
                    />
                    <button className="bg-slate-100 border-y border-r border-slate-200 rounded-r-xl px-4 text-slate-500 hover:bg-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Collection Name</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-secondary/30" defaultValue="ops_knowledge_base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Index Type</label>
                    <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-secondary/30">
                      <option>HNSW (Recommended)</option>
                      <option>IVF_FLAT</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg mt-0.5">info</span>
                  <p className="text-xs text-secondary-container font-medium leading-relaxed">AI suggested: Increasing dimension count to 1536 will improve retrieval accuracy for technical SOPs.</p>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-secondary">key</span>
                <h4 className="font-bold text-slate-900 text-sm">Authentication & API Keys</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Primary Production Key</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <code className="text-xs font-mono text-slate-600 flex-1 truncate">sk-proj-7a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0</code>
                    <button
                      onClick={() => navigator.clipboard.writeText('sk-proj-7a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0')}
                      className="text-secondary hover:underline text-xs font-bold"
                    >
                      Copy
                    </button>
                    <button className="text-error hover:underline text-xs font-bold">Revoke</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Usage Limits</label>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>$1,625.40 USED</span>
                    <span>$2,500.00 LIMIT</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
                    Save Changes
                  </button>
                  <button className="text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
