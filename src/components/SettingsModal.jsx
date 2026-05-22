import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, User, Bell, Shield, Palette, Check, Camera, Pencil, Save, Info, Zap } from 'lucide-react';

const TABS = [
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
  { id: 'account',      label: 'Account',        icon: User },
  { id: 'notifications',label: 'Notifications',  icon: Bell },
];

// ── Section wrapper ────────────────────────────────────────────
function Section({ label, desc, children }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 2 }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Appearance Tab ─────────────────────────────────────────────
function AppearanceTab({ themeMode, onThemeModeChange, fontSize, onFontSizeChange, darkMode }) {
  const themes = [
    {
      id: 'light', label: 'Light', icon: Sun,
      preview: { bg: '#f9fafb', sidebar: '#f3f4f6', chat: '#ffffff' },
    },
    {
      id: 'dark',  label: 'Dark',  icon: Moon,
      preview: { bg: '#212121', sidebar: '#171717', chat: '#212121' },
    },
    {
      id: 'system', label: 'System', icon: Monitor,
      preview: null, // gradient swatch
    },
  ];

  const fontLabels    = ['Small', 'Default', 'Large'];
  const densityLabels = ['Compact', 'Comfortable'];
  const [density, setDensity] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Theme ─────────────────────────────────────── */}
      <Section label="Theme" desc="Choose your preferred colour scheme">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {themes.map(t => {
            const Icon   = t.icon;
            const active = themeMode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeModeChange(t.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 10, padding: '16px 12px', borderRadius: 14,
                  border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: active ? 'var(--color-info-bg)' : 'var(--bg-input)',
                  cursor: 'pointer', transition: 'all 0.18s', position: 'relative', outline: 'none',
                  boxShadow: active ? '0 0 0 4px rgba(0,229,255,0.12)' : 'none',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.35)'; e.currentTarget.style.background = 'var(--bg-card)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--bg-input)'; }}}
              >
                {active && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </span>
                )}
                {/* Mini preview swatch */}
                {t.preview ? (
                  <div style={{
                    width: 52, height: 34, borderRadius: 8, overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    display: 'flex', background: t.preview.bg,
                  }}>
                    <div style={{ width: 14, background: t.preview.sidebar }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 4, gap: 3 }}>
                      <div style={{ height: 3, borderRadius: 2, background: t.id === 'light' ? '#d1d5db' : '#3f3f3f', width: '80%' }} />
                      <div style={{ height: 3, borderRadius: 2, background: t.id === 'light' ? '#e5e7eb' : '#2f2f2f', width: '60%' }} />
                    </div>
                  </div>
                ) : (
                  /* System: half/half swatch */
                  <div style={{
                    width: 52, height: 34, borderRadius: 8, overflow: 'hidden',
                    border: '1px solid var(--color-border)', display: 'flex',
                  }}>
                    <div style={{ width: '50%', background: '#f9fafb' }} />
                    <div style={{ width: '50%', background: '#212121' }} />
                  </div>
                )}
                <Icon size={17} color={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        {themeMode === 'system' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            marginTop: 10, padding: '8px 12px', borderRadius: 9,
            background: 'var(--color-info-bg)', border: '1px solid var(--color-info-border)',
            fontSize: 12, color: 'var(--color-info)',
          }}>
            <Info size={13} />
            Following your OS setting — currently <strong>{window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}</strong>
          </div>
        )}
      </Section>

      {/* Instant toggle row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderRadius: 12,
        background: 'var(--bg-input)', border: '1px solid var(--color-border)',
      }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>
            {darkMode ? '🌙 Dark mode active' : '☀️ Light mode active'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Quick toggle without touching theme selection</p>
        </div>
        <button
          onClick={() => onThemeModeChange(darkMode ? 'light' : 'dark')}
          style={{
            width: 48, height: 26, borderRadius: 13, border: 'none', flexShrink: 0,
            background: darkMode ? 'var(--color-primary)' : 'var(--color-border)',
            cursor: 'pointer', position: 'relative', transition: 'background 0.22s',
          }}
        >
          <span style={{
            position: 'absolute', top: 4,
            left: darkMode ? 24 : 4,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          }} />
        </button>
      </div>

      {/* ── Font Size ─────────────────────────────────── */}
      <Section label="Font Size" desc="Changes the text size in chat messages">
        <div style={{ display: 'flex', gap: 8 }}>
          {fontLabels.map((size, i) => {
            const active = fontSize === i;
            return (
              <button
                key={size}
                onClick={() => onFontSizeChange(i)}
                style={{
                  flex: 1, padding: '11px 8px', borderRadius: 10,
                  border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: active ? 'var(--color-info-bg)' : 'var(--bg-input)',
                  cursor: 'pointer',
                  fontSize: i === 0 ? '11px' : i === 1 ? '13.5px' : '15.5px',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.15s', outline: 'none',
                  boxShadow: active ? '0 0 0 3px rgba(0,229,255,0.12)' : 'none',
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--color-text-faint)', marginTop: 8 }}>
          Currently: <strong style={{ color: 'var(--color-text-muted)' }}>{fontLabels[fontSize]}</strong>
          {' — '}preview: <span style={{ fontSize: ['11px','13.5px','15.5px'][fontSize] }}>OpsMind AI response text</span>
        </p>
      </Section>

      {/* ── Message Density ───────────────────────────── */}
      <Section label="Message Density" desc="Controls spacing between chat messages">
        <div style={{ display: 'flex', gap: 8 }}>
          {densityLabels.map((d, i) => {
            const active = density === i;
            return (
              <button
                key={d}
                onClick={() => setDensity(i)}
                style={{
                  flex: 1, padding: '11px 8px', borderRadius: 10,
                  border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: active ? 'var(--color-info-bg)' : 'var(--bg-input)',
                  cursor: 'pointer', fontSize: 13,
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.15s', outline: 'none',
                  boxShadow: active ? '0 0 0 3px rgba(0,229,255,0.12)' : 'none',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Live Preview ──────────────────────────────── */}
      <Section label="Live Preview">
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { emoji: '🎨', label: 'Theme',   value: themeMode === 'system' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light' },
            { emoji: '📝', label: 'Font',    value: fontLabels[fontSize] },
            { emoji: '📐', label: 'Density', value: densityLabels[density] },
          ].map(item => (
            <div key={item.label} style={{
              flex: 1, textAlign: 'center', padding: '12px 8px', borderRadius: 10,
              background: 'var(--bg-card)', border: '1px solid var(--color-border)',
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{item.emoji}</div>
              <div style={{ fontSize: 10.5, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── Account Tab ────────────────────────────────────────────────
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';
}
function nameToGradient(name = '') {
  const h1 = (name.charCodeAt(0) || 200) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1},70%,55%), hsl(${h2},70%,45%))`;
}

function AccountTab({ profile, onProfileChange }) {
  const [editMode, setEditMode] = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [draft,    setDraft]    = useState({ ...profile });

  // Keep draft in sync when profile changes externally
  useEffect(() => { if (!editMode) setDraft({ ...profile }); }, [profile]);

  const handleEdit = () => {
    setDraft({ ...profile });
    setEditMode(true);
    setSaved(false);
  };

  const handleSave = () => {
    onProfileChange({ ...draft });   // ← pushes up to App.jsx → Sidebar updates
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditMode(false);
  };

  const fields = [
    { key: 'fullName',   label: 'Full Name',     placeholder: 'Your full name' },
    { key: 'email',      label: 'Email Address',  placeholder: 'you@company.com' },
    { key: 'department', label: 'Department',     placeholder: 'e.g. Engineering' },
    { key: 'role',       label: 'Role',           placeholder: 'e.g. Senior Developer' },
  ];

  const initials  = getInitials(editMode ? draft.fullName : profile.fullName);
  const avatarGrad = nameToGradient(editMode ? draft.fullName : profile.fullName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Avatar card */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 18px', borderRadius: 14,
        background: editMode ? 'var(--bg-chat)' : 'var(--bg-input)',
        border: `1.5px solid ${editMode ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
        transition: 'all 0.2s',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%', background: avatarGrad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{initials}</span>
          </div>
          {editMode && (
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-chat)', cursor: 'pointer',
            }}>
              <Camera size={10} color="#fff" />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--color-text)' }}>
            {editMode ? (draft.fullName || 'Your Name') : profile.fullName}
          </p>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 1 }}>
            {editMode ? (draft.email || 'your@email.com') : profile.email}
          </p>
          <p style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 2 }}>Enterprise Plan · {profile.role}</p>
        </div>
        {/* Edit / Save+Cancel buttons */}
        {!editMode ? (
          <button
            onClick={handleEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9,
              border: '1px solid var(--color-border)',
              background: 'transparent', fontSize: 12.5, color: 'var(--color-text-muted)',
              cursor: 'pointer', fontWeight: 500, flexShrink: 0, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-info-bg)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            <Pencil size={13} /> Edit profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '7px 12px', borderRadius: 9,
                border: '1px solid var(--color-border)',
                background: 'transparent', fontSize: 12.5, color: 'var(--color-text-muted)',
                cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 9, border: 'none',
                background: 'var(--color-primary)', color: '#fff',
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; }}
            >
              <Save size={12} /> Save
            </button>
          </div>
        )}
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 14px', borderRadius: 10,
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              color: 'var(--color-success)', fontSize: 13.5, fontWeight: 500,
            }}
          >
            <Check size={15} />
            Profile saved — sidebar name updated!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form fields */}
      {fields.map(field => (
        <div key={field.key}>
          <label style={{
            display: 'block', fontSize: 11.5, fontWeight: 700,
            color: editMode ? 'var(--color-text-muted)' : 'var(--color-text-faint)',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em',
            transition: 'color 0.2s',
          }}>
            {field.label}
          </label>
          <input
            readOnly={!editMode}
            value={editMode ? draft[field.key] : profile[field.key]}
            placeholder={field.placeholder}
            onChange={e => setDraft(prev => ({ ...prev, [field.key]: e.target.value }))}
            style={{
              width: '100%', padding: '10px 13px', borderRadius: 9,
              border: `1.5px solid ${editMode ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
              background: editMode ? 'var(--bg-chat)' : 'var(--bg-input)',
              color: 'var(--color-text)', fontSize: 13.5,
              fontFamily: 'inherit', outline: 'none',
              transition: 'all 0.18s',
              cursor: editMode ? 'text' : 'default',
              boxShadow: editMode ? '0 0 0 3px rgba(0,229,255,0.08)' : 'none',
            }}
            onFocus={e => {
              if (editMode) {
                e.currentTarget.style.borderColor  = 'var(--color-primary)';
                e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(0,229,255,0.14)';
              }
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = editMode ? 'var(--color-border-focus)' : 'var(--color-border)';
              e.currentTarget.style.boxShadow   = editMode ? '0 0 0 3px rgba(0,229,255,0.08)' : 'none';
            }}
          />
        </div>
      ))}

      {/* Danger zone */}
      <div style={{
        padding: '14px 16px', borderRadius: 12, marginTop: 6,
        border: '1px solid var(--color-danger-border)',
        background: 'var(--color-danger-bg)',
      }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 4 }}>Danger Zone</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>These actions are permanent and cannot be undone.</p>
        <button style={{
          padding: '7px 14px', borderRadius: 8,
          border: '1px solid var(--color-danger-border)',
          background: 'transparent', color: 'var(--color-danger)',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-danger-bg)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}
        >
          Sign out of all devices
        </button>
      </div>
    </div>
  );
}

// ── Notifications Tab ──────────────────────────────────────────
function NotificationsTab({ profile }) {
  const [prefs, setPrefs] = useState({
    newSOP: true, citations: true, adminAlerts: false, weeklyDigest: true,
  });
  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'newSOP',       label: 'New document indexed',  desc: 'When a new SOP is added to the knowledge base' },
    { key: 'citations',    label: 'Citation updates',      desc: 'When a cited document is updated or re-indexed' },
    { key: 'adminAlerts',  label: 'Admin alerts',          desc: 'Processing errors or system notifications' },
    { key: 'weeklyDigest', label: 'Weekly digest',         desc: 'Summary of SOP updates every Monday morning' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <div
          key={item.key}
          onClick={() => toggle(item.key)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 12,
            border: `1.5px solid ${prefs[item.key] ? 'var(--color-info-border)' : 'var(--color-border)'}`,
            background: prefs[item.key] ? 'var(--color-info-bg)' : 'var(--bg-card)',
            gap: 16, transition: 'all 0.18s', cursor: 'pointer',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>{item.label}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.45 }}>{item.desc}</p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); toggle(item.key); }}
            aria-label={`Toggle ${item.label}`}
            style={{
              width: 46, height: 25, borderRadius: 12, border: 'none',
              background: prefs[item.key] ? 'var(--color-primary)' : 'var(--color-border)',
              cursor: 'pointer', transition: 'background 0.2s',
              position: 'relative', flexShrink: 0, outline: 'none',
            }}
          >
            <span style={{
              position: 'absolute', top: 4,
              left: prefs[item.key] ? 23 : 4,
              width: 17, height: 17, borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }} />
          </button>
        </div>
      ))}

      <div style={{
        padding: '12px 14px', borderRadius: 10, marginTop: 4,
        background: 'var(--bg-input)', border: '1px solid var(--color-border)',
        fontSize: 12, color: 'var(--color-text-faint)', lineHeight: 1.55,
      }}>
        💡 Notifications sent to{' '}
        <strong style={{ color: 'var(--color-text-muted)' }}>{profile?.email || 'your email'}</strong>.
        Update in the Account tab.
      </div>
    </div>
  );
}

// ── Modal shell ────────────────────────────────────────────────
export default function SettingsModal({
  isOpen, onClose,
  profile, onProfileChange,
  themeMode, onThemeModeChange,
  fontSize,  onFontSizeChange,
  darkMode,
}) {
  const [activeTab, setActiveTab] = useState('appearance');
  useEffect(() => { if (isOpen) setActiveTab('appearance'); }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)',
          }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              width: '100%', maxWidth: 680, maxHeight: '92vh',
              background: 'var(--bg-chat)', borderRadius: 22,
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,229,255,0.35)',
                }}>
                  <Shield size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>Settings</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>OpsMind AI Enterprise</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
              {/* Tab sidebar */}
              <div style={{
                width: 175, flexShrink: 0, padding: '14px 8px',
                borderRight: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column', gap: 3,
              }}>
                {TABS.map(tab => {
                  const Icon   = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 13px', borderRadius: 9, border: 'none',
                        background: active ? 'var(--color-info-bg)' : 'transparent',
                        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        fontSize: 13.5, fontWeight: active ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                        outline: 'none', width: '100%',
                        borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-border)'; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; } }}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}

                {/* Mini theme toggle at bottom of left panel */}
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: 10.5, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 4 }}>Quick Toggle</p>
                  <button
                    onClick={() => onThemeModeChange(darkMode ? 'light' : 'dark')}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 8, border: 'none',
                      background: 'var(--bg-input)', cursor: 'pointer',
                      fontSize: 12.5, color: 'var(--color-text-muted)',
                      fontWeight: 500, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-input)'}
                  >
                    {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                    {darkMode ? 'Light mode' : 'Dark mode'}
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px' }}>
                {activeTab === 'appearance' && (
                  <AppearanceTab
                    themeMode={themeMode}
                    onThemeModeChange={onThemeModeChange}
                    fontSize={fontSize}
                    onFontSizeChange={onFontSizeChange}
                    darkMode={darkMode}
                  />
                )}
                {activeTab === 'account' && (
                  <AccountTab profile={profile} onProfileChange={onProfileChange} />
                )}
                {activeTab === 'notifications' && (
                  <NotificationsTab profile={profile} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8,
              padding: '14px 24px', borderTop: '1px solid var(--color-border)', flexShrink: 0,
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '9px 20px', borderRadius: 9,
                  border: '1px solid var(--color-border)',
                  background: 'transparent', color: 'var(--color-text-muted)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-input)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Close
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '9px 22px', borderRadius: 9, border: 'none',
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(0,229,255,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,229,255,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,229,255,0.3)'; }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
