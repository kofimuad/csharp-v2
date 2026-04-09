'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Save, Loader, Eye, EyeOff, Star, Upload, Link as LinkIcon, GripVertical, X } from 'lucide-react';

const CATEGORIES = ['web', 'mobile', 'design', 'consulting', 'other'];

interface MediaItem { type: 'image' | 'video'; url: string; caption?: string; localPreview?: string; }

// ── Drag-to-reorder media grid ──
function MediaGrid({ items, onChange }: { items: MediaItem[]; onChange: (items: MediaItem[]) => void }) {
  const dragIdx = useRef<number | null>(null);

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(i, 0, moved);
    dragIdx.current = i;
    onChange(next);
  };

  if (!items.length) return null;
  return (
    <div className="media-preview-grid" style={{ marginTop: '0.75rem' }}>
      {items.map((m, i) => (
        <div
          key={i}
          className="media-preview-item"
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => onDragOver(e, i)}
          style={{ userSelect: 'none' }}
        >
          {m.type === 'video' ? (
            <video src={m.localPreview || m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
          ) : (
            <img src={m.localPreview || m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <button className="media-preview-remove" onClick={() => remove(i)} title="Remove"><X size={10} /></button>
          <div style={{ position: 'absolute', bottom: 3, left: 4, color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
            <GripVertical size={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Upload zone with URL fallback ──
function MediaUploader({ items, onChange }: { items: MediaItem[]; onChange: (items: MediaItem[]) => void }) {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);

    // Show local previews immediately
    const previews: MediaItem[] = files.map(f => ({
      type: f.type.startsWith('video') ? 'video' : 'image',
      url: '',
      localPreview: URL.createObjectURL(f),
    }));
    onChange([...items, ...previews]);

    // Upload to server
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const { urls } = await res.json();
      // Replace preview items with real URLs
      onChange(prev => {
        const kept = prev.filter(m => !previews.find(p => p.localPreview === m.localPreview));
        const uploaded: MediaItem[] = urls.map((url: string, i: number) => ({
          type: previews[i]?.type || 'image',
          url,
          localPreview: previews[i]?.localPreview,
        }));
        return [...kept, ...uploaded];
      });
    } catch {
      // On failure, keep previews with empty url — user can fix via URL
      console.error('Upload failed');
    }
    setUploading(false);
  }, [items, onChange]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(u);
    onChange([...items, { type: isVideo ? 'video' : 'image', url: u }]);
    setUrlInput('');
  };

  return (
    <div>
      <label className="admin-label">Media (cover image + gallery)</label>

      {/* Drop zone */}
      <div
        className={`media-upload-zone${drag ? ' drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{ cursor: 'none' }}
      >
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={onFileChange} />
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Uploading…
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-faint)' }}>
            <Upload size={22} style={{ marginBottom: '0.5rem', color: 'var(--primary)' }} />
            <div>Drop images or videos here, or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span></div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Multiple files supported · Drag to reorder after upload</div>
          </div>
        )}
      </div>

      {/* Previews */}
      <MediaGrid items={items} onChange={onChange} />
      {items.length > 1 && (
        <p className="media-reorder-hint" style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          Drag thumbnails to reorder · First item = cover image
        </p>
      )}

      {/* URL fallback */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <input
          className="admin-input"
          style={{ marginBottom: 0, flex: 1 }}
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder="Or paste an image/video URL"
          onKeyDown={e => e.key === 'Enter' && addUrl()}
        />
        <button className="admin-btn-ghost" onClick={addUrl} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <LinkIcon size={13} /> Add URL
        </button>
      </div>
    </div>
  );
}

// ── Main Panel ──
export default function PortfolioPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [editMedia, setEditMedia] = useState<MediaItem[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState<any>({ title: '', category: 'web', tags: '', year: String(new Date().getFullYear()), problem: '', solution: '', stack: '', client: '', deliverables: '', featured: false, visible: true });
  const [newMedia, setNewMedia] = useState<MediaItem[]>([]);

  const load = () => fetch('/api/portfolio/all').then(r => r.json()).then(d => { setProjects(Array.isArray(d) ? d : []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const mediaToPayload = (media: MediaItem[], fallbackTitle: string) => {
    const cover = media[0]?.url || '';
    const gallery = media.slice(1).filter(m => m.url).map(m => ({ type: m.type, url: m.url, caption: m.caption || '' }));
    return { image: cover, gallery };
  };

  const saveEdit = async (id: string) => {
    setSaving(id);
    const mediaPayload = mediaToPayload(editMedia, editData.title);
    const payload = {
      ...editData,
      ...mediaPayload,
      tags: typeof editData.tags === 'string' ? editData.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : editData.tags,
      stack: typeof editData.stack === 'string' ? editData.stack.split(',').map((s: string) => s.trim()).filter(Boolean) : editData.stack,
      deliverables: typeof editData.deliverables === 'string' ? editData.deliverables.split(',').map((s: string) => s.trim()).filter(Boolean) : editData.deliverables,
    };
    await fetch(`/api/portfolio/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(null); setEditId(null); load();
  };

  const create = async () => {
    if (!newData.title) return;
    setSaving('new');
    const mediaPayload = mediaToPayload(newMedia, newData.title);
    const payload = {
      ...newData,
      ...mediaPayload,
      tags: newData.tags.split(',').map((s: string) => s.trim()).filter(Boolean),
      stack: newData.stack.split(',').map((s: string) => s.trim()).filter(Boolean),
      deliverables: newData.deliverables.split(',').map((s: string) => s.trim()).filter(Boolean),
      order: projects.length + 1,
    };
    await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(null); setShowNew(false);
    setNewData({ title: '', category: 'web', tags: '', year: String(new Date().getFullYear()), problem: '', solution: '', stack: '', client: '', deliverables: '', featured: false, visible: true });
    setNewMedia([]);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    load();
  };

  const quickUpdate = async (id: string, patch: any) => {
    await fetch(`/api/portfolio/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    load();
  };

  const startEdit = (p: any) => {
    setEditId(p._id);
    setEditData({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '', stack: Array.isArray(p.stack) ? p.stack.join(', ') : p.stack || '', deliverables: Array.isArray(p.deliverables) ? p.deliverables.join(', ') : p.deliverables || '' });
    // Reconstruct media list: cover first, then gallery
    const media: MediaItem[] = [];
    if (p.image) media.push({ type: 'image', url: p.image });
    if (p.gallery?.length) media.push(...p.gallery.map((g: any) => ({ type: g.type || 'image', url: g.url, caption: g.caption })));
    setEditMedia(media);
  };

  const F = ({ d, setD }: { d: any; setD: (fn: any) => void }) => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div><label className="admin-label">Title *</label><input className="admin-input" value={d.title || ''} onChange={e => setD((p: any) => ({ ...p, title: e.target.value }))} placeholder="Project name" /></div>
        <div>
          <label className="admin-label">Category</label>
          <select className="admin-select" value={d.category || 'web'} onChange={e => setD((p: any) => ({ ...p, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="admin-label">Year</label><input className="admin-input" value={d.year || ''} onChange={e => setD((p: any) => ({ ...p, year: e.target.value }))} placeholder="2025" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label className="admin-label">Tags (comma-separated)</label><input className="admin-input" value={d.tags || ''} onChange={e => setD((p: any) => ({ ...p, tags: e.target.value }))} placeholder="Web, Fintech" /></div>
        <div><label className="admin-label">Client</label><input className="admin-input" value={d.client || ''} onChange={e => setD((p: any) => ({ ...p, client: e.target.value }))} placeholder="Acme Corp" /></div>
      </div>
      <label className="admin-label">Deliverables (comma-separated)</label>
      <input className="admin-input" value={d.deliverables || ''} onChange={e => setD((p: any) => ({ ...p, deliverables: e.target.value }))} placeholder="Design, Development, Strategy" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label className="admin-label">The Challenge</label><textarea className="admin-textarea" style={{ minHeight: 80 }} value={d.problem || ''} onChange={e => setD((p: any) => ({ ...p, problem: e.target.value }))} /></div>
        <div><label className="admin-label">Our Solution</label><textarea className="admin-textarea" style={{ minHeight: 80 }} value={d.solution || ''} onChange={e => setD((p: any) => ({ ...p, solution: e.target.value }))} /></div>
      </div>
      <label className="admin-label">Tech Stack (comma-separated)</label>
      <input className="admin-input" value={d.stack || ''} onChange={e => setD((p: any) => ({ ...p, stack: e.target.value }))} placeholder="React, Node.js, MongoDB" />
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <input type="checkbox" checked={!!d.featured} onChange={e => setD((p: any) => ({ ...p, featured: e.target.checked }))} /> Featured on homepage
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <input type="checkbox" checked={d.visible !== false} onChange={e => setD((p: any) => ({ ...p, visible: e.target.checked }))} /> Visible
        </label>
      </div>
    </>
  );

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>Portfolio</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>{projects.length} projects · Upload images & videos directly or paste URLs</p>
        </div>
        <button className="admin-btn-save" onClick={() => setShowNew(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={15} /> Add Project
        </button>
      </div>

      {showNew && (
        <div className="admin-card" style={{ borderColor: 'var(--primary)' }}>
          <p className="admin-card-title">New Project</p>
          <F d={newData} setD={setNewData} />
          <div style={{ marginTop: '1.25rem' }}>
            <MediaUploader items={newMedia} onChange={setNewMedia} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="admin-btn-save" onClick={create} disabled={saving === 'new'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saving === 'new' ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />} Create
            </button>
            <button className="admin-btn-ghost" onClick={() => { setShowNew(false); setNewMedia([]); }}>Cancel</button>
          </div>
        </div>
      )}

      {projects.map(p => (
        <div key={p._id} className="admin-card">
          {editId === p._id ? (
            <>
              <p className="admin-card-title">Editing: {p.title}</p>
              <F d={editData} setD={setEditData} />
              <div style={{ marginTop: '1.25rem' }}>
                <MediaUploader items={editMedia} onChange={setEditMedia} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button className="admin-btn-save" onClick={() => saveEdit(p._id)} disabled={saving === p._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {saving === p._id ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />} Save
                </button>
                <button className="admin-btn-ghost" onClick={() => { setEditId(null); setEditMedia([]); }}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              {p.image && <img src={p.image} alt={p.title} style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>{p.title}</span>
                  <span className="admin-badge admin-badge-blue">{p.category}</span>
                  {p.featured && <span className="admin-badge admin-badge-green">Featured</span>}
                  {!p.visible && <span className="admin-badge admin-badge-red">Hidden</span>}
                  {p.gallery?.length > 0 && <span className="admin-badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-faint)' }}>{p.gallery.length + 1} media</span>}
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-faint)' }}>{p.year}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-faint)' }}>{p.tags?.join(' · ')}{p.client ? ` · ${p.client}` : ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="admin-btn-ghost" onClick={() => startEdit(p)}>Edit</button>
                <button className="admin-btn-ghost" onClick={() => quickUpdate(p._id, { featured: !p.featured })} title="Toggle featured"><Star size={14} /></button>
                <button className="admin-btn-ghost" onClick={() => quickUpdate(p._id, { visible: !p.visible })} title="Toggle visibility">{p.visible ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button className="admin-btn-danger" onClick={() => del(p._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          )}
        </div>
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
