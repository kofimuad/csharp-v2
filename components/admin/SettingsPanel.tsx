'use client';
import { useState, useEffect, useRef } from 'react';
import { Save, Loader, Plus, Trash2, Image as ImageIcon, Video, Upload } from 'lucide-react';

export default function SettingsPanel() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heroMode, setHeroMode] = useState<'image' | 'video'>('image');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setData(d || {});
      setHeroMode(d?.heroVideoUrl ? 'video' : 'image');
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const f = (key: string) => ({
    value: data[key] || '',
    onChange: (e: any) => setData((d: any) => ({ ...d, [key]: e.target.value })),
  });

  const updatePartner = (idx: number, field: string, val: string) =>
    setData((d: any) => ({ ...d, partnerLogos: d.partnerLogos.map((p: any, i: number) => i === idx ? { ...p, [field]: val } : p) }));

  const removePartner = (idx: number) =>
    setData((d: any) => ({ ...d, partnerLogos: d.partnerLogos.filter((_: any, i: number) => i !== idx) }));

  const addPartner = () =>
    setData((d: any) => ({ ...d, partnerLogos: [...(d.partnerLogos || []), { name: '', imageUrl: '', website: '' }] }));

  const loadTechStackPreset = () => {
    const tech = (name: string, iconSlug: string, website: string) => ({
      name,
      imageUrl: `https://cdn.simpleicons.org/${iconSlug}`,
      website,
    });
    const techUrl = (name: string, imageUrl: string, website: string) => ({
      name,
      imageUrl,
      website,
    });

    const preset = [
      tech('Next.js', 'nextdotjs', 'https://nextjs.org'),
      tech('React', 'react', 'https://react.dev'),
      tech('TypeScript', 'typescript', 'https://www.typescriptlang.org'),
      tech('JavaScript', 'javascript', 'https://developer.mozilla.org/docs/Web/JavaScript'),
      tech('Tailwind CSS', 'tailwindcss', 'https://tailwindcss.com'),
      tech('Sass', 'sass', 'https://sass-lang.com'),
      tech('Framer Motion', 'framer', 'https://www.framer.com/motion'),
      tech('GSAP', 'greensock', 'https://gsap.com'),
      tech('Three.js', 'threedotjs', 'https://threejs.org'),
      tech('Node.js', 'nodedotjs', 'https://nodejs.org'),
      tech('Express', 'express', 'https://expressjs.com'),
      tech('NestJS', 'nestjs', 'https://nestjs.com'),
      tech('Python', 'python', 'https://python.org'),
      tech('FastAPI', 'fastapi', 'https://fastapi.tiangolo.com'),
      tech('GraphQL', 'graphql', 'https://graphql.org'),
      tech('tRPC', 'trpc', 'https://trpc.io'),
      tech('PostgreSQL', 'postgresql', 'https://postgresql.org'),
      tech('MySQL', 'mysql', 'https://mysql.com'),
      tech('MongoDB', 'mongodb', 'https://mongodb.com'),
      tech('Redis', 'redis', 'https://redis.io'),
      tech('Prisma', 'prisma', 'https://prisma.io'),
      tech('Mongoose', 'mongoose', 'https://mongoosejs.com'),
      tech('Docker', 'docker', 'https://docker.com'),
      tech('Kubernetes', 'kubernetes', 'https://kubernetes.io'),
      tech('Nginx', 'nginx', 'https://nginx.org'),
      tech('Vercel', 'vercel', 'https://vercel.com'),
      tech('Netlify', 'netlify', 'https://netlify.com'),
      techUrl('AWS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', 'https://aws.amazon.com'),
      tech('Cloudflare', 'cloudflare', 'https://cloudflare.com'),
      tech('GitHub', 'github', 'https://github.com'),
      tech('GitHub Actions', 'githubactions', 'https://docs.github.com/actions'),
      tech('Jest', 'jest', 'https://jestjs.io'),
      tech('Cypress', 'cypress', 'https://cypress.io'),
      tech('Playwright', 'playwright', 'https://playwright.dev'),
      tech('Storybook', 'storybook', 'https://storybook.js.org'),
      tech('Webpack', 'webpack', 'https://webpack.js.org'),
      tech('Vite', 'vite', 'https://vitejs.dev'),
      tech('Turborepo', 'turborepo', 'https://turbo.build/repo'),
      tech('Figma', 'figma', 'https://figma.com'),
      techUrl('Adobe XD', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg', 'https://adobe.com/products/xd.html'),
      techUrl('Illustrator', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg', 'https://adobe.com/products/illustrator.html'),
      techUrl('Photoshop', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg', 'https://adobe.com/products/photoshop.html'),
      techUrl('After Effects', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg', 'https://adobe.com/products/aftereffects.html'),
      techUrl('Premiere Pro', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg', 'https://adobe.com/products/premiere.html'),
      tech('Blender', 'blender', 'https://blender.org'),
      tech('Spline', 'spline', 'https://spline.design'),
      tech('Webflow', 'webflow', 'https://webflow.com'),
      tech('Notion', 'notion', 'https://notion.so'),
    ];

    setData((d: any) => ({ ...d, partnerLogos: preset }));
  };

  if (loading) return <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)', padding: '2rem' }}>Loading…</div>;

  const partners: any[] = data.partnerLogos || [];

  return (
    <div>
      <style>{`
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .partner-grid { display: grid; grid-template-columns: 80px 1fr 1fr auto; gap: 0.75rem; align-items: center; }
        .marquee-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; gap: 0.75rem; }
        .marquee-actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
        @media (max-width: 1024px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
          .partner-grid { grid-template-columns: 80px 1fr auto; }
        }
        @media (max-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr; }
          .marquee-head { flex-direction: column; align-items: stretch; }
          .marquee-actions { width: 100%; justify-content: stretch; }
          .marquee-actions > button { flex: 1 1 0; min-width: 0; justify-content: center; }
          .partner-grid { grid-template-columns: 1fr; }
          .partner-grid > div:nth-child(2) { grid-column: 1; order: 1; }
          .partner-grid > div:nth-child(3) { grid-column: 1; order: 3; display: none; }
          .partner-grid > button { grid-column: 1; order: 4; }
          .partner-grid > div:nth-child(1) { grid-column: 1; order: 2; margin-bottom: 0.5rem; }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', fontWeight: 800 }}>Site Settings</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-faint)', fontSize: '0.88rem', marginTop: '0.25rem' }}>Control global site content, logo, hero, contact info and your technology stack marquee.</p>
        </div>
        <button className="admin-btn-save" onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '44px' }}>
          {saving ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      {/* Logo */}
      <div className="admin-card">
        <p className="admin-card-title">Logo</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-faint)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Upload your logo to an image host (e.g. <a href="https://imgur.com" target="_blank" rel="noopener" style={{ color: 'var(--primary)' }}>imgur.com</a>, Cloudinary, etc.) and paste the URL below. Leave blank to use the text logo.
        </p>
        <div className="form-grid-2">
          <div>
            <label className="admin-label">Logo Image URL (optional)</label>
            <input className="admin-input" {...f('logoUrl')} placeholder="https://i.imgur.com/yourlogo.png" />
            {data.logoUrl && (
              <div style={{ marginTop: '-0.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface-high)', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'inline-flex' }}>
                <img src={data.logoUrl} alt="Logo preview" style={{ height: 40, width: 'auto', objectFit: 'contain', maxWidth: 200 }} />
              </div>
            )}
          </div>
          <div>
            <label className="admin-label">Text Logo Fallback</label>
            <input className="admin-input" {...f('logoText')} placeholder="C#" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '-0.5rem' }}>Used when no image URL is set</p>
          </div>
        </div>
      </div>

      {/* Brand & Hero */}
      <div className="admin-card">
        <p className="admin-card-title">Brand & Hero</p>
        <div className="form-grid-2">
          <div><label className="admin-label">Agency Name</label><input className="admin-input" {...f('agencyName')} placeholder="C Sharp" /></div>
          <div><label className="admin-label">Tagline</label><input className="admin-input" {...f('tagline')} placeholder="The Digital Auteur" /></div>
        </div>
        <label className="admin-label">Hero Title</label>
        <input className="admin-input" {...f('heroTitle')} placeholder="We build digital things." />
        <label className="admin-label">Hero Services (comma-separated)</label>
        <input className="admin-input"
          value={(data.heroServices || []).join(', ')}
          onChange={e => setData((d: any) => ({ ...d, heroServices: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }))}
          placeholder="Web, Mobile, Design, Strategy"
        />

        {/* Hero background: image or video toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={heroMode === 'image' ? 'admin-btn-save' : 'admin-btn-ghost'}
            onClick={() => setHeroMode('image')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', minHeight: '44px', cursor: 'pointer' }}
          >
            <ImageIcon size={14} /> Image background
          </button>
          <button
            className={heroMode === 'video' ? 'admin-btn-save' : 'admin-btn-ghost'}
            onClick={() => setHeroMode('video')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', minHeight: '44px', cursor: 'pointer' }}
          >
            <Video size={14} /> Video background
          </button>
        </div>

        {heroMode === 'image' ? (
          <>
            <label className="admin-label">Hero Background Image</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <input className="admin-input" style={{ marginBottom: '0.5rem' }} {...f('heroBackgroundImage')} placeholder="https://images.unsplash.com/... (paste URL)" />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--surface-high)', border: '1.5px solid var(--border-strong)', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', transition: 'border-color 0.2s', minHeight: '44px' }}
                >
                  <Upload size={14} />
                  Upload image from device
                </button>
                <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append('files', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: form });
                    const { urls } = await res.json();
                    if (urls?.[0]) setData((d: any) => ({ ...d, heroBackgroundImage: urls[0] }));
                    e.target.value = '';
                }} />
              </div>
            </div>
            {data.heroBackgroundImage && (
              <img src={data.heroBackgroundImage} alt="Hero preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '0.75rem', border: '1px solid var(--border)', marginBottom: '1rem' }} />
            )}
          </>
        ) : (
          <>
            <label className="admin-label">Hero Background Video</label>
            <input className="admin-input" style={{ marginBottom: '0.5rem' }} {...f('heroVideoUrl')} placeholder="Paste a direct .mp4 URL (e.g. from Cloudinary or your server)" />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--surface-high)', border: '1.5px solid var(--border-strong)', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', minHeight: '44px' }}
            >
              <Upload size={14} />
              Upload video from device
            </button>
            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={async e => {
                const file = e.target.files?.[0];
                console.log('Video file selected:', file?.name, file?.size, file?.type);
                if (!file) return;
                const form = new FormData();
                form.append('files', file);
                setData((d: any) => ({ ...d, heroVideoUrl: 'Uploading…' }));
                try {
                  console.log('Starting video upload...');
                  const res = await fetch('/api/upload', { method: 'POST', body: form });
                  console.log('Upload response status:', res.status, res.ok);
                  if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Upload error response:', errorText);
                    throw new Error(`Upload failed with status ${res.status}: ${errorText}`);
                  }
                  const json = await res.json();
                  console.log('Upload response:', json);
                  if (json.urls?.[0]) {
                    console.log('Video URL set:', json.urls[0]);
                    setData((d: any) => ({ ...d, heroVideoUrl: json.urls[0] }));
                  } else {
                    throw new Error('No URL returned from upload: ' + JSON.stringify(json));
                  }
                } catch (err) {
                  console.error('Video upload error:', err);
                  setData((d: any) => ({ ...d, heroVideoUrl: '' }));
                  alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
                e.target.value = '';
            }} />
            {data.heroVideoUrl && data.heroVideoUrl !== 'Uploading…' && (
              <video src={data.heroVideoUrl} controls muted style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '0.75rem', border: '1px solid var(--border)', marginBottom: '1rem', background: '#000' }} />
            )}
            {data.heroVideoUrl === 'Uploading…' && (
              <div style={{ padding: '1rem', background: 'var(--surface-high)', borderRadius: '0.75rem', border: '1px solid var(--border)', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Uploading video…
              </div>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-faint)', marginBottom: '1rem' }}>
              YouTube links are not supported — use a direct .mp4 file URL or upload from device.
            </p>
          </>
        )}

        <label className="admin-label">Meta Description</label>
        <textarea className="admin-textarea" {...f('metaDescription')} placeholder="C Sharp is a premium tech agency…" style={{ minHeight: 70 }} />
      </div>

      {/* Technology Stack Marquee */}
      <div className="admin-card">
        <div className="marquee-head">
          <div style={{ minWidth: 0 }}>
            <p className="admin-card-title" style={{ marginBottom: '0.25rem' }}>Technology Stack Marquee</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-faint)' }}>These appear in the "Technologies we use" marquee on the homepage. Add names only, or include logo URLs for visual marks.</p>
          </div>
          <div className="marquee-actions">
            <button className="admin-btn-ghost" onClick={loadTechStackPreset} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              Load modern stack
            </button>
            <button className="admin-btn-save" onClick={addPartner} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              <Plus size={14} /> Add Item
            </button>
          </div>
        </div>

        {partners.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-faint)', padding: '1.5rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '0.75rem' }}>
            No technology items yet. Click "Load modern stack" or "Add Item" to get started.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {partners.map((p: any, i: number) => (
            <div key={i} className="partner-grid" style={{ padding: '0.75rem', background: 'var(--surface-high)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
              {/* Preview */}
              <div style={{ width: 80, height: 40, background: 'var(--surface)', borderRadius: '0.4rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px', flexShrink: 0 }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-faint)' }}>No image</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  value={p.name || ''}
                  onChange={e => updatePartner(i, 'name', e.target.value)}
                  placeholder="Technology or tool name"
                />
                <input
                  className="admin-input"
                  style={{ marginBottom: 0 }}
                  value={p.website || ''}
                  onChange={e => updatePartner(i, 'website', e.target.value)}
                  placeholder="https://tool-website.com (optional link)"
                />
              </div>
              <input
                className="admin-input"
                style={{ marginBottom: 0, display: 'none' }}
                value={p.imageUrl || ''}
                onChange={e => updatePartner(i, 'imageUrl', e.target.value)}
                placeholder="https://... logo image URL (optional SVG/PNG)"
              />
              <button className="admin-btn-danger" onClick={() => removePartner(i)} style={{ padding: '0.5rem', flexShrink: 0, minHeight: '44px' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="admin-card">
        <p className="admin-card-title">Contact Info</p>
        <div className="form-grid-2">
          <div><label className="admin-label">Address</label><input className="admin-input" {...f('address')} placeholder="25 Independence Ave, Accra, Ghana" /></div>
          <div><label className="admin-label">Phone</label><input className="admin-input" {...f('phone')} placeholder="+233 30 000 0000" /></div>
          <div><label className="admin-label">Email</label><input className="admin-input" {...f('email')} placeholder="hello@csharp.agency" /></div>
          <div><label className="admin-label">Business Hours</label><input className="admin-input" {...f('hours')} placeholder="Mon–Fri, 8AM–6PM GMT" /></div>
        </div>
        <label className="admin-label">Calendly URL</label>
        <input className="admin-input" {...f('calendlyUrl')} placeholder="https://calendly.com/..." />
        <label className="admin-label">Footer Tagline</label>
        <textarea className="admin-textarea" {...f('footerTagline')} placeholder="We build digital things…" style={{ minHeight: 70 }} />
      </div>

      {/* Social Links */}
      <div className="admin-card">
        <p className="admin-card-title">Social Links</p>
        <div className="form-grid-2">
          <div><label className="admin-label">LinkedIn URL</label><input className="admin-input" {...f('linkedinUrl')} placeholder="https://linkedin.com/company/..." /></div>
          <div><label className="admin-label">Twitter / X URL</label><input className="admin-input" {...f('twitterUrl')} placeholder="https://twitter.com/..." /></div>
          <div><label className="admin-label">Instagram URL</label><input className="admin-input" {...f('instagramUrl')} placeholder="https://instagram.com/..." /></div>
          <div><label className="admin-label">Dribbble URL</label><input className="admin-input" {...f('dribbbleUrl')} placeholder="https://dribbble.com/..." /></div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
