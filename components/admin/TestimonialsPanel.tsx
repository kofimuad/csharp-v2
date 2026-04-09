'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader, Eye, EyeOff } from 'lucide-react';

export default function TestimonialsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ name:'', role:'', company:'', text:'', initials:'', visible: true });

  const load = () => fetch('/api/testimonials/all').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const saveEdit = async (id: string) => {
    setSaving(id);
    await fetch(`/api/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
    setSaving(null); setEditId(null); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  const create = async () => {
    if (!newData.name || !newData.text) return;
    setSaving('new');
    const initials = newData.initials || newData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newData, initials }) });
    setSaving(null); setShowNew(false); setNewData({ name:'', role:'', company:'', text:'', initials:'', visible: true }); load();
  };

  const quickUpdate = async (id: string, patch: any) => {
    await fetch(`/api/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    load();
  };

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>Testimonials</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>{items.length} testimonials.</p>
        </div>
        <button className="admin-btn-save" onClick={() => setShowNew(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {showNew && (
        <div className="admin-card" style={{ borderColor: 'var(--primary)' }}>
          <p className="admin-card-title">New Testimonial</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div><label className="admin-label">Name *</label><input className="admin-input" value={newData.name} onChange={e => setNewData(d => ({ ...d, name: e.target.value }))} placeholder="Ama Asante" /></div>
            <div><label className="admin-label">Role</label><input className="admin-input" value={newData.role} onChange={e => setNewData(d => ({ ...d, role: e.target.value }))} placeholder="CEO" /></div>
            <div><label className="admin-label">Company</label><input className="admin-input" value={newData.company} onChange={e => setNewData(d => ({ ...d, company: e.target.value }))} placeholder="Novus Tech" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
            <div>
              <label className="admin-label">Quote *</label>
              <textarea className="admin-textarea" value={newData.text} onChange={e => setNewData(d => ({ ...d, text: e.target.value }))} placeholder="What they said about you…" />
            </div>
            <div><label className="admin-label">Initials</label><input className="admin-input" value={newData.initials} onChange={e => setNewData(d => ({ ...d, initials: e.target.value }))} placeholder="AA (auto)" /></div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <button className="admin-btn-save" onClick={create} disabled={saving === 'new'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saving === 'new' ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />} Create
            </button>
            <button className="admin-btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      {items.map(t => (
        <div key={t._id} className="admin-card">
          {editId === t._id ? (
            <>
              <p className="admin-card-title">Editing</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div><label className="admin-label">Name</label><input className="admin-input" value={editData.name || ''} onChange={e => setEditData((d: any) => ({ ...d, name: e.target.value }))} /></div>
                <div><label className="admin-label">Role</label><input className="admin-input" value={editData.role || ''} onChange={e => setEditData((d: any) => ({ ...d, role: e.target.value }))} /></div>
                <div><label className="admin-label">Company</label><input className="admin-input" value={editData.company || ''} onChange={e => setEditData((d: any) => ({ ...d, company: e.target.value }))} /></div>
              </div>
              <label className="admin-label">Quote</label>
              <textarea className="admin-textarea" value={editData.text || ''} onChange={e => setEditData((d: any) => ({ ...d, text: e.target.value }))} />
              <label className="admin-label">Initials</label>
              <input className="admin-input" value={editData.initials || ''} onChange={e => setEditData((d: any) => ({ ...d, initials: e.target.value }))} style={{ maxWidth: 100 }} />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button className="admin-btn-save" onClick={() => saveEdit(t._id)} disabled={saving === t._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {saving === t._id ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />} Save
                </button>
                <button className="admin-btn-ghost" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.82rem', color: '#000', flexShrink: 0 }}>{t.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text)' }}>{t.name}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-faint)' }}>{t.role}, {t.company}</span>
                  {!t.visible && <span className="admin-badge admin-badge-red">Hidden</span>}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="admin-btn-ghost" onClick={() => { setEditId(t._id); setEditData({ ...t }); }}>Edit</button>
                <button className="admin-btn-ghost" onClick={() => quickUpdate(t._id, { visible: !t.visible })} title="Toggle visibility">{t.visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button className="admin-btn-danger" onClick={() => del(t._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
