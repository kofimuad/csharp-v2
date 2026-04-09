'use client';
import { useState, useEffect } from 'react';
import { Save, Loader, Plus, Trash2 } from 'lucide-react';

export default function AboutPanel() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(d => { setData(d || {}); setLoading(false); });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const f = (key: string) => ({
    value: data[key] || '',
    onChange: (e: any) => setData((d: any) => ({ ...d, [key]: e.target.value })),
  });

  const updateArrayItem = (key: string, idx: number, val: string) =>
    setData((d: any) => ({ ...d, [key]: d[key].map((v: string, i: number) => i === idx ? val : v) }));
  const removeArrayItem = (key: string, idx: number) =>
    setData((d: any) => ({ ...d, [key]: d[key].filter((_: any, i: number) => i !== idx) }));
  const addArrayItem = (key: string) =>
    setData((d: any) => ({ ...d, [key]: [...(d[key] || []), ''] }));

  const updateStat = (idx: number, field: string, val: string) =>
    setData((d: any) => ({ ...d, stats: d.stats.map((s: any, i: number) => i === idx ? { ...s, [field]: val } : s) }));

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>About Page</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>Edit your company story, vision, mission, and stats.</p>
        </div>
        <button className="admin-btn-save" onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saving ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Vision & Mission</p>
        <label className="admin-label">Vision</label>
        <textarea className="admin-textarea" {...f('vision')} />
        <label className="admin-label">Mission</label>
        <textarea className="admin-textarea" {...f('mission')} />
        <label className="admin-label">Philosophy Quote</label>
        <input className="admin-input" {...f('philosophy')} placeholder="An interface should disappear…" />
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Body Text Paragraphs</p>
        {(data.body || []).map((para: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
            <textarea
              className="admin-textarea"
              style={{ marginBottom: 0, flex: 1 }}
              value={para}
              onChange={e => updateArrayItem('body', i, e.target.value)}
            />
            <button className="admin-btn-danger" onClick={() => removeArrayItem('body', i)} style={{ marginTop: '0.25rem', padding: '0.5rem' }}><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="admin-btn-ghost" onClick={() => addArrayItem('body')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Plus size={14} /> Add Paragraph
        </button>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Rotating Quotes</p>
        {(data.quotes || []).map((q: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input className="admin-input" style={{ marginBottom: 0, flex: 1 }} value={q} onChange={e => updateArrayItem('quotes', i, e.target.value)} />
            <button className="admin-btn-danger" onClick={() => removeArrayItem('quotes', i)} style={{ padding: '0.5rem' }}><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="admin-btn-ghost" onClick={() => addArrayItem('quotes')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Plus size={14} /> Add Quote
        </button>
      </div>

      <div className="admin-card">
        <p className="admin-card-title">Stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {(data.stats || []).map((s: any, i: number) => (
            <div key={i} style={{ background: 'var(--surface-high)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid var(--border)' }}>
              <label className="admin-label">Value</label>
              <input className="admin-input" value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="40" />
              <label className="admin-label">Suffix</label>
              <input className="admin-input" value={s.suffix} onChange={e => updateStat(i, 'suffix', e.target.value)} placeholder="+" />
              <label className="admin-label">Label</label>
              <input className="admin-input" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Projects Delivered" />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
