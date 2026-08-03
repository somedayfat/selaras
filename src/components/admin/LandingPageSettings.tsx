import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

export default function LandingPageSettings({ settingsForm, setSettingsForm }: any) {
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(field);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setSettingsForm((prev: any) => ({ ...prev, [field]: data.url }));
      } else {
        alert("Gagal mengupload gambar");
      }
    } catch (err) {
      alert("Kesalahan koneksi saat upload");
    } finally {
      setUploadingField(null);
    }
  };
  // Helper for simple text arrays (services, aboutText, aboutKeys)
  const handleTextArrayChange = (field: string, value: string) => {
    setSettingsForm((prev: any) => ({
      ...prev,
      [field]: value.split('\n').filter(Boolean)
    }));
  };

  // Helper for dynamic object arrays (stats, misi, advantages)
  const handleObjectArrayChange = (field: string, index: number, key: string, value: string) => {
    setSettingsForm((prev: any) => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field: string, defaultObj: any) => {
    setSettingsForm((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultObj]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setSettingsForm((prev: any) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Tentang Kami Section */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Tentang Kami</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Judul Tentang Kami</label>
              <input
                type="text"
                placeholder="Contoh: Tentang PT Selaras Mitra Utama"
                value={settingsForm.aboutTitle || ""}
                onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, aboutTitle: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Badge / Label Atas</label>
              <input
                type="text"
                placeholder="Contoh: SIAPA KAMI"
                value={settingsForm.aboutBadge || ""}
                onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, aboutBadge: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Gambar Tentang Kami (About Image)</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {settingsForm.aboutImage && (
                <img src={`/${settingsForm.aboutImage}`} alt="About Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
              )}
              <label style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer' }}>
                <Upload size={16} color="#64748b" />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{uploadingField === 'aboutImage' ? 'Mengupload...' : (settingsForm.aboutImage ? settingsForm.aboutImage : 'Pilih Gambar')}</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'aboutImage')} disabled={uploadingField !== null} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Paragraf Deskripsi (Pisahkan dengan Enter)</label>
            <textarea
              rows={4}
              placeholder="Masukkan paragraf deskripsi perusahaan di sini..."
              value={(settingsForm.aboutText || []).join('\n')}
              onChange={(e) => handleTextArrayChange('aboutText', e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Poin Keunggulan (Pisahkan dengan Enter)</label>
            <textarea
              rows={3}
              placeholder="Contoh: Kualitas Terjamin&#10;Harga Kompetitif&#10;Pengiriman Cepat"
              value={(settingsForm.aboutKeys || []).join('\n')}
              onChange={(e) => handleTextArrayChange('aboutKeys', e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* 2. Visi & Misi */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Visi & Misi</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Teks Visi</label>
            <textarea
              rows={3}
              placeholder="Masukkan teks visi perusahaan di sini..."
              value={settingsForm.visiText}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, visiText: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Daftar Misi</label>
            {(settingsForm.misi || []).map((m: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  <input
                    type="text"
                    placeholder="Nomor (Misal: 01)"
                    value={m.num}
                    onChange={(e) => handleObjectArrayChange('misi', index, 'num', e.target.value)}
                    style={{ width: '100px', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
                  />
                  <input
                    type="text"
                    placeholder="Judul Misi"
                    value={m.title}
                    onChange={(e) => handleObjectArrayChange('misi', index, 'title', e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Misi"
                    value={m.desc}
                    onChange={(e) => handleObjectArrayChange('misi', index, 'desc', e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('misi', index)}
                  style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('misi', { num: '', title: '', desc: '' })}
              style={{ width: 'fit-content', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus className="w-4 h-4" /> Tambah Misi
            </button>
          </div>
        </div>
      </div>

      {/* 3. Layanan Kami */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Layanan Kami (B2B)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Daftar Layanan (Pisahkan dengan Enter)</label>
          <textarea
            rows={6}
            placeholder="Contoh: Penyediaan Material Alat Berat&#10;Distribusi Komponen Hidrolik&#10;Layanan Purna Jual"
            value={(settingsForm.services || []).join('\n')}
            onChange={(e) => handleTextArrayChange('services', e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
          />
        </div>
      </div>

      {/* 4. Statistik */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Statistik</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(settingsForm.stats || []).map((s: any, index: number) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Angka (Misal: 500)"
                value={s.number}
                onChange={(e) => handleObjectArrayChange('stats', index, 'number', e.target.value)}
                style={{ width: '100px', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Suffix (Misal: +)"
                value={s.suffix}
                onChange={(e) => handleObjectArrayChange('stats', index, 'suffix', e.target.value)}
                style={{ width: '80px', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Label (Misal: Produk Tersedia)"
                value={s.label}
                onChange={(e) => handleObjectArrayChange('stats', index, 'label', e.target.value)}
                style={{ flexGrow: 1, boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={() => removeArrayItem('stats', index)}
                style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('stats', { number: '', suffix: '', label: '' })}
            style={{ width: 'fit-content', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus className="w-4 h-4" /> Tambah Statistik
          </button>
        </div>
      </div>

      {/* 5. Hero Card & Trust */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Hero Banner Ekstra</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Poin Kepercayaan (Pisahkan dengan Enter)</label>
            <textarea
              rows={3}
              placeholder="Contoh: 100% Produk Original&#10;Garansi Resmi&#10;Pengiriman Cepat"
              value={(settingsForm.heroTrust || []).join('\n')}
              onChange={(e) => handleTextArrayChange('heroTrust', e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Nama Brand di Kartu Hero</label>
              <input
                type="text"
                placeholder="Contoh: PT. SELARAS"
                value={settingsForm.heroCardBrand}
                onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, heroCardBrand: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Gambar Kartu Hero</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {settingsForm.heroCardImage && (
                  <img src={`/${settingsForm.heroCardImage}`} alt="Hero Preview" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
                <label style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer' }}>
                  <Upload size={16} color="#64748b" />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{uploadingField === 'heroCardImage' ? 'Upload...' : (settingsForm.heroCardImage ? settingsForm.heroCardImage : 'Pilih Gambar')}</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'heroCardImage')} disabled={uploadingField !== null} />
                </label>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Teks Kartu Hero</label>
            <textarea
              rows={2}
              placeholder="Teks deskripsi singkat di kartu hero"
              value={settingsForm.heroCardText}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, heroCardText: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Chips Kartu Hero (Pisahkan dengan Enter)</label>
            <textarea
              rows={3}
              placeholder="Contoh: Industrial Supply&#10;Machinery&#10;Spare Parts"
              value={(settingsForm.heroCardChips || []).join('\n')}
              onChange={(e) => handleTextArrayChange('heroCardChips', e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Teks Footer Kartu Hero</label>
            <input
              type="text"
              placeholder="Contoh: Hubungi kami untuk penawaran terbaik"
              value={settingsForm.heroCardFooter}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, heroCardFooter: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* 6. Sektor (Marquee) */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Sektor Industri (Slider)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Daftar Sektor (Pisahkan dengan Enter)</label>
          <textarea
            rows={5}
            placeholder="Contoh: Pertambangan&#10;Manufaktur&#10;Otomotif"
            value={(settingsForm.sectors || []).join('\n')}
            onChange={(e) => handleTextArrayChange('sectors', e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
          />
        </div>
      </div>

      {/* 7. Footer Ekstra */}
      <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bagian: Footer Bawah</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Sub-Tagline Logo Footer</label>
            <input
              type="text"
              placeholder="Contoh: Trusted Industrial Partner"
              value={settingsForm.subTagline || ""}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, subTagline: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Teks Announcement Banner (Header Atas)</label>
            <input
              type="text"
              placeholder="Contoh: Pengiriman ke seluruh Indonesia · SNI Certified Products · Respons cepat hari kerja"
              value={settingsForm.announcementBanner || ""}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, announcementBanner: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Deskripsi Footer</label>
            <textarea
              rows={2}
              placeholder="Contoh: Mitra strategis untuk kebutuhan K3, PPE, alat teknik industri, dan solusi SDM profesional di seluruh Indonesia."
              value={settingsForm.footerDesc || ""}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, footerDesc: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Teks Badge Footer</label>
            <input
              type="text"
              placeholder="Contoh: Spesialis Industrial Supply & K3"
              value={settingsForm.footerBadge || ""}
              onChange={(e) => setSettingsForm((prev: any) => ({ ...prev, footerBadge: e.target.value }))}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Daftar Brand & Supplier (Pisahkan dengan Enter)</label>
            <textarea
              rows={5}
              placeholder={'GOSAVE\nSIMON\nMSA\nHARMIT\nREXCO\nBOSCH\n3M\nDEWALT\nMAKITA\nHOFFMANN'}
              value={(settingsForm.footerBrands || []).join('\n')}
              onChange={(e) => handleTextArrayChange('footerBrands', e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
