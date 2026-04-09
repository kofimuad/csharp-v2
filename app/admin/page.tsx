'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsPanel from '@/components/admin/SettingsPanel';
import AboutPanel from '@/components/admin/AboutPanel';
import ServicesPanel from '@/components/admin/ServicesPanel';
import PortfolioPanel from '@/components/admin/PortfolioPanel';
import TestimonialsPanel from '@/components/admin/TestimonialsPanel';
import InboxPanel from '@/components/admin/InboxPanel';

type Panel = 'settings' | 'about' | 'services' | 'portfolio' | 'testimonials' | 'inbox';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [active, setActive] = useState<Panel>('settings');

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'yes') setAuthed(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
      setAuthed(true);
      sessionStorage.setItem('admin_authed', 'yes');
    } else {
      setAuthError('Incorrect password.');
      setTimeout(() => setAuthError(''), 2500);
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: 420 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--text)', marginBottom: '0.5rem' }}>C# Admin</div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.9rem', marginBottom: '2rem' }}>Enter your password to continue.</p>
          <form onSubmit={login}>
            <input
              type="password"
              className="admin-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p style={{ color: '#ff6b6b', fontFamily: 'var(--font-body)', fontSize: '0.82rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>{authError}</p>}
            <button type="submit" className="admin-btn-save" style={{ width: '100%' }}>Enter Dashboard →</button>
          </form>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '1.5rem', textAlign: 'center' }}>
            Default password: <code style={{ background: 'var(--surface-high)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>admin123</code><br/>
            Change via NEXT_PUBLIC_ADMIN_PASSWORD in .env.local
          </p>
        </div>
      </div>
    );
  }

  const panels: Record<Panel, React.ReactNode> = {
    settings: <SettingsPanel />,
    about: <AboutPanel />,
    services: <ServicesPanel />,
    portfolio: <PortfolioPanel />,
    testimonials: <TestimonialsPanel />,
    inbox: <InboxPanel />,
  };

  return (
    <AdminLayout active={active} setActive={setActive} onLogout={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false); }}>
      {panels[active]}
    </AdminLayout>
  );
}
