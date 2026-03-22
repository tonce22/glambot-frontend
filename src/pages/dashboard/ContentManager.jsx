import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { useToast } from '../../hooks/useToast'
import styles from './ContentManager.module.css'

export default function ContentManager() {
  const { isAdmin } = useAuth()
  const toast = useToast()
  const [content, setContent] = useState({})
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('about')
  const logoRef = useRef()
  const galleryRef = useRef()
  const aboutMediaRef = useRef()

  useEffect(() => {
    Promise.all([api.get('/content'), api.get('/gallery')])
      .then(([c, g]) => { setContent(c.data); setGallery(g.data) })
      .finally(() => setLoading(false))
  }, [])

  const set = (key, val) => setContent(prev => ({ ...prev, [key]: val }))

  const saveAll = async () => {
    setSaving(true)
    try {
      await api.put('/content/bulk', content)
      toast('Content saved successfully!', 'ok')
    } catch {
      toast('Failed to save', 'err')
    } finally {
      setSaving(false)
    }
  }

  const uploadFile = async (file, onSuccess) => {
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      onSuccess(r.data.url)
      toast('Uploaded successfully!', 'ok')
    } catch {
      toast('Upload failed', 'err')
    }
  }

  const addGalleryItem = async (url, title, mediaType) => {
    try {
      const r = await api.post('/gallery', { url, title, media_type: mediaType, sort_order: gallery.length })
      setGallery(prev => [...prev, r.data])
      toast('Added to gallery!', 'ok')
    } catch {
      toast('Failed to add', 'err')
    }
  }

  const deleteGalleryItem = async (id) => {
    try {
      await api.delete(`/gallery/${id}`)
      setGallery(prev => prev.filter(g => g.id !== id))
      toast('Removed from gallery', 'err')
    } catch {
      toast('Failed to remove', 'err')
    }
  }

  if (!isAdmin) return (
    <div style={{ textAlign:'center', padding:'80px 40px', color:'var(--muted)' }}>
      <div style={{ fontSize:48, marginBottom:16, opacity:.3 }}>🔒</div>
      <p>Access restricted to Admins only.</p>
    </div>
  )

  if (loading) return <div style={{ padding:48, textAlign:'center', color:'var(--muted)' }}>Loading…</div>

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Content <em>Manager</em></h1>
          <p className={styles.sub}>Edit website content without touching code</p>
        </div>
        <button className={styles.saveBtn} onClick={saveAll} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save All Changes'}
        </button>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        {[
          { id:'logo',    label:'🖼 Logo' },
          { id:'about',   label:'📝 About' },
          { id:'services',label:'⚙️ Services' },
          { id:'gallery', label:'🎬 Gallery' },
          { id:'contact', label:'📞 Contact' },
        ].map(t => (
          <button key={t.id} className={`${styles.tab} ${tab===t.id ? styles.tabOn:''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LOGO TAB ── */}
      {tab === 'logo' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Logo & Branding</div>
          <div className={styles.card}>
            <div className={styles.logoPreview}>
              {content.logo_url ? (
                <img src={content.logo_url} alt="Logo" style={{ maxHeight:80, maxWidth:300, objectFit:'contain' }}/>
              ) : (
                <div className={styles.logoPlaceholder}>
                  <div style={{ fontSize:40, opacity:.3 }}>🖼</div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginTop:8 }}>logo.png will appear here</div>
                </div>
              )}
            </div>
            <div className={styles.uploadArea}>
              <input type="file" ref={logoRef} accept="image/*" style={{ display:'none' }}
                onChange={e => { const f=e.target.files[0]; if(f) uploadFile(f, url => set('logo_url', url)) }}/>
              <button className={styles.uploadBtn} onClick={() => logoRef.current.click()}>
                📁 Upload Logo (PNG, SVG recommended)
              </button>
              {content.logo_url && (
                <button className={styles.removeBtn} onClick={() => set('logo_url', '')}>✕ Remove Logo</button>
              )}
            </div>
            <div className={styles.hint}>Recommended: PNG or SVG with transparent background, max 400×100px</div>
          </div>
        </div>
      )}

      {/* ── ABOUT TAB ── */}
      {tab === 'about' && (
        <div className={styles.section}>

          {/* ABOUT MEDIA */}
          <div className={styles.sectionTitle}>About Section — Left Side Media</div>
          <div className={styles.card} style={{ marginBottom:20 }}>
            <div className={styles.cardLabel}>Upload Video or Image (shown on the left side of About section)</div>

            {/* Preview */}
            <div className={styles.aboutMediaPreview}>
              {content.about_youtube_id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${content.about_youtube_id}`}
                  title="About video" frameBorder="0" allowFullScreen
                  style={{ width:'100%', height:'100%', minHeight:200 }}
                />
              ) : content.about_media_url && content.about_media_type === 'video' ? (
                <video src={content.about_media_url} controls style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : content.about_media_url && content.about_media_type === 'image' ? (
                <img src={content.about_media_url} alt="About" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--muted)' }}>
                  <div style={{ fontSize:48, opacity:.3 }}>🎬</div>
                  <div style={{ fontSize:13, marginTop:8 }}>No media uploaded yet</div>
                </div>
              )}
            </div>

            {/* Upload options */}
            <div className={styles.galUploadRow} style={{ marginTop:16 }}>
              <div className={styles.galUploadBox}>
                <input type="file" ref={aboutMediaRef} accept="image/*,video/*" style={{ display:'none' }}
                  onChange={async e => {
                    const f = e.target.files[0]; if(!f) return
                    const isVideo = f.type.startsWith('video/')
                    await uploadFile(f, url => {
                      set('about_media_url', url)
                      set('about_media_type', isVideo ? 'video' : 'image')
                      set('about_youtube_id', '')
                    })
                    e.target.value = ''
                  }}/>
                <button className={styles.uploadBtn} onClick={() => aboutMediaRef.current.click()}>
                  📁 Upload Image or Video
                </button>
              </div>
              <div className={styles.galDivider}>or</div>
              <div className={styles.galUrlBox}>
                <input type="text" placeholder="Paste YouTube video ID (e.g. 9PtZSgiDSso)"
                  id="about-yt-input"
                  defaultValue={content.about_youtube_id || ''}
                  style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'10px 14px', color:'var(--white)', fontSize:13, width:'100%', outline:'none' }}/>
                <button className={styles.uploadBtn} onClick={() => {
                  const val = document.getElementById('about-yt-input').value.trim()
                  if(!val) return
                  set('about_youtube_id', val)
                  set('about_media_url', '')
                  set('about_media_type', '')
                  toast('YouTube video set! Click Save All Changes.', 'ok')
                }}>+ Set YouTube Video</button>
              </div>
            </div>

            {/* Remove button */}
            {(content.about_media_url || content.about_youtube_id) && (
              <button className={styles.removeBtn} style={{ marginTop:12 }} onClick={() => {
                set('about_media_url', '')
                set('about_media_type', '')
                set('about_youtube_id', '')
                toast('Media removed. Click Save All Changes.', 'ok')
              }}>✕ Remove Media (show emoji placeholder)</button>
            )}
          </div>

          {/* ABOUT TEXT */}
          <div className={styles.sectionTitle}>About Section — Text</div>
          <div className={styles.card}>
            <div className={styles.field}>
              <label>Paragraph 1</label>
              <textarea value={content.about_p1||''} onChange={e => set('about_p1', e.target.value)} rows={4}/>
            </div>
            <div className={styles.field}>
              <label>Paragraph 2</label>
              <textarea value={content.about_p2||''} onChange={e => set('about_p2', e.target.value)} rows={4}/>
            </div>
            <div className={styles.sectionTitle} style={{ marginTop:24 }}>Stats</div>
            <div className={styles.statsGrid}>
              <div className={styles.field}>
                <label>Events Stat (e.g. 120+)</label>
                <input value={content.about_stat_events||''} onChange={e => set('about_stat_events', e.target.value)}/>
              </div>
              <div className={styles.field}>
                <label>Slow Motion Stat (e.g. 240fps)</label>
                <input value={content.about_stat_slowmo||''} onChange={e => set('about_stat_slowmo', e.target.value)}/>
              </div>
              <div className={styles.field}>
                <label>Resolution Stat (e.g. 4K)</label>
                <input value={content.about_stat_res||''} onChange={e => set('about_stat_res', e.target.value)}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ── */}
      {tab === 'services' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Services</div>
          {[1,2,3].map(n => (
            <div key={n} className={styles.card} style={{ marginBottom:16 }}>
              <div className={styles.cardLabel}>Service {n} {['💍','🎉','🎞️'][n-1]}</div>
              <div className={styles.field}>
                <label>Name</label>
                <input value={content[`srv${n}_name`]||''} onChange={e => set(`srv${n}_name`, e.target.value)}/>
              </div>
              <div className={styles.field}>
                <label>Description</label>
                <textarea value={content[`srv${n}_desc`]||''} onChange={e => set(`srv${n}_desc`, e.target.value)} rows={3}/>
              </div>
              <div className={styles.field}>
                <label>Price / Button Text</label>
                <input value={content[`srv${n}_price`]||''} onChange={e => set(`srv${n}_price`, e.target.value)} placeholder="e.g. From ₾500 →"/>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GALLERY TAB ── */}
      {tab === 'gallery' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Gallery</div>
          <div className={styles.card} style={{ marginBottom:20 }}>
            <div className={styles.cardLabel}>Add to Gallery</div>
            <div className={styles.galUploadRow}>
              <div className={styles.galUploadBox}>
                <input type="file" ref={galleryRef} accept="image/*,video/*" style={{ display:'none' }}
                  onChange={async e => {
                    const f = e.target.files[0]; if(!f) return
                    const isVideo = f.type.startsWith('video/')
                    const title = prompt('Enter a title for this item (optional):') || ''
                    await uploadFile(f, async url => {
                      await addGalleryItem(url, title, isVideo ? 'video' : 'image')
                    })
                    e.target.value = ''
                  }}/>
                <button className={styles.uploadBtn} onClick={() => galleryRef.current.click()}>
                  📁 Upload Image or Video
                </button>
              </div>
              <div className={styles.galDivider}>or</div>
              <div className={styles.galUrlBox}>
                <input type="text" placeholder="Paste YouTube video ID (e.g. 9PtZSgiDSso)" id="yt-input"
                  style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'10px 14px', color:'var(--white)', fontSize:13, width:'100%', outline:'none' }}/>
                <button className={styles.uploadBtn} onClick={() => {
                  const val = document.getElementById('yt-input').value.trim()
                  if(!val) return
                  const title = prompt('Enter a title (optional):') || ''
                  addGalleryItem(`https://www.youtube.com/embed/${val}`, title, 'youtube')
                  document.getElementById('yt-input').value = ''
                }}>+ Add YouTube Video</button>
              </div>
            </div>
          </div>
          {gallery.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px', color:'var(--muted)' }}>No gallery items yet.</div>
          ) : (
            <div className={styles.galGrid}>
              {gallery.map(item => (
                <div key={item.id} className={styles.galItem}>
                  {item.media_type === 'youtube' ? (
                    <iframe src={item.url} title={item.title||'video'} frameBorder="0" allowFullScreen style={{ width:'100%', height:'100%', minHeight:140 }}/>
                  ) : item.media_type === 'video' ? (
                    <video src={item.url} style={{ width:'100%', height:'100%', objectFit:'cover' }} controls/>
                  ) : (
                    <img src={item.url} alt={item.title||''} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  )}
                  <div className={styles.galItemOverlay}>
                    <div className={styles.galItemTitle}>{item.title||'Untitled'}</div>
                    <button className={styles.galDeleteBtn} onClick={() => deleteGalleryItem(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === 'contact' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Contact Information</div>
          <div className={styles.card}>
            <div className={styles.field}>
              <label>Phone Number</label>
              <input value={content.contact_phone||''} onChange={e => set('contact_phone', e.target.value)} placeholder="+995 557 07 20 00"/>
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" value={content.contact_email||''} onChange={e => set('contact_email', e.target.value)} placeholder="your@email.com"/>
            </div>
            <div className={styles.field}>
              <label>Address</label>
              <input value={content.contact_address||''} onChange={e => set('contact_address', e.target.value)} placeholder="City, Street, Country"/>
            </div>
          </div>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={styles.saveBtn} onClick={saveAll} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  )
}
