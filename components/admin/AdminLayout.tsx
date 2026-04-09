'use client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import { Settings, Info, Wrench, FolderOpen, MessageSquare, Inbox, LogOut, Sun, Moon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Panel = 'settings' | 'about' | 'services' | 'portfolio' | 'testimonials' | 'inbox';

const navItems: { key: Panel; label: string; icon: any }[] = [
  { key: 'settings', label: 'Site Settings', icon: Settings },
  { key: 'about', label: 'About Page', icon: Info },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { key: 'inbox', label: 'Inbox', icon: Inbox },
];

function Inner({ active, setActive, onLogout, children }: any) {
  const { theme, toggle } = useTheme();
  return (
    <>
    <CustomCursor />
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">C# Admin</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`admin-nav-item${active === item.key ? ' active' : ''}`}
                onClick={() => setActive(item.key)}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto', padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/" target="_blank" className="admin-nav-item" style={{ fontSize: '0.82rem' }}>
            <ExternalLink size={15} /> View Site
          </Link>
          <button className="admin-nav-item" onClick={toggle} style={{ fontSize: '0.82rem' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="admin-nav-item" onClick={onLogout} style={{ fontSize: '0.82rem', color: '#ff6b6b' }}>
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
    </>
  );
}

export default function AdminLayout({ active, setActive, onLogout, children }: { active: Panel; setActive: (p: Panel) => void; onLogout: () => void; children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Inner active={active} setActive={setActive} onLogout={onLogout}>{children}</Inner>
    </ThemeProvider>
  );
}
