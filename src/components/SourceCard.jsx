import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, Zap } from 'lucide-react';

export default function SourceCard({ source, onView }) {
  const [expanded, setExpanded] = useState(false);
  const relevancePct = Math.round(source.relevance * 100);

  // Relevance color
  const relColor = relevancePct >= 92 ? '#22c55e'
                 : relevancePct >= 80 ? '#818cf8'
                 : '#f59e0b';

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 12, overflow: 'hidden',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top strip — relevance color */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${relColor} ${relevancePct}%, var(--color-border) ${relevancePct}%)` }} />

      <div style={{ padding: '12px 14px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(0,229,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={15} color="#818cf8" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 13, fontWeight: 600, color: 'var(--color-text)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                lineHeight: 1.3, marginBottom: 1,
              }}>
                {source.fileName}
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                Page {source.page} · {source.uploadDate}
              </p>
            </div>
          </div>

          {/* Relevance badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '2px 8px', borderRadius: 999, flexShrink: 0,
            fontSize: 11, fontWeight: 700,
            background: relevancePct >= 92 ? 'var(--color-success-bg)'
                      : relevancePct >= 80 ? 'var(--color-info-bg)'
                      : 'var(--color-warning-bg)',
            color: relColor,
            border: `1px solid ${relevancePct >= 92 ? 'var(--color-success-border)'
                               : relevancePct >= 80 ? 'var(--color-info-border)'
                               : 'var(--color-warning-border)'}`,
          }}>
            {relevancePct}%
          </span>
        </div>

        {/* Snippet */}
        <p style={{
          fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.65,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? undefined : 2,
          WebkitBoxOrient: 'vertical',
          overflow: expanded ? 'visible' : 'hidden',
          fontStyle: 'italic',
          marginBottom: 10,
        }}>
          "{source.snippet}"
        </p>

        {/* Action row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 11.5, fontWeight: 500,
              color: 'var(--color-text-faint)', background: 'transparent',
              border: 'none', cursor: 'pointer', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {expanded ? 'Show less' : 'Show more'}
          </button>

          <button
            onClick={() => onView && onView(source)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '5px 12px', borderRadius: 7,
              fontSize: 12, fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'var(--color-info-bg)',
              border: '1px solid var(--color-info-border)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-info-bg)'; }}
          >
            View
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
