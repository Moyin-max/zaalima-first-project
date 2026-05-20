import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';

export default function Topbar() {
  const { user } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16
        bg-white dark:bg-[#1a1d27] border-b border-slate-200 dark:border-[#2a2f4a]
        font-manrope text-sm antialiased">
        <div className="flex items-center gap-8">
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            OpsMind AI
          </span>
          <div className="relative w-72 hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[18px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#21253a] border border-transparent dark:border-[#2a2f4a] rounded-xl py-2 pl-9 pr-4 text-sm
                text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
              placeholder="Search SOPs or documentation..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-container text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 hover-lift"
          >
            <span className="material-symbols-outlined text-[16px]">publish</span>
            Upload SOP
          </button>

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-[#2a2f4a] pl-2 ml-1">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => {
                setNotifications(0);
                navigate('/settings');
              }}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21253a] rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21253a] rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>

            <div className="ml-1">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-[#2a2f4a] cursor-pointer hover:border-secondary transition-colors"
                title={user?.name}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </>
  );
}


function UploadModal({ onClose }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null); // { ok, error, chunks }
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    const allowed = ['application/pdf'];
    if (!allowed.includes(file.type)) {
      setUploadResult({ ok: false, error: 'Only PDF files are supported for upload.' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadResult({ ok: false, error: 'File size must be under 50 MB.' });
      return;
    }
    setSelectedFile(file);
    setUploadResult(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    // Simulate progress for UX (actual upload is a single POST)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) { clearInterval(progressInterval); return prev; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setProgress(100);
      setUploadResult({ ok: true, chunks: data.chunks, documentId: data.documentId });
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setUploadResult({ ok: false, error: err.message || 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setProgress(0);
  };

  const fileSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-h3 text-lg font-bold text-slate-900 dark:text-white">Upload SOP Document</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supported: PDF (max 50 MB)</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Success state */}
        {uploadResult?.ok ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">Upload Successful!</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{selectedFile?.name}</p>
            <p className="text-xs text-secondary font-semibold">{uploadResult.chunks} chunks indexed into knowledge base</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={resetModal}
                className="flex-1 border border-slate-200 dark:border-[#2a2f4a] text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#21253a] transition-colors text-sm"
              >
                Upload Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-primary-container text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer mb-4
                ${dragOver
                  ? 'border-secondary bg-secondary/5 dark:bg-secondary/10'
                  : selectedFile
                    ? 'border-secondary/40 bg-secondary/5 dark:bg-secondary/10'
                    : 'border-slate-200 dark:border-[#2a2f4a] hover:border-secondary/60'
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div>
                  <span className="material-symbols-outlined text-secondary text-4xl mb-3 block">description</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 truncate px-4">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{fileSizeMB} MB</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetModal(); }}
                    className="mt-3 text-xs text-error font-semibold hover:underline"
                  >
                    Remove & choose different file
                  </button>
                </div>
              ) : (
                <div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3 block">upload_file</span>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drop file here or click to browse</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Max file size: 50 MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                  e.target.value = ''; // Allow re-selecting same file
                }}
              />
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold">Uploading & indexing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-[#21253a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {uploadResult?.error && (
              <div className="mb-4 px-4 py-3 bg-error-container/20 border border-error/20 rounded-xl flex items-start gap-2.5">
                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">error</span>
                <p className="text-xs text-error font-medium leading-relaxed">{uploadResult.error}</p>
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full bg-primary-container text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all
                disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  Upload Document
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
