'use client';
import { useState, useEffect } from 'react';
import { Trash2, Mail, MailOpen, RefreshCw } from 'lucide-react';

export default function InboxPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/submissions').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/submissions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    if (selected?._id === id) setSelected(null);
    load();
  };

  const open = (item: any) => {
    setSelected(item);
    if (!item.read) markRead(item._id);
  };

  const unread = items.filter(i => !i.read).length;

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <style>{`
        .inbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 1024px) {
          .inbox-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .inbox-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>Inbox</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {items.length} messages{unread > 0 ? `, ${unread} unread` : ''}
          </p>
        </div>
        <button className="admin-btn-ghost" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.25rem' }}>
          <Mail size={40} style={{ color: 'var(--text-faint)', marginBottom: '1rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)' }}>No messages yet. They'll appear here when people submit the contact form.</p>
        </div>
      ) : (
        <div className="inbox-grid" style={{ gridTemplateColumns: selected ? 'var(--cols)' : '1fr' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map(item => (
              <div
                key={item._id}
                onClick={() => open(item)}
                style={{ padding: '1.25rem 1.5rem', background: 'var(--surface)', border: `1px solid ${selected?._id === item._id ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '1rem', marginBottom: '0.75rem', cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ marginTop: '2px', color: item.read ? 'var(--text-faint)' : 'var(--primary)', flexShrink: 0 }}>
                    {item.read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: item.read ? 500 : 700, color: 'var(--text)', fontSize: '0.95rem' }}>{item.name}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{item.email}</p>
                    {item.service && <span className="admin-badge admin-badge-blue" style={{ marginTop: '0.4rem', display: 'inline-flex' }}>{item.service}</span>}
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-faint)', marginTop: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail pane */}
          {selected && (
            <div className="admin-card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--primary)', textDecoration: 'none' }}>{selected.email}</a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="admin-btn-danger" onClick={() => del(selected._id)} style={{ minHeight: '44px' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {selected.service && <span className="admin-badge admin-badge-blue">Service: {selected.service}</span>}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                  {new Date(selected.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <div style={{ background: 'var(--surface-high)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: Your enquiry`} className="admin-btn-save" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', minHeight: '44px' }}>
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
