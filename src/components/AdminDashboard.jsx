import React, { useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';
const ICON_MAP = { PDF: 'description', DOCX: 'article', JSON: 'data_object', XLSX: 'table_chart' };

function StatusBadge({ status }) {
  if (status === 'indexing') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-700/50">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Indexing
    </span>
  );
  if (status === 'error') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-700/50">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Error
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/30 dark:bg-secondary/15 text-on-secondary-container dark:text-secondary text-xs font-bold border border-secondary/20">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />Ready
    </span>
  );
}

function formatBytes(size) {
  if (!size && size !== 0) return 'N/A';
  const mb = size / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
}

export default function AdminDashboard() {
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [reindexing, setReindexing] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToastMsg(''), 3000);
  };

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/docs`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch documents');
      const normalized = data.map((doc) => ({
        id: doc._id,
        name: doc.filename,
        size: formatBytes(doc.size),
        type: String(doc.filename || '').split('.').pop()?.toUpperCase() || 'FILE',
        pages: doc.pages ?? 'N/A',
        date: formatDate(doc.uploadedAt),
        status: 'success',
      }));
      setDocs(normalized);
    } catch (error) {
      console.error('Failed to load docs:', error);
      showToast('Could not load documents from the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('Only PDF uploads are supported right now.');
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticDoc = {
      id: tempId,
      name: file.name,
      size: formatBytes(file.size),
      type: 'PDF',
      pages: '...',
      date: formatDate(new Date()),
      status: 'indexing',
    };

    setDocs((prev) => [optimisticDoc, ...prev]);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      showToast(`"${file.name}" uploaded successfully.`);
      await loadDocs();
    } catch (error) {
      console.error('Upload failed:', error);
      setDocs((prev) => prev.map((doc) => (
        doc.id === tempId ? { ...doc, status: 'error' } : doc
      )));
      showToast('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${API_URL}/api/admin/docs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
      showToast('Document deleted.');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Could not delete document.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    await loadDocs();
    setReindexing(false);
    showToast('Document list refreshed.');
  };

  const filtered = docs.filter((doc) => doc.name.toLowerCase().includes(filter.toLowerCase()));
  const totalStorageMb = docs.reduce((sum, doc) => {
    const parsed = Number.parseFloat(String(doc.size).replace(' MB', ''));
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);

  return (
    <main className="ml-64 pt-24 pb-16 px-8 bg-surface dark:bg-[#0f1117] min-h-screen transition-colors">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
          {toastMsg}
        </div>
      )}
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mb-2">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-semibold">Knowledge Base</span>
            </nav>
            <h2 className="text-3xl font-black font-h2 text-primary-container">SOP Repository</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1.5">Manage and index Standard Operating Procedures to enhance agent response precision.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReindex}
              disabled={reindexing || loading}
              className="flex items-center gap-2 bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#21253a] transition-colors shadow-sm disabled:opacity-60 hover-lift"
            >
              <span className={`material-symbols-outlined text-[18px] ${reindexing ? 'animate-spin' : ''}`}>refresh</span>
              {reindexing ? 'Refreshing...' : 'Refresh Documents'}
            </button>
            <label className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer hover-lift">
              <span className="material-symbols-outlined text-[18px]">{uploading ? 'hourglass_top' : 'add'}</span>
              {uploading ? 'Uploading...' : 'Upload New SOP'}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'TOTAL DOCUMENTS', value: docs.length.toLocaleString(), sub: loading ? 'Loading...' : 'Connected to backend', subColor: 'text-secondary' },
            { label: 'ACTIVE CHUNKS', value: docs.length ? `${docs.length} docs` : '0 docs', sub: 'Indexed from uploads', subColor: 'text-slate-400 dark:text-slate-500' },
            { label: 'STORAGE USED', value: `${totalStorageMb.toFixed(1)} MB`, sub: 'Live MongoDB files', subColor: 'text-slate-400 dark:text-slate-500' },
            { label: 'INDEXING STATUS', value: uploading ? 'Updating' : 'Healthy', highlight: true },
          ].map((s) => (
            <div key={s.label} className={`bg-white dark:bg-[#1a1d27] p-6 rounded-2xl border shadow-sm flex flex-col gap-2 hover-lift transition-all ${s.highlight ? 'border-secondary/30 border-l-4 border-l-secondary' : 'border-slate-200 dark:border-[#2a2f4a] hover:border-secondary/30 dark:hover:border-secondary/40'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${s.highlight ? 'text-secondary' : 'text-slate-500 dark:text-slate-400'}`}>{s.label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black font-h3 ${s.highlight ? 'text-secondary' : 'text-slate-900 dark:text-white'}`}>{s.value}</span>
                {s.highlight && <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />}
                {s.sub && <span className={`text-xs font-semibold ${s.subColor}`}>{s.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-200 dark:border-[#2a2f4a] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-[#2a2f4a] flex items-center justify-between bg-slate-50 dark:bg-[#161820]">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Document Catalog</h3>
              <span className="px-2 py-0.5 bg-slate-200 dark:bg-[#21253a] text-xs font-bold rounded-full text-slate-500 dark:text-slate-400">{docs.length} Total</span>
            </div>
            <div className="flex items-center gap-2 border border-slate-200 dark:border-[#2a2f4a] rounded-xl overflow-hidden bg-white dark:bg-[#1a1d27]">
              <div className="px-3 py-2 bg-slate-100 dark:bg-[#21253a] text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
              </div>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border-none text-sm px-3 py-2 focus:ring-0 w-48 outline-none bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Filter by name..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-[#161820]">
                <tr>
                  {['Document Name', 'Pages', 'Date Uploaded', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#2a2f4a] ${i === 1 ? 'text-center' : i === 4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#21253a]">
                {loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">Loading documents...</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                      <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300 dark:text-slate-600">search_off</span>
                      No documents match your filter.
                    </td>
                  </tr>
                )}
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-[#161820] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === 'indexing' ? 'bg-secondary-container/20 dark:bg-secondary/15 text-secondary' : doc.status === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-100 dark:bg-[#21253a] text-slate-500 dark:text-slate-400'}`}>
                          <span className="material-symbols-outlined text-[20px]">{ICON_MAP[doc.type] || 'description'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{doc.name}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{doc.size} • {doc.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{doc.pages}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">{doc.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#21253a] rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" disabled>
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id || doc.status === 'indexing' || doc.status === 'error'}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 dark:text-slate-500 hover:text-error transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">{deletingId === doc.id ? 'hourglass_top' : 'delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-200 dark:border-[#2a2f4a] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Live Backend Status</h3>
              <button onClick={loadDocs} className="text-secondary text-xs font-bold hover:underline">Refresh</button>
            </div>
            <div className="space-y-5">
              {[
                { dot: 'bg-secondary', title: 'Connected API', time: API_URL, desc: 'Admin dashboard is reading document records from the deployed backend.' },
                { dot: uploading ? 'bg-amber-500' : 'bg-secondary', title: uploading ? 'Upload in Progress' : 'Upload Ready', time: uploading ? 'Now' : 'Idle', desc: 'PDF uploads now go to the live upload endpoint instead of staying in demo mode.' },
                { dot: 'bg-secondary', title: 'Chat Knowledge Base', time: `${docs.length} documents`, desc: 'Any successfully uploaded PDFs can now be used by the live chat backend.' },
              ].map((a) => (
                <div key={a.title} className="flex items-start gap-4">
                  <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${a.dot}`} />
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 break-all text-right">{a.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary-container text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary text-xl">auto_awesome</span>
                <span className="text-xs uppercase tracking-widest font-bold">Next Step</span>
              </div>
              <h4 className="font-h3 text-xl font-bold mb-3">Upload More SOP PDFs</h4>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">Your chat assistant becomes more useful as more PDFs are uploaded and embedded into the knowledge base.</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-auto w-full py-3 bg-secondary text-on-secondary-fixed font-bold rounded-xl hover:opacity-90 transition-all text-sm hover-lift"
              >
                Upload Another PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
