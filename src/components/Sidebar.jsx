import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onNewChat, chatHistory, activeId, setActiveId, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleNewChat = () => {
    const id = `temp-${Date.now()}`;
    onNewChat(id);
    navigate('/chat');
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  const navLinks = [
    { to: '/chat',      icon: 'chat_bubble', label: 'Query Agent' },
    { to: '/admin',     icon: 'database',    label: 'Knowledge Base' },
    { to: '/analytics', icon: 'monitoring',  label: 'System Analytics' },
    { to: '/settings',  icon: 'settings',    label: 'Settings' },
  ];

  const baseAside = `fixed left-0 top-0 h-full flex flex-col pt-16 z-40
    bg-white dark:bg-[#1a1d27] border-r border-slate-200 dark:border-[#2a2f4a]
    font-manrope text-sm font-medium`;

  if (collapsed) {
    return (
      <aside className={`${baseAside} hidden md:flex w-16 items-center py-4 gap-2`}>
        <button
          onClick={() => setCollapsed(false)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors mb-2"
          title="Expand sidebar"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        <button
          onClick={handleNewChat}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-white hover:opacity-90 transition-all mb-2 hover-lift"
          title="New Query"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
        <div className="flex-1" />
        {navLinks.map(l => (
          <NavLink
            key={l.to} to={l.to} title={l.label}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? 'bg-secondary/15 dark:bg-secondary/25 text-secondary'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#21253a]'
              }`}
          >
            <span className="material-symbols-outlined text-[20px]">{l.icon}</span>
          </NavLink>
        ))}
        <div className="mt-auto pt-4">
          <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-[#2a2f4a]" />
        </div>
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[1px] md:hidden transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside className={`${baseAside} w-72 max-w-[85vw] md:w-64 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Brand + Collapse */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-[#21253a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">psychology</span>
            </div>
            <div>
              <div className="text-slate-900 dark:text-white font-black leading-none text-sm">OpsMind AI</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-0.5">Enterprise</div>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.innerWidth < 768) onClose?.();
              else setCollapsed(true);
            }}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21253a] p-1.5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">{isOpen ? 'close' : 'menu_open'}</span>
          </button>
        </div>

      {/* New Query */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-secondary text-white rounded-xl
              hover:opacity-90 transition-all shadow-md shadow-secondary/20 text-sm font-semibold hover-lift"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            New Query
          </button>
        </div>

      {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Navigation</div>
          {navLinks.map(l => (
            <NavLink
              key={l.to} to={l.to}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-secondary/10 dark:bg-secondary/20 text-secondary font-semibold border-l-2 border-secondary'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#21253a]'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}

        {/* Recent Queries */}
          {chatHistory && chatHistory.length > 0 && (
            <>
              <div className="px-3 pt-5 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider">Recent Queries</div>
              {chatHistory.slice(0, 5).map(h => (
                <button
                  key={h.id}
                  onClick={() => { setActiveId(h.id); navigate('/chat'); onClose?.(); }}
                  className={`w-full text-left block px-4 py-2 text-xs rounded-xl transition-colors truncate ${
                    activeId === h.id
                      ? 'bg-slate-100 dark:bg-[#21253a] text-slate-900 dark:text-white font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#21253a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] mr-2 align-middle text-slate-400 dark:text-slate-500">history</span>
                  {h.title}
                </button>
              ))}
            </>
          )}
        </nav>

      {/* Footer */}
        <div className="border-t border-slate-100 dark:border-[#21253a] p-3">
          <NavLink to="/settings" onClick={() => onClose?.()} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#21253a] rounded-xl transition-all text-sm mb-1">
            <span className="material-symbols-outlined text-[18px]">help_center</span>
            Support
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error-container/20 rounded-xl transition-all text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>

        {/* User profile */}
          <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-slate-100 dark:border-[#21253a]">
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-[#2a2f4a] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</div>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
              user?.role === 'admin'
                ? 'bg-secondary/15 dark:bg-secondary/25 text-secondary'
                : 'bg-slate-100 dark:bg-[#21253a] text-slate-500 dark:text-slate-400'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
