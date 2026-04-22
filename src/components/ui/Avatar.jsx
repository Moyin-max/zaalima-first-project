import React from 'react';

const sizes = {
  sm: 'w-6 h-6 text-[9px]',
  md: 'w-8 h-8 text-[10px]',
  lg: 'w-10 h-10 text-xs',
};

export default function Avatar({ initials = 'AI', gradient = 'from-indigo-500 to-purple-600', size = 'md', className = '' }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 font-bold text-white shadow-sm ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
