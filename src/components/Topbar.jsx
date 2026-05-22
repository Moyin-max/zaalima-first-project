import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Topbar({ onMenuClick }) {
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
        <div className="flex items-center gap-3 md:gap-8 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <span className="text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            OpsMind AI
          </span>
          <div className="relative w-72 hidden lg:block">
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

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-container text-white px-3 md:px-4 py-2 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:opacity-90 hover-lift"
          >
            <span className="material-symbols-outlined text-[16px]">publish</span>
            <span className="hidden sm:inline">Upload SOP</span>
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
              className="hidden sm:block p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21253a] rounded-xl transition-colors"
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
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-h3 text-lg font-bold text-slate-900 dark:text-white">Upload SOP Document</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supported: PDF, DOCX, XLSX, JSON</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-[#2a2f4a] rounded-2xl p-10 text-center hover:border-secondary/60 transition-colors cursor-pointer mb-4">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl mb-3 block">upload_file</span>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Drop file here or click to browse</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Max file size: 50MB</p>
              <input type="file" className="hidden" accept=".pdf,.docx,.xlsx,.json" />
            </div>
            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full bg-primary-container text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}
    </>
  );
}
