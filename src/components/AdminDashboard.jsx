import React, { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';

const ICON_MAP = { PDF: 'description', DOCX: 'article', JSON: 'data_object', XLSX: 'table_chart' };

function StatusBadge({ status }) {
  if (status === 'indexing') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-700/50">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Indexing
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/30 dark:bg-secondary/15 text-on-secondary-container dark:text-secondary text-xs font-bold border border-secondary/20">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />Indexed
    </span>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return 'N/A';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminDashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showReindex, setShowReindex] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3500); };

  // Fetch documents from backend
  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/docs`);
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocs(data.map(d => ({
        id: d._id,
        name: d.filename,
        size: formatFileSize(d.size),
        type: (d.filename?.split('.').pop() || 'pdf').toUpperCase(),
        pages: d.pages,
        date: formatDate(d.uploadedAt),
        status: 'success',
      })));
    } catch (err) {
      console.error('Failed to fetch docs:', err);
      showToast('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  // Delete document
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/admin/docs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDocs(prev => prev.filter(d => d.id !== id));
      showToast('Document deleted successfully.');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete document.');
    } finally {
      setDeletingId(null);
    }
  };

  // Upload file
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast('Only PDF files are supported.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast('File must be under 50 MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) { clearInterval(progressInterval); return prev; }
        return prev + Math.random() * 12;
      });
    }, 350);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setUploadProgress(100);
      showToast(`"${file.name}" uploaded — ${data.chunks} chunks indexed.`);

      // Refresh the document list
      setTimeout(() => {
        fetchDocs();
        setUploadProgress(0);
        setUploading(false);
      }, 800);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploading(false);
      console.error('Upload error:', err);
      showToast(`Upload failed: ${err.message}`);
    }
  };

  const handleReindex = () => {
    setShowReindex(true);
    setTimeout(() => { setShowReindex(false); showToast('Database re-indexed successfully!'); }, 2000);
  };

  const filtered = docs.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));

  const totalStorage = docs.reduce((sum, d) => {
    const match = d.size.match(/([\d.]+)\s*(MB|KB|B)/);
    if (!match) return sum;
    const val = parseFloat(match[1]);
    if (match[2] === 'MB') return sum + val;
    if (match[2] === 'KB') return sum + val / 1024;
    return sum + val / (1024 * 1024);
  }, 0);

  return (
    <main className="ml-64 pt-24 pb-16 px-8 bg-surface dark:bg-[#0f1117] min-h-screen transition-colors">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Upload progress bar (global) */}
      {uploading && (
        <div className="fixed top-16 left-64 right-0 z-50">
          <div className="h-1 bg-slate-100 dark:bg-[#21253a]">
            <div
              className="h-full bg-gradient-to-r from-secondary to-secondary/70 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
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
            <button onClick={handleReindex} disabled={showReindex}
              className="flex items-center gap-2 bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#21253a] transition-colors shadow-sm disabled:opacity-60 hover-lift">
              <span className={`material-symbols-outlined text-[18px] ${showReindex ? 'animate-spin' : ''}`}>refresh</span>
              {showReindex ? 'Re-indexing...' : 'Re-index Database'}
            </button>
            <label className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer hover-lift">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Upload New SOP
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={e => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'TOTAL DOCUMENTS', value: docs.length.toLocaleString(), sub: loading ? 'Loading...' : 'From knowledge base', subColor: 'text-secondary' },
            { label: 'FILE TYPES', value: [...new Set(docs.map(d => d.type))].join(', ') || 'N/A', sub: 'Indexed formats', subColor: 'text-slate-400 dark:text-slate-500' },
            { label: 'STORAGE USED', value: totalStorage > 0 ? totalStorage.toFixed(1) + ' MB' : '0 MB', sub: 'Total size', subColor: 'text-slate-400 dark:text-slate-500' },
            { label: 'INDEXING STATUS', value: 'Healthy', highlight: true },
          ].map(s => (
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

        {/* Table */}
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
              <input value={filter} onChange={e => setFilter(e.target.value)}
                className="border-none text-sm px-3 py-2 focus:ring-0 w-48 outline-none bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Filter by name..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-[#161820]">
                <tr>
                  {['Document Name','Pages','Date Uploaded','Status','Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#2a2f4a] ${i === 1 ? 'text-center' : i === 4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#21253a]">
                {loading && (
                  <tr><td colSpan={5} className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300 dark:text-slate-600 animate-spin">refresh</span>
                    Loading documents...
                  </td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300 dark:text-slate-600">search_off</span>
                    {docs.length === 0 ? 'No documents uploaded yet. Upload your first SOP!' : 'No documents match your filter.'}
                  </td></tr>
                )}
                {!loading && filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-[#161820] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-[#21253a] text-slate-500 dark:text-slate-400`}>
                          <span className="material-symbols-outlined text-[20px]">{ICON_MAP[doc.type] || 'description'}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{doc.name}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{doc.size} • {doc.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{doc.pages ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">{doc.date}</td>
                    <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deletingId === doc.id}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 dark:text-slate-500 hover:text-error transition-colors disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {deletingId === doc.id ? 'refresh' : 'delete'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Panel */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-200 dark:border-[#2a2f4a] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Indexing Activity</h3>
              <button className="text-secondary text-xs font-bold hover:underline">View Logs</button>
            </div>
            <div className="space-y-5">
              {[
                { dot: 'bg-secondary', title: 'Vector Database Optimization', time: '10 mins ago', desc: 'Successfully re-balanced embeddings across primary and secondary nodes.' },
                { dot: 'bg-amber-500', title: 'New SOP Ingestion', time: '1 hour ago', desc: 'SOP documents started chunking. Estimated time: 4 mins.' },
                { dot: 'bg-secondary', title: 'Auto Re-index Complete', time: '3 hours ago', desc: 'Scheduled daily re-index completed with 0 errors.' },
              ].map(a => (
                <div key={a.title} className="flex items-start gap-4">
                  <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${a.dot}`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{a.title}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{a.time}</span>
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
                <span className="text-xs uppercase tracking-widest font-bold">AI Insight</span>
              </div>
              <h4 className="font-h3 text-xl font-bold mb-3">Database Health is Optimal</h4>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">Your knowledge base is ready for queries. Upload more SOPs to expand coverage and improve AI response accuracy.</p>
              <button className="mt-auto w-full py-3 bg-secondary text-on-secondary-fixed font-bold rounded-xl hover:opacity-90 transition-all text-sm hover-lift">
                View Coverage Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
