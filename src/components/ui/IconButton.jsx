import React from 'react';

export default function IconButton({ icon: Icon, label, active = false, size = 4, className = '', ...props }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`
        p-1.5 rounded-lg transition-colors duration-150 flex items-center justify-center
        ${active
          ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'}
        ${className}
      `}
      {...props}
    >
      <Icon className={`w-${size} h-${size}`} />
    </button>
  );
}
