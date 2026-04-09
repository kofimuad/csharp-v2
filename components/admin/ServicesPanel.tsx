'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader, GripVertical, Eye, EyeOff } from 'lucide-react';

const ICON_OPTIONS = ['Monitor','Smartphone','Layers','BarChart3','Settings2','Code','Globe','Palette','Database','Shield','Zap','Users'];

export default function ServicesPanel() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ title: '', description: '', icon: 'Monitor', link: '', linkLabel: '', visible: true });

  const load = () => fetch('/api/services/all').then(r => r.json()).then(d => { setServices(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const saveEdit = async (id: string) => {
    setSaving(id);
    await fetch(`/api/services/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
    setSaving(null); setEditId(null); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    load();
  };

  const create = async () => {
    if (!newData.title || !newData.description) return;
    setSaving('new');
    await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newData, order: services.length + 1 }) });
    setSaving(null); setShowNew(false); setNewData({ title: '', description: '', icon: 'Monitor', link: '', linkLabel: '', visible: true }); load();
  };

  const startEdit = (s: any) => { setEditId(s._id); setEditData({ ...s }); };

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>Services</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>{services.length} services configured.</p>
        </div>
        <button className="admin-btn-save" onClick={() => setShowNew(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {showNew && (
        <div className="admin-card" style={{ borderColor: 'var(--primary)' }}>
          <p className="admin-card-title">New Service</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Title *</label>
              <input className="admin-input" value={newData.title} onChange={e => setNewData(d => ({ ...d, title: e.target.value }))} placeholder="Service name" />
            </div>
            <div>
              <label className="admin-label">Icon</label>
              <select className="admin-select" value={newData.icon} onChange={e => setNewData(d => ({ ...d, icon: e.target.value }))}>
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
          </div>
          <label className="admin-label">Description *</label>
          <textarea className="admin-textarea" value={newData.description} onChange={e => setNewData(d => ({ ...d, description: e.target.value }))} placeholder="Describe this service…" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label className="admin-label">Link (optional)</label><input className="admin-input" value={newData.link} onChange={e => setNewData(d => ({ ...d, link: e.target.value }))} placeholder="/portfolio" /></div>
            <div><label className="admin-label">Link Label</label><input className="admin-input" value={newData.linkLabel} onChange={e => setNewData(d => ({ ...d, linkLabel: e.target.value }))} placeholder="View case study" /></div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button className="admin-btn-save" onClick={create} disabled={saving === 'new'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saving === 'new' ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />} Create
            </button>
            <button className="admin-btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      {services.map((s, i) => (
        <div key={s._id} className="admin-card">
          {editId === s._id ? (
            <>
              <p className="admin-card-title">Editing: {s.title}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="admin-label">Title</label><input className="admin-input" value={editData.title} onChange={e => setEditData((d: any) => ({ ...d, title: e.target.value }))} /></div>
                <div>
                  <label className="admin-label">Icon</label>
                  <select className="admin-select" value={editData.icon} onChange={e => setEditData((d: any) => ({ ...d, icon: e.target.value }))}>
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" value={editData.description} onChange={e => setEditData((d: any) => ({ ...d, description: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label className="admin-label">Link</label><input className="admin-input" value={editData.link || ''} onChange={e => setEditData((d: any) => ({ ...d, link: e.target.value }))} /></div>
                <div><label className="admin-label">Link Label</label><input className="admin-input" value={editData.linkLabel || ''} onChange={e => setEditData((d: any) => ({ ...d, linkLabel: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="admin-btn-save" onClick={() => saveEdit(s._id)} disabled={saving === s._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {saving === s._id ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />} Save
                </button>
                <button className="admin-btn-ghost" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>0{i+1}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{s.title}</span>
                  <span className={`admin-badge ${s.visible ? 'admin-badge-green' : 'admin-badge-red'}`}>{s.visible ? 'Visible' : 'Hidden'}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-faint)', lineHeight: 1.6, maxWidth: 600 }}>{s.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="admin-btn-ghost" onClick={() => startEdit(s)}>Edit</button>
                <button className="admin-btn-ghost" onClick={() => fetch(`/api/services/${s._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !s.visible }) }).then(() => load())} title={s.visible ? 'Hide' : 'Show'}>
                  {s.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button className="admin-btn-danger" onClick={() => del(s._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
