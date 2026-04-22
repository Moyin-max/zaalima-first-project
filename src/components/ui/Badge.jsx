import React from 'react';

const variants = {
  ready:      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  processing: 'bg-amber-50  dark:bg-amber-900/20  text-amber-700  dark:text-amber-400  border border-amber-200  dark:border-amber-800',
  error:      'bg-red-50    dark:bg-red-900/20    text-red-700    dark:text-red-400    border border-red-200    dark:border-red-800',
  info:       'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
};

export default function Badge({ variant = 'info', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
