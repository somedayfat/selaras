"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const SERVICES = [
  "General Trading",
  "General Supplier",
  "Procurement Service",
  "Project Supply",
  "General Contractor",
  "Mechanical & Electrical Works",
  "Interior Fit-Out",
  "Engineering Support",
  "Installation",
  "Preventive & Corrective Maintenance",
  "Fabrication",
  "Import & Export Assistance",
  "Custom Product Sourcing",
  "Logistics & Delivery",
  "Vendor Managed Inventory (VMI)"
];

const SECTORS = [
  "Manufaktur",
  "Otomotif",
  "Semikonduktor",
  "Elektronik",
  "Logistik & Pergudangan",
  "Konstruksi",
  "Rumah Sakit",
  "Perkantoran",
  "Hotel",
  "Pendidikan",
  "Pertambangan",
  "Migas",
  "Energi",
  "Instansi Pemerintah",
  "BUMN",
  "Swasta"
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Counter animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const targetEl = entry.target as HTMLElement;
        if (entry.isIntersecting && !targetEl.dataset.counted) {
          targetEl.dataset.counted = 'true';
          const target = parseInt(targetEl.getAttribute('data-target') || '0');
          const suffix = targetEl.getAttribute('data-suffix') || '';
          animateCounter(targetEl, target, suffix, 1600);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    function animateCounter(el: HTMLElement, target: number, suffix: string, duration: number) {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, 16);
    }
    setIsMounted(true);
  }, []);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const company = (document.getElementById('company') as HTMLInputElement).value.trim();
    const whatsapp = (document.getElementById('whatsapp') as HTMLInputElement).value.trim();
    const needType = (document.getElementById('need_type') as HTMLSelectElement).value;
    const message = (document.getElementById('message') as HTMLTextAreaElement).value.trim();

    if (!name || !whatsapp) {
      alert('Mohon isi nama dan nomor WhatsApp.');
      return;
    }

    let msg = `Halo PT Selaras Mitra Utama,\n\nSaya ingin mengajukan inquiry pengadaan:\n\n`;
    msg += `Nama: *${name}*\n`;
    if (company) msg += `Perusahaan: ${company}\n`;
    msg += `No WA: ${whatsapp}\n`;
    if (needType) msg += `Jenis Kebutuhan: ${needType}\n`;
    if (message) msg += `\nDetail:\n${message}`;

    window.open(`https://wa.me/6281991579265?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className={`fade-up ${isMounted ? 'visible' : ''}`}>
            <div className="hero-badge">General Trading & Industrial Supplier</div>
            <h1>Solusi Pengadaan Industri yang <span className="accent">Terpercaya.</span></h1>
            <p>Mitra strategis untuk kebutuhan K3, PPE, alat teknik industri, dan solusi sumber daya manusia di sektor manufaktur, konstruksi, EPC, energi & logistik seluruh Indonesia.</p>
            <div className="hero-ctas">
              <a href="https://wa.me/6281991579265" target="_blank" rel="noopener noreferrer" className="btn-hero-primary" id="hero-wa-btn">
                Chat via WhatsApp
              </a>
              <Link href="/products" className="btn-hero-secondary" id="hero-catalog-btn">
                Lihat Katalog Produk
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">✔ SNI Certified</div>
              <div className="hero-trust-item">✔ Kirim Nasional</div>
              <div className="hero-trust-item">✔ Respons Cepat</div>
              <div className="hero-trust-item">✔ 500+ Klien</div>
            </div>
          </div>

          <div className={`hero-card fade-up delay-2 ${isMounted ? 'visible' : ''}`}>
            <div className="hero-card-header">
              <span className="hero-card-brand">PT. Selaras Mitra Utama</span>
              <div className="hero-card-dot"></div>
            </div>
            <img src="img/hero.jpg" alt="Suasana Kantor Selaras Mitra Utama" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "14px", marginBottom: "16px" }} />
            <p style={{ fontSize: "12px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>Head Office: Gedung Graha MIR Lt. 6, Jakarta Timur. Mitra B2B terpercaya untuk Industrial Supply & HR Solutions.</p>
            <div className="hero-card-chips">
              <span className="hero-chip">Safety K3</span>
              <span className="hero-chip">Tools & Equipment</span>
              <span className="hero-chip">Chemical</span>
              <span className="hero-chip">HR Solutions</span>
            </div>
            <div className="hero-card-footer">★ SNI Certified Products</div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="container">
          <div className="stat-item fade-up">
            <div className="stat-number" data-target="500" data-suffix="+">0</div>
            <div className="stat-label">Produk Tersedia</div>
          </div>
          <div className="stat-item fade-up delay-1">
            <div className="stat-number" data-target="100" data-suffix="+">0</div>
            <div className="stat-label">Klien Industri</div>
          </div>
          <div className="stat-item fade-up delay-2">
            <div className="stat-number" data-target="5" data-suffix="+">0</div>
            <div className="stat-label">Tahun Pengalaman</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Kategori Produk</span>
            <h2 className="section-title">Jelajahi Katalog Kami</h2>
            <p className="section-sub">Temukan kebutuhan K3, tools, dan equipment berdasarkan kategori untuk efisiensi pengadaan Anda.</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((c, i) => (
              <Link href={`/categories/${c.slug}`} key={c.id} className={`category-card fade-up delay-${i % 4}`}>
                <div className="category-icon-wrap">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '13px' }}>{c.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>{PRODUCTS.filter(p => p.category === c.id).length} produk</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products List */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="products-header fade-up">
            <div>
              <span className="section-tag">Katalog Produk</span>
              <h2 className="section-title">Produk Industri & K3 Unggulan</h2>
              <p style={{ fontSize: "14px", color: "var(--gray-500)", marginTop: "6px" }}>Order & negosiasi harga langsung via WhatsApp — tanpa cart, tanpa checkout.</p>
            </div>
            <div className="products-header-right">
              <Link href="/products" id="view-all-btn">
                Lihat Semua Produk
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          <div className="product-grid" id="product-grid">
            {PRODUCTS.filter(p => p.id.startsWith('f')).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="products-bottom-cta fade-up">
            <p><strong>Tidak menemukan produk yang dicari?</strong> Kami memiliki 500+ produk industri tersedia.</p>
            <Link href="/products" className="btn-outline-navy flex items-center justify-center gap-2" id="more-products-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Jelajahi Katalog Lengkap
            </Link>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="advantages-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Keunggulan Kami</span>
            <h2 className="section-title">Mengapa Memilih PT. Selaras Mitra Utama?</h2>
            <p className="section-sub">Layanan pengadaan industri yang handal, cepat, dan terpercaya untuk berbagai sektor di seluruh Indonesia.</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card fade-up">
              <div className="advantage-icon icon-navy" style={{ fontSize: "26px" }}>⊕</div>
              <h3>Produk SNI Certified</h3>
              <p>Semua produk K3 dan safety yang kami sediakan telah tersertifikasi SNI resmi untuk memastikan kepatuhan standar keselamatan industri nasional.</p>
            </div>
            <div className="advantage-card fade-up delay-1">
              <div className="advantage-icon icon-gold" style={{ fontSize: "26px" }}>⊞</div>
              <h3>Pengiriman Seluruh Indonesia</h3>
              <p>Lokasi kantor kami di Jakarta Timur memungkinkan pengiriman yang efisien ke seluruh wilayah Indonesia melalui jaringan logistik yang kuat.</p>
            </div>
            <div className="advantage-card fade-up delay-2">
              <div className="advantage-icon icon-slate" style={{ fontSize: "26px" }}>⊡</div>
              <h3>Konsultasi & Respons Cepat</h3>
              <p>Tim kami siap merespons kebutuhan pengadaan, memberikan konsultasi produk, dan mengirimkan penawaran terbaik dalam waktu singkat di hari kerja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap fade-up">
              <img src="img/p0_img1.png" alt="Gedung Graha MIR Jakarta — Kantor PT Selaras Mitra Utama" />
              <div className="about-badge">
                ★ Melayani Seluruh Indonesia
              </div>
            </div>
            <div className="about-content fade-up delay-1">
              <span className="section-tag">Tentang Kami</span>
              <h2 className="section-title">Mitra Bisnis Terintegrasi untuk Industri Indonesia</h2>
              <p>PT Selaras Mitra Utama adalah perusahaan penyedia solusi terintegrasi pengadaan kebutuhan industri dan pengelolaan sumber daya manusia yang hadir sebagai mitra strategis bagi dunia usaha. Berkomitmen mendukung budaya kerja yang aman, profesional, dan produktif.</p>
              <p>Kami hadir memberikan solusi satu pintu (<em>one-stop solution</em>) untuk berbagai sektor industri strategis — manufaktur, konstruksi, EPC, energi, hingga logistik.</p>
              <div className="about-keys">
                <div className="about-key"><span className="about-key-dot"></span> Graha MIR Lt. 6, Rawamangun, Jakarta Timur</div>
                <div className="about-key"><span className="about-key-dot"></span> Pengiriman Seluruh Indonesia</div>
                <div className="about-key"><span className="about-key-dot"></span> Respons Cepat & Profesional</div>
              </div>
              <div className="vm-grid">
                <div className="vm-card gold-border">
                  <h4>Visi</h4>
                  <p>Menjadi perusahaan nasional terkemuka dalam penyediaan solusi terintegrasi pengadaan industri dan SDM yang profesional, inovatif, dan berkelanjutan.</p>
                </div>
                <div className="vm-card">
                  <h4>Misi</h4>
                  <ul>
                    <li>Produk berkualitas dengan standar keselamatan tinggi</li>
                    <li>Kemitraan strategis jangka panjang</li>
                    <li>Solusi HR adaptif dan efisien</li>
                    <li>Pengembangan kapabilitas berkelanjutan</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div id="services" style={{ marginTop: "80px" }}>
            <div className="section-header fade-up" style={{ textAlign: 'left' }}>
              <span className="section-tag">Layanan Kami</span>
              <h2 className="section-title">Daftar Layanan Pendukung</h2>
            </div>
            <div className="service-pillar fade-up delay-1" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px' }}>
              <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Layanan Terintegrasi</p>
              <div className="service-pill-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {SERVICES.map((s, i) => (
                  <span key={i} className="service-pill">✓ {s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="sectors-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Sektor yang Kami Layani</span>
            <h2 className="section-title">Melayani Berbagai Sektor Industri</h2>
          </div>
          <div className="sector-grid fade-up delay-1">
            {SECTORS.map((s, i) => (
              <div key={i} className="sector-card">
                <h4>{s}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Hubungi Kami</span>
            <h2 className="section-title">Kirim Inquiry Pengadaan</h2>
            <p className="section-sub">Isi form berikut dan kami akan menghubungi Anda via WhatsApp dengan cepat.</p>
          </div>
          <div className="contact-grid fade-up delay-1">
            <div className="contact-info">
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ fontSize: '16px', fontWeight: '700' }}>■</div>
                <div>
                  <div className="contact-info-label">Head Office – Jakarta</div>
                  <div className="contact-info-value">Gedung Graha MIRI Lt. 6 Zona A1<br />Jl. Pemuda No. 9, Rawamangun<br />Pulo Gadung, Jakarta Timur 13220</div>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ fontSize: '16px', fontWeight: '700' }}>♦</div>
                <div>
                  <div className="contact-info-label">Branch Office – Bekasi</div>
                  <div className="contact-info-value">Pondok Tanah Mas<br />Jl. Dahlia V Blok C20 No. 4<br />Kel. Wanasari, Kec. Cibitung<br />Kab. Bekasi, Jawa Barat</div>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ fontSize: '16px', fontWeight: '700' }}>○</div>
                <div>
                  <div className="contact-info-label">Representative Office – Surakarta</div>
                  <div className="contact-info-value">Jl. Kelud Selatan No. 21<br />Kel. Nusukan, Kec. Banjarsari<br />Kota Surakarta, Jawa Tengah</div>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon" style={{ fontSize: '16px', fontWeight: '700' }}>☎</div>
                <div>
                  <div className="contact-info-label">Kontak</div>
                  <div className="contact-info-value">+62 819-9157-9265<br />info@smuindustrial.com</div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <form id="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Nama Lengkap *</label>
                    <input type="text" id="name" className="form-control" required placeholder="Nama lengkap" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="company">Perusahaan *</label>
                    <input type="text" id="company" className="form-control" required placeholder="Nama instansi" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="whatsapp">No. WhatsApp *</label>
                    <input type="tel" id="whatsapp" className="form-control" required placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="need_type">Jenis Kebutuhan</label>
                    <select id="need_type" className="form-control">
                      <option value="">Pilih kebutuhan...</option>
                      <option value="Industrial Safety & PPE">Industrial Safety & PPE</option>
                      <option value="Tools & Equipment">Tools & Equipment</option>
                      <option value="Chemical & Lubricant">Chemical & Lubricant</option>
                      <option value="Human Capital / HR">Human Capital / HR</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Detail Kebutuhan</label>
                  <textarea id="message" className="form-control" placeholder="Tuliskan spesifikasi atau daftar produk yang dibutuhkan..."></textarea>
                </div>
                <button type="submit" className="btn-submit" id="contact-submit-btn">
                  Kirim via WhatsApp
                </button>
                <p className="form-note">Form ini akan membuka WhatsApp dengan pesan terisi otomatis untuk konfirmasi lebih lanjut.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
