'use client';

import { useState } from 'react';
import { ArrowUpRight, Eye, LogOut, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';
import type { Content, Item } from '@/lib/content';

const blankItem = (): Item => ({
  id: crypto.randomUUID(),
  kind: 'Produk',
  title: '',
  description: '',
  url: '',
  image: '',
  price: '',
  button: 'Lihat selengkapnya',
  published: true,
});

export default function Manager({ initial, initialRevision }: { initial: Content; initialRevision: number }) {
  const [content, setContent] = useState(initial);
  const [revision, setRevision] = useState(initialRevision);
  const [editing, setEditing] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function save(next: Content) {
    setBusy(true); setMessage(''); setError('');
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: next, revision }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Perubahan belum tersimpan.');
      setContent(result.content); setRevision(result.revision);
      setMessage('Tersimpan. Perubahan sudah tampil pada profil lokal.');
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan.');
      return false;
    } finally { setBusy(false); }
  }

  async function saveItem(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const exists = content.items.some((item) => item.id === editing.id);
    const items = exists
      ? content.items.map((item) => item.id === editing.id ? editing : item)
      : [...content.items, editing];
    if (await save({ ...content, items })) setEditing(null);
  }

  const updateItem = (field: keyof Item, value: string | boolean) =>
    setEditing((item) => item ? { ...item, [field]: value } : item);

  return <div className="manager-page">
    <div className="rainbow-line" />
    <header className="manager-header">
      <a className="personal-brand" href="/"><span className="brand-initial">RS<span>.</span></span><span>Ruang pengelola<small>PROFIL & KARYA</small></span></a>
      <div className="manager-header-actions">
        <a className="quiet-button" href="/" target="_blank" rel="noopener"><Eye size={17}/> Lihat profil <ArrowUpRight size={15}/></a>
        <form action="/api/session" method="post"><input type="hidden" name="action" value="logout"/><Button variant="ghost" type="submit"><LogOut/> Keluar</Button></form>
      </div>
    </header>
    <main className="manager-main">
      <div className="manager-title"><div><p className="kicker">HALAMAN PENGELOLA</p><h1>Halo, Risal.</h1><p>Atur profil, karya, dan produk yang ingin Anda tampilkan.</p></div><span className="prototype-badge"><span/> Prototipe lokal</span></div>
      <p className="admin-notice">Perubahan disimpan di komputer ini dan belum diterbitkan ke internet.</p>
      {message && <p className="save-success" role="status">{message}</p>}
      {error && <p className="save-error" role="alert">{error}</p>}

      <section className="manager-panel">
        <div className="manager-section-title"><div><p className="kicker">01 / PROFIL</p><h2>Identitas & perkenalan</h2></div></div>
        <form onSubmit={(event) => { event.preventDefault(); void save(content); }}>
          <fieldset disabled={busy} className="form-grid">
            <label className="full-width">Nama lengkap<Input required maxLength={150} value={content.name} onChange={(e) => setContent({...content, name:e.target.value})}/></label>
            <label>Jabatan<Input required maxLength={150} value={content.role} onChange={(e) => setContent({...content, role:e.target.value})}/></label>
            <label>Instansi<Input required maxLength={150} value={content.organization} onChange={(e) => setContent({...content, organization:e.target.value})}/></label>
            <label className="full-width">Pengantar singkat<Textarea required rows={3} maxLength={500} value={content.intro} onChange={(e) => setContent({...content, intro:e.target.value})}/></label>
            <label className="full-width">Tentang saya<Textarea required rows={7} maxLength={5000} value={content.bio} onChange={(e) => setContent({...content, bio:e.target.value})}/></label>
            <label className="full-width">Tautan Instagram<Input type="url" maxLength={2000} value={content.instagram} onChange={(e) => setContent({...content, instagram:e.target.value})}/></label>
          </fieldset>
          <div className="form-actions"><Button className="action-button" type="submit" disabled={busy}><Save/> {busy?'Menyimpan…':'Simpan profil'}</Button></div>
        </form>
      </section>

      <section className="manager-panel">
        <div className="manager-section-title"><div><p className="kicker">02 / KARYA & PRODUK</p><h2>Daftar yang ditampilkan</h2><p>Masukkan tautan marketplace, kelas, buku, artikel, atau karya Anda.</p></div><Button className="action-button" onClick={() => setEditing(blankItem())} disabled={busy || !!editing}><Plus/> Tambah baru</Button></div>
        {editing && <form className="edit-card" onSubmit={saveItem}>
          <div className="form-heading"><h3>{content.items.some((item)=>item.id===editing.id)?'Edit karya / produk':'Karya / produk baru'}</h3><Button type="button" variant="ghost" size="icon" aria-label="Tutup formulir" onClick={()=>setEditing(null)}><X/></Button></div>
          <fieldset disabled={busy} className="form-grid">
            <label>Judul<Input required maxLength={150} value={editing.title} onChange={(e)=>updateItem('title',e.target.value)} placeholder="Contoh: E-book Persiapan Ujian"/></label>
            <label>Kategori<NativeSelect value={editing.kind} onChange={(e)=>updateItem('kind',e.target.value)}><NativeSelectOption value="Karya">Karya</NativeSelectOption><NativeSelectOption value="Produk">Produk</NativeSelectOption></NativeSelect></label>
            <label className="full-width">Deskripsi<Textarea rows={3} maxLength={1000} value={editing.description} onChange={(e)=>updateItem('description',e.target.value)} placeholder="Ceritakan isi dan manfaatnya."/></label>
            <label className="full-width">Tautan tujuan<Input required type="url" maxLength={2000} value={editing.url} onChange={(e)=>updateItem('url',e.target.value)} placeholder="https://..."/></label>
            <label>Harga / keterangan<Input maxLength={80} value={editing.price} onChange={(e)=>updateItem('price',e.target.value)} placeholder="Rp149.000 atau Gratis"/></label>
            <label>Teks tombol<Input required maxLength={60} value={editing.button} onChange={(e)=>updateItem('button',e.target.value)}/></label>
            <label className="full-width">Tautan gambar<Input type="url" maxLength={2000} value={editing.image} onChange={(e)=>updateItem('image',e.target.value)} placeholder="https://.../gambar.jpg"/></label>
          </fieldset>
          <div className="form-actions split"><label className="switch-label"><Switch checked={editing.published} onCheckedChange={(value)=>updateItem('published',value)}/> Tampilkan di profil</label><Button className="action-button" type="submit" disabled={busy}><Save/> {busy?'Menyimpan…':'Simpan'}</Button></div>
        </form>}
        <div className="manager-items">{content.items.map((item)=><article className="manager-item" key={item.id}>
          <div className="item-thumbnail">{item.image?<img src={item.image} alt=""/>:<span>{item.kind==='Karya'?'K':'P'}</span>}</div>
          <div className="item-info"><span className="item-kind">{item.kind}</span><h3>{item.title}</h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url} <ArrowUpRight size={14}/></a>{item.price&&<strong>{item.price}</strong>}</div>
          <div className="item-controls"><label className="switch-label"><Switch checked={item.published} disabled={busy||!!editing} onCheckedChange={(published)=>void save({...content,items:content.items.map((entry)=>entry.id===item.id?{...entry,published}:entry)})}/>{item.published?'Ditampilkan':'Draf'}</label><div><Button variant="outline" disabled={busy||!!editing} onClick={()=>setEditing({...item})}><Pencil/> Edit</Button><Button variant="ghost" size="icon" aria-label={'Hapus '+item.title} disabled={busy||!!editing} onClick={()=>{if(window.confirm('Hapus '+item.title+'?'))void save({...content,items:content.items.filter((entry)=>entry.id!==item.id)});}}><Trash2/></Button></div></div>
        </article>)}</div>
      </section>
      <p className="manager-footer">Website ini hanya menampilkan tautan. Transaksi pembayaran dilakukan pada halaman tujuan yang Anda pilih.</p>
    </main>
  </div>;
}
