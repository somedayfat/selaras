"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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
  }, []);

  function waProduct(productName: string) {
    const msg = `Halo PT Selaras Mitra Utama,\n\nSaya tertarik dengan produk:\n*${productName}*\n\nBoleh info ketersediaan dan harga terbaik?`;
    window.open(`https://wa.me/6281991579265?text=${encodeURIComponent(msg)}`, '_blank');
  }

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

  function filterProducts(filter: string) {
    setActiveFilter(filter);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-logo">
            <img src="img/logo.png" alt="Logo Selaras Mitra Utama" style={{height:"32px",width:"auto",objectFit:"contain"}} />
          </div>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="sidebar-body">
          <p className="sidebar-section-title">Kategori Produk</p>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('all'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Semua Produk</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('footwear'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Safety Footwear</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('eye'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Respiratory & Eye</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('apparel'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Safety Apparel</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('head'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Head Protection</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('tools'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Tools & Equipment</a>
          <a href="#products" className="sidebar-link" onClick={() => {setActiveFilter('chemical'); setIsSidebarOpen(false);}}><span className="sidebar-link-dot"></span> Chemical & Lubricant</a>
          <p className="sidebar-section-title">Layanan</p>
          <a href="#services" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}><span className="sidebar-link-dot"></span> Industrial Supply</a>
          <a href="#services" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}><span className="sidebar-link-dot"></span> Human Capital / HR</a>
          <a href="#about" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}><span className="sidebar-link-dot"></span> Tentang Kami</a>
          <a href="#contact" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}><span className="sidebar-link-dot"></span> Hubungi Kami</a>
        </div>
        <div className="sidebar-footer">PT. Selaras Mitra Utama · +62 819-9157-9265</div>
      </div>

      

  
  <div className="announcement-banner">
    Pengiriman ke seluruh Indonesia &nbsp;·&nbsp; <span>SNI Certified Products</span> &nbsp;·&nbsp; Respons cepat hari kerja &nbsp;·&nbsp; <span>KBLI 46900 · 46699</span>
  </div>

  
  <header className="site-header" id="site-header">
    <div className="header-main">
      
      <a href="#" className="nav-logo" id="nav-logo">
        <img src="img/logo.png" alt="Logo Selaras Mitra Utama" style={{"height":"40px","width":"auto","objectFit":"contain"}} />
      </a>

      
      <div className="nav-search">
        <input type="text" id="search-input" placeholder="Cari produk K3, safety shoes, tools, lubricant..." aria-label="Cari produk" />
        <button className="nav-search-btn" id="search-btn" aria-label="Cari">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
      </div>

      
      <div className="nav-actions">
        <a href="https://wa.me/6281991579265" target="_blank" className="btn-wa-header" id="header-wa-btn">
          <div className="wa-dot"></div>
          <span>Hubungi WA</span>
        </a>
        <button className="hamburger-btn" id="hamburger-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>

    
    <nav className="header-subnav scrollbar-none">
      <div className="header-subnav-inner">
        <a href="#" className="active" id="subnav-home">Beranda</a>
        <span className="subnav-divider">·</span>
        <a href="#products" id="subnav-products">Semua Produk</a>
        <span className="subnav-divider">·</span>
        <a href="#products" data-filter="footwear">Safety Footwear</a>
        <span className="subnav-divider">·</span>
        <a href="#products" data-filter="eye">Respiratory & Eye</a>
        <span className="subnav-divider">·</span>
        <a href="#products" data-filter="head">Head Protection</a>
        <span className="subnav-divider">·</span>
        <a href="#products" data-filter="tools">Tools & Equipment</a>
        <span className="subnav-divider">·</span>
        <a href="#about">Tentang Kami</a>
        <span className="subnav-divider">·</span>
        <a href="#contact">Hubungi Kami</a>
      </div>
    </nav>
  </header>

  
  
  

  
  <section className="hero" id="hero">
    <div className="hero-inner">
      
      <div className="fade-up">
        <div className="hero-badge">General Trading & Industrial Supplier</div>
        <h1>Solusi Pengadaan Industri yang <span className="accent">Terpercaya.</span></h1>
        <p>Mitra strategis untuk kebutuhan K3, PPE, alat teknik industri, dan solusi sumber daya manusia di sektor manufaktur, konstruksi, EPC, energi & logistik seluruh Indonesia.</p>
        <div className="hero-ctas">
          <a href="https://wa.me/6281991579265" target="_blank" className="btn-hero-primary" id="hero-wa-btn">
            Chat via WhatsApp
          </a>
          <a href="#products" className="btn-hero-secondary" id="hero-catalog-btn">
            Lihat Katalog Produk
          </a>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item">✔ SNI Certified</div>
          <div className="hero-trust-item">✔ Kirim Nasional</div>
          <div className="hero-trust-item">✔ Respons Cepat</div>
          <div className="hero-trust-item">✔ 500+ Klien</div>
        </div>
      </div>

      
      <div className="hero-card fade-up delay-2">
        <div className="hero-card-header">
          <span className="hero-card-brand">PT. Selaras Mitra Utama</span>
          <div className="hero-card-dot"></div>
        </div>
        <img src="img/hero.jpg" alt="Suasana Kantor Selaras Mitra Utama" style={{"width":"100%","height":"160px","objectFit":"cover","borderRadius":"14px","marginBottom":"16px"}} />
        <p style={{"fontSize":"12px","lineHeight":"1.6","color":"rgba(255,255,255,0.6)","marginBottom":"16px"}}>Head Office: Gedung Graha MIR Lt. 6, Jakarta Timur. Mitra B2B terpercaya untuk Industrial Supply & HR Solutions.</p>
        <div className="hero-card-chips">
          <span className="hero-chip">Safety K3</span>
          <span className="hero-chip">Tools & Equipment</span>
          <span className="hero-chip">Chemical</span>
          <span className="hero-chip">HR Solutions</span>
        </div>
        <div className="hero-card-footer">&#9733; SNI Certified Products</div>
      </div>
    </div>
  </section>

  
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
      <div className="stat-item fade-up delay-3">
        <div className="stat-number" data-target="2">0</div>
        <div className="stat-label">KBLI Terdaftar</div>
      </div>
    </div>
  </div>

  
  <section className="categories-section">
    <div className="container">
      <div className="section-header fade-up">
        <span className="section-tag">Kategori Produk</span>
        <h2 className="section-title">Jelajahi Katalog Kami</h2>
        <p className="section-sub">Temukan kebutuhan K3, tools, dan equipment berdasarkan kategori untuk efisiensi pengadaan Anda.</p>
      </div>
      <div className="category-grid">
        <div className="category-card fade-up" data-filter="footwear" onClick={() => filterProducts('footwear')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M4 16v-2.38C4 11.5 5.28 10.1 6.88 9.87l4.57-.65c2.4-.34 4.55-2.07 4.55-4.52V4h4v7l-5.61 2.81c-.81.4-1.25 1.25-1.12 2.15l.39 2.76c.16 1.13-.7 2.14-1.84 2.14H4v-1.86z"/></svg></div>
          <h3>Safety Footwear</h3>
          <p>Sepatu keselamatan bersertifikat SNI dari Gosave, Simon, dan merek premium lainnya.</p>
        </div>
        <div className="category-card fade-up delay-1" data-filter="eye" onClick={() => filterProducts('eye')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></div>
          <h3>Respiratory & Eye</h3>
          <p>Kacamata safety, masker respirator, dan alat pelindung pernapasan untuk industri.</p>
        </div>
        <div className="category-card fade-up delay-2" data-filter="apparel" onClick={() => filterProducts('apparel')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M20.38 3.46L16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l1.41 8.44C4.1 16.59 6.16 18 8.56 18h6.88c2.4 0 4.46-1.41 4.87-3.87l1.41-8.44a2 2 0 0 0-1.34-2.23z"/></svg></div>
          <h3>Safety Apparel</h3>
          <p>Rompi keselamatan reflektif dari Gosave, ENGO, dan Legion untuk visibilitas optimal.</p>
        </div>
        <div className="category-card fade-up delay-3" data-filter="head" onClick={() => filterProducts('head')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M12 2a9 9 0 0 0-9 9v4h18v-4a9 9 0 0 0-9-9z"/><path d="M12 2v20"/><path d="M21 15H3"/></svg></div>
          <h3>Head Protection</h3>
          <p>Helm proyek SNI dari MSA, ENZO, NSA, ASA, dan Gosave Eco untuk perlindungan kepala.</p>
        </div>
        <div className="category-card fade-up" data-filter="tools" onClick={() => filterProducts('tools')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
          <h3>Tools & Equipment</h3>
          <p>Power tools, CNC machines, measuring tools dari Bosch, Makita, Hoffmann, dan lainnya.</p>
        </div>
        <div className="category-card fade-up delay-1" data-filter="chemical" onClick={() => filterProducts('chemical')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg></div>
          <h3>Chemical & Lubricant</h3>
          <p>Pelumas, degreaser, dan produk chemical industri dari REXCO untuk perawatan mesin.</p>
        </div>
        <div className="category-card fade-up delay-2" data-filter="all" onClick={() => filterProducts('all')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
          <h3>Office & Consumable</h3>
          <p>Perlengkapan kantor dan consumable industri dari 3M, Joyko, Kenko, dan lainnya.</p>
        </div>
        <div className="category-card fade-up delay-3" onClick={() => window.open('https://wa.me/6281991579265', '_blank')}>
          <div className="category-icon-wrap"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <h3>Human Capital</h3>
          <p>Rekrutmen, outsourcing tenaga kerja, payroll, dan konsultasi manajemen SDM.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="products-section" id="products">
    <div className="container">
      <div className="products-header fade-up">
        <div>
          <span className="section-tag">Katalog Produk</span>
          <h2 className="section-title">Produk Industri & K3 Terpopuler</h2>
          <p style={{"fontSize":"14px","color":"var(--gray-500)","marginTop":"6px"}}>Order & negosiasi harga langsung via WhatsApp — tanpa cart, tanpa checkout.</p>
        </div>
        <div className="products-header-right">
          <a href="#contact" id="view-all-btn">
            Konsultasi Pengadaan
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      
      <div className="filter-bar scrollbar-none fade-up delay-1" id="filter-bar">
        <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Semua Produk</button>
        <button className={`filter-btn ${activeFilter === 'footwear' ? 'active' : ''}`} onClick={() => setActiveFilter('footwear')}>Safety Footwear</button>
        <button className={`filter-btn ${activeFilter === 'eye' ? 'active' : ''}`} onClick={() => setActiveFilter('eye')}>Respiratory & Eye</button>
        <button className={`filter-btn ${activeFilter === 'apparel' ? 'active' : ''}`} onClick={() => setActiveFilter('apparel')}>Safety Apparel</button>
        <button className={`filter-btn ${activeFilter === 'head' ? 'active' : ''}`} onClick={() => setActiveFilter('head')}>Head Protection</button>
        <button className={`filter-btn ${activeFilter === 'tools' ? 'active' : ''}`} onClick={() => setActiveFilter('tools')}>Tools & Equipment</button>
        <button className={`filter-btn ${activeFilter === 'chemical' ? 'active' : ''}`} onClick={() => setActiveFilter('chemical')}>Chemical & Lubricant</button>
      </div>

      
      <div className="product-grid fade-up delay-2" id="product-grid">

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'footwear') ? 'show' : ''}`} data-category="footwear">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Gosave Safety Shoes Beta (Slip-On)'); }}>
            <span className="product-card-badge">Footwear</span>
            <span className="product-card-sni">SNI</span>
            <img src="img/p3_img1.jpeg" alt="Gosave Beta" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>GOSAVE</span><span>Safety Footwear</span></div>
            <h3 className="product-card-title">Gosave Safety Shoes Beta (Slip-On)</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Gosave Safety Shoes Beta (Slip-On)'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'footwear') ? 'show' : ''}`} data-category="footwear">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Safety Shoes Alpha Gosave'); }}>
            <span className="product-card-badge">Footwear</span>
            <span className="product-card-sni">SNI</span>
            <img src="img/p3_img0.jpeg" alt="Gosave Alpha" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>GOSAVE</span><span>Safety Footwear</span></div>
            <h3 className="product-card-title">Safety Shoes Alpha (Lace-Up) EU 38–44</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Safety Shoes Alpha Gosave Laced'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'footwear') ? 'show' : ''}`} data-category="footwear">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Sepatu Safety Simon TS 3017 R'); }}>
            <span className="product-card-badge">Footwear</span>
            <span className="product-card-sni">SNI</span>
            <img src="img/p3_img2.jpeg" alt="Simon TS 3017" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>SIMON</span><span>Safety Footwear</span></div>
            <h3 className="product-card-title">Sepatu Safety Simon TS 3017 R Slip-On Jepang</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Sepatu Safety Simon TS 3017 R'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'eye') ? 'show' : ''}`} data-category="eye">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Kacamata Safety Fashion Basic Smoke Gosave'); }}>
            <span className="product-card-badge">Eye Protection</span>
            <img src="img/p4_img0.jpeg" alt="Kacamata Gosave Smoke" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>GOSAVE</span><span>Eye Protection</span></div>
            <h3 className="product-card-title">Kacamata Safety Fashion Basic Smoke</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Kacamata Safety Fashion Basic Smoke Gosave'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'eye') ? 'show' : ''}`} data-category="eye">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Masker Respirator Double NP306 Harmit'); }}>
            <span className="product-card-badge">Respiratory</span>
            <img src="img/p4_img4.jpeg" alt="Respirator NP306" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>HARMIT</span><span>Respiratory</span></div>
            <h3 className="product-card-title">Masker Respirator Double NP306</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Masker Respirator Double NP306 Harmit'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'apparel') ? 'show' : ''}`} data-category="apparel">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Rompi 4 Line Basic Polyester Gosave'); }}>
            <span className="product-card-badge">Apparel</span>
            <img src="img/p5_img0.jpeg" alt="Rompi Gosave" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>GOSAVE</span><span>Safety Apparel</span></div>
            <h3 className="product-card-title">Rompi 4 Line Basic Polyester Reflective Gosave</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Rompi 4 Line Basic Polyester Gosave'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'head') ? 'show' : ''}`} data-category="head">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Helm Safety Proyek MSA Lokal'); }}>
            <span className="product-card-badge">Head</span>
            <span className="product-card-sni">SNI</span>
            <img src="img/p6_img0.jpeg" alt="Helm MSA" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>MSA</span><span>Head Protection</span></div>
            <h3 className="product-card-title">Helm Safety Proyek MSA Lokal Fastrack SNI</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Helm Safety MSA Lokal'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'tools') ? 'show' : ''}`} data-category="tools">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Cutting Tools & Abrasives'); }}>
            <span className="product-card-badge">Tools</span>
            <img src="img/p8_img1.png" alt="Cutting Tools" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>Multi Brand</span><span>Tools</span></div>
            <h3 className="product-card-title">Cutting Tools & Abrasives — Multi Brand</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Cutting Tools & Abrasives'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        
        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'chemical') ? 'show' : ''}`} data-category="chemical">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Rexco Multi Purpose Lubricant'); }}>
            <span className="product-card-badge">Chemical</span>
            <img src="img/rexco.jpg" alt="Rexco Lubricant" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>REXCO</span><span>Chemical</span></div>
            <h3 className="product-card-title">Rexco Multi Purpose Lubricant Pelumas Serbaguna</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Rexco Multi Purpose Lubricant'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

        <div className={`product-card ${(activeFilter === 'all' || activeFilter === 'footwear') ? 'show' : ''}`} data-category="footwear">
          <a href="#" className="product-card-img" onClick={(e) => { e.preventDefault(); waProduct('Sepatu Safety Simon TS3011R'); }}>
            <span className="product-card-badge">Footwear</span>
            <span className="product-card-sni">SNI</span>
            <img src="img/p3_img3.png" alt="Simon TS3011R" />
          </a>
          <div className="product-card-info">
            <div className="product-card-meta"><span>SIMON</span><span>Safety Footwear</span></div>
            <h3 className="product-card-title">Sepatu Safety Simon TS3011R Lace-Up Pabrik Jepang</h3>
            <div className="product-card-bottom">
              <div className="product-card-stars">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <button className="btn-wa-card" onClick={(e) => { e.preventDefault(); waProduct('Sepatu Safety Simon TS3011R'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tanya via WA
              </button>
            </div>
          </div>
        </div>

      </div>

      
      <div className="products-bottom-cta fade-up">
        <p><strong>Tidak menemukan produk yang dicari?</strong> Kami memiliki 500+ produk industri tersedia.</p>
        <a href="https://wa.me/6281991579265" target="_blank" className="btn-outline-navy" id="more-products-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          Konsultasi Langsung via WA
        </a>
      </div>
    </div>
  </section>

  
  <section className="advantages-section">
    <div className="container">
      <div className="section-header fade-up">
        <span className="section-tag">Keunggulan Kami</span>
        <h2 className="section-title">Mengapa Memilih PT. Selaras Mitra Utama?</h2>
        <p className="section-sub">Layanan pengadaan industri yang handal, cepat, dan terpercaya untuk berbagai sektor di seluruh Indonesia.</p>
      </div>
      <div className="advantages-grid">
        <div className="advantage-card fade-up">
          <div className="advantage-icon icon-navy" style={{"fontSize":"26px"}}>⊕</div>
          <h3>Produk SNI Certified</h3>
          <p>Semua produk K3 dan safety yang kami sediakan telah tersertifikasi SNI resmi untuk memastikan kepatuhan standar keselamatan industri nasional.</p>
        </div>
        <div className="advantage-card fade-up delay-1">
          <div className="advantage-icon icon-gold" style={{"fontSize":"26px"}}>⊞</div>
          <h3>Pengiriman Seluruh Indonesia</h3>
          <p>Lokasi kantor kami di Jakarta Timur memungkinkan pengiriman yang efisien ke seluruh wilayah Indonesia melalui jaringan logistik yang kuat.</p>
        </div>
        <div className="advantage-card fade-up delay-2">
          <div className="advantage-icon icon-slate" style={{"fontSize":"26px"}}>⊡</div>
          <h3>Konsultasi & Respons Cepat</h3>
          <p>Tim kami siap merespons kebutuhan pengadaan, memberikan konsultasi produk, dan mengirimkan penawaran terbaik dalam waktu singkat di hari kerja.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="about-section" id="about">
    <div className="container">
      
      <div className="about-grid">
        <div className="about-img-wrap fade-up">
          <img src="img/p0_img1.png" alt="Gedung Graha MIR Jakarta — Kantor PT Selaras Mitra Utama" />
          <div className="about-badge">
            &#9733; Melayani Seluruh Indonesia
          </div>
        </div>
        <div className="about-content fade-up delay-1">
          <span className="section-tag">Tentang Kami</span>
          <h2 className="section-title">Mitra Bisnis Terintegrasi untuk Industri Indonesia</h2>
          <p>PT Selaras Mitra Utama adalah perusahaan penyedia solusi terintegrasi pengadaan kebutuhan industri dan pengelolaan sumber daya manusia yang hadir sebagai mitra strategis bagi dunia usaha. Berkomitmen mendukung budaya kerja yang aman, profesional, dan produktif.</p>
          <p>Kami hadir memberikan solusi satu pintu (<em>one-stop solution</em>) untuk berbagai sektor industri strategis — manufaktur, konstruksi, EPC, energi, hingga logistik.</p>
          <div className="about-keys">
            <div className="about-key"><span className="about-key-dot"></span> Graha MIR Lt. 6, Rawamangun, Jakarta Timur</div>
            <div className="about-key"><span className="about-key-dot"></span> KBLI: 46900 · 46699</div>
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

      
      <div id="services" style={{"marginTop":"80px"}}>
        <div className="section-header fade-up" style={{"textAlign":"left"}}>
          <span className="section-tag">Layanan Kami</span>
          <h2 className="section-title">Dua Pilar Layanan Utama</h2>
        </div>
        <div className="services-grid fade-up delay-1">
          <div className="service-pillar">
            <div className="service-pillar-header">
              <span className="service-pillar-num">01 — Industrial Supply</span>
              <h3 className="service-pillar-title">Pengadaan Kebutuhan Industri & K3</h3>
            </div>
            <div className="service-pillar-body">
              <p>Kami menyediakan produk industri dan K3 berkualitas tinggi sesuai standar SNI dan kebutuhan spesifik operasional lapangan. Mulai dari APD, peralatan teknik, hingga consumable industri.</p>
              <div className="service-pill-list">
                <span className="service-pill">🦺 Industrial Safety & PPE</span>
                <span className="service-pill">🔧 Tools & Equipment</span>
                <span className="service-pill">🧴 Chemical & Lubricant</span>
                <span className="service-pill">📦 Office & Consumable</span>
              </div>
              <a href="#products" className="btn-outline-navy">Lihat Katalog Produk</a>
            </div>
          </div>
          <div className="service-pillar" style={{"background":"var(--navy)"}}>
            <div className="service-pillar-header" style={{"background":"var(--navy-dark)"}}>
              <span className="service-pillar-num" style={{"color":"rgba(255,255,255,0.4)"}}>02 — Human Capital</span>
              <h3 className="service-pillar-title" style={{"color":"white"}}>Solusi Sumber Daya Manusia Profesional</h3>
            </div>
            <div className="service-pillar-body" style={{"background":"var(--navy)"}}>
              <p style={{"color":"rgba(255,255,255,0.6)"}}>Rekrutmen profesional, outsourcing tenaga kerja, administrasi penggajian (payroll), dan konsultasi SDM. Bangun tim produktif yang patuh regulasi.</p>
              <div className="service-pill-list">
                <span className="service-pill" style={{"background":"rgba(255,255,255,0.08)","borderColor":"rgba(255,255,255,0.1)","color":"rgba(255,255,255,0.8)"}}>✓ Rekrutmen & Headhunting</span>
                <span className="service-pill" style={{"background":"rgba(255,255,255,0.08)","borderColor":"rgba(255,255,255,0.1)","color":"rgba(255,255,255,0.8)"}}>✓ Outsourcing Tenaga Kerja</span>
                <span className="service-pill" style={{"background":"rgba(255,255,255,0.08)","borderColor":"rgba(255,255,255,0.1)","color":"rgba(255,255,255,0.8)"}}>✓ Payroll</span>
                <span className="service-pill" style={{"background":"rgba(255,255,255,0.08)","borderColor":"rgba(255,255,255,0.1)","color":"rgba(255,255,255,0.8)"}}>✓ Konsultasi SDM</span>
              </div>
              <a href="https://wa.me/6281991579265" target="_blank" className="btn-hero-primary" id="hr-consult-btn">
                Konsultasi HR Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="sectors-section">
    <div className="container">
      <div className="section-header fade-up">
        <span className="section-tag">Sektor yang Kami Layani</span>
        <h2 className="section-title">Melayani Berbagai Sektor Industri</h2>
      </div>
      <div className="sector-grid fade-up delay-1">
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M2 20h20"/><path d="M4 20V8l8 4V4l8 8v8"/></svg></span><h4>Manufaktur</h4></div>
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 21h18"/><path d="M7 21V7l7-4v18"/><path d="M14 11h7"/><path d="M14 16h4"/></svg></span><h4>Konstruksi</h4></div>
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span><h4>EPC</h4></div>
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg></span><h4>Energi</h4></div>
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M2 12h20"/><path d="M4 12l2-7h12l2 7"/><path d="M7 16h10"/><path d="M10 20h4"/></svg></span><h4>Logistik</h4></div>
        <div className="sector-card"><span className="sector-emoji" style={{"color":"var(--navy)"}}><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></span><h4>Perkantoran & Fasilitas</h4></div>
      </div>
    </div>
  </section>

  
  <section className="cta-band">
    <div className="container fade-up">
      <span className="section-tag" style={{"color":"rgba(255,255,255,0.5)"}}>Siap Membantu</span>
      <h2>Butuh Produk Industri atau Solusi K3?</h2>
      <p>Ceritakan kebutuhan Anda — tim kami akan respons cepat dengan penawaran terbaik sesuai spesifikasi dan budget.</p>
      <div className="cta-band-btns">
        <a href="https://wa.me/6281991579265?text=Halo%20PT%20Selaras%20Mitra%20Utama%2C%20saya%20ingin%20konsultasi%20pengadaan%20industri." target="_blank" className="btn-hero-primary" id="cta-wa-btn">
          Chat WhatsApp Sekarang
        </a>
        <a href="#contact" className="btn-hero-secondary" id="cta-form-btn">Kirim Inquiry Form</a>
      </div>
      <div className="cta-band-contacts">
        <div className="cta-contact-item"><span>Telepon 1</span><a href="tel:+6281991579265">+62 819-9157-9265</a></div>
        <div className="cta-contact-item"><span>Telepon 2</span><a href="tel:+626224948932">+62 622-4948-9325</a></div>
        <div className="cta-contact-item"><span>Email</span><a href="mailto:selarasmitrau@gmail.com">selarasmitrau@gmail.com</a></div>
      </div>
    </div>
  </section>

  
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
            <div className="contact-info-icon" style={{"fontSize":"16px","fontWeight":"700"}}>&#9632;</div>
            <div>
              <div className="contact-info-label">Alamat</div>
              <div className="contact-info-value">Gedung Graha MIR Lantai 6 Zona A1<br />Jl. Pemuda No. 9, Rawamangun<br />Jakarta Timur 13220</div>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon" style={{"fontSize":"16px","fontWeight":"700"}}>&#9830;</div>
            <div>
              <div className="contact-info-label">Telepon & WhatsApp</div>
              <div className="contact-info-value">+62 819-9157-9265<br />+62 622-4948-9325</div>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon" style={{"fontSize":"16px","fontWeight":"700"}}>&#9702;</div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">ramsansiregar.srg@gmail.com<br />selarasmitrau@gmail.com</div>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="contact-info-icon" style={{"fontSize":"16px","fontWeight":"700"}}>&#9711;</div>
            <div>
              <div className="contact-info-label">Jam Operasional</div>
              <div className="contact-info-value">Senin – Jumat: 08.00 – 17.00 WIB</div>
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

  
  <footer className="footer">
    <div className="footer-upper">
      <div className="footer-brand">
        <div className="footer-logo" style={{"display":"flex","alignItems":"center","gap":"10px"}}>
          <div style={{"width":"36px","height":"36px","background":"rgba(212,135,10,0.2)","borderRadius":"10px","display":"flex","alignItems":"center","justifyContent":"center","fontFamily":"'Montserrat',sans-serif","fontWeight":"900","fontSize":"13px","color":"#FCD34D","letterSpacing":"-1px"}}>
            SM
          </div>
          <div>
            <strong style={{"fontFamily":"'Montserrat',sans-serif","fontWeight":"800","fontSize":"15px","textTransform":"uppercase","color":"white","letterSpacing":"-0.3px"}}>Selaras Mitra Utama</strong>
            <div style={{"fontSize":"10px","color":"rgba(255,255,255,0.35)","letterSpacing":"1.5px","textTransform":"uppercase"}}>Trusted Industrial Partner</div>
          </div>
        </div>
        <p>Mitra strategis untuk kebutuhan K3, PPE, alat teknik industri, dan solusi SDM profesional di seluruh Indonesia.</p>
        <div className="footer-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
          Spesialis Industrial Supply & K3
        </div>
      </div>
      <div className="footer-col">
        <h5>Kategori Produk</h5>
        <div className="footer-links">
          <a href="#">Safety Footwear</a>
          <a href="#">Respiratory & Eye</a>
          <a href="#">Safety Apparel</a>
          <a href="#">Head Protection</a>
          <a href="#">Tools & Equipment</a>
          <a href="#">Chemical & Lubricant</a>
        </div>
      </div>
      <div className="footer-col">
        <h5>Informasi</h5>
        <div className="footer-links">
          <a href="#about">Tentang Kami</a>
          <a href="#services">Layanan</a>
          <a href="#products">Katalog Produk</a>
          <a href="#contact">Hubungi Kami</a>
          <a href="https://wa.me/6281991579265" target="_blank">Request Penawaran</a>
        </div>
      </div>
      <div className="footer-col">
        <h5>Kontak Kami</h5>
        <div className="footer-links">
          <a href="https://wa.me/6281991579265" target="_blank">+62 819-9157-9265</a>
          <a href="https://wa.me/626224948932" target="_blank">+62 622-4948-9325</a>
          <a href="mailto:selarasmitrau@gmail.com">selarasmitrau@gmail.com</a>
          <a href="#">Graha MIR Lt.6, Jakarta Timur</a>
        </div>
      </div>
    </div>
    <div className="footer-brands">
      <div className="footer-brands-inner">
        <span className="footer-brands-label">Brand & Supplier:</span>
        <div className="footer-brands-list">
          <span>GOSAVE</span>•<span>SIMON</span>•<span>MSA</span>•<span>HARMIT</span>•<span>REXCO</span>•<span>BOSCH</span>•<span>3M</span>•<span>DEWALT</span>•<span>MAKITA</span>•<span>HOFFMANN</span>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="footer-bottom-inner">
        <p>© 2026 PT. Selaras Mitra Utama. Semua Hak Dilindungi. KBLI: 46900 · 46699</p>
        <p>Website demo by <strong>Kalz Studio</strong></p>
      </div>
    </div>
  </footer>

  
  <a href="https://wa.me/6281991579265" target="_blank" className="floating-wa" aria-label="Chat via WhatsApp" style={{"fontSize":"22px"}}>&#128172;</a>

  

    </>
  );
}
