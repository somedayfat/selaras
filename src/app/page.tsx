"use client";

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CatalogCategories from '@/components/CatalogCategories';
import SectorMarquee from '@/components/SectorMarquee';
import { useSettings } from '@/components/SettingsContext';
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  Clock, 
  Award,
  Phone,
  Smartphone,
  MessageSquare,
  Mail,
  MapPin,
  Building
} from 'lucide-react';

const IconMap: Record<string, any> = {
  ShieldCheck,
  Globe,
  Zap,
  Clock,
  Award,
  Phone,
  Smartphone,
  MessageSquare,
  Mail,
  MapPin,
  Building
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { settings } = useSettings();

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

    window.open(`https://wa.me/${settings.primaryWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <>
      {/* ============================================================
          1. HERO SECTION
      ============================================================ */}
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className={`fade-up ${isMounted ? 'visible' : ''}`}>
            <div className="hero-badge">{settings.heroBadge || "General Trading & Industrial Supplier"}</div>
            <h1>{settings.heroTitle || "Solusi Pengadaan Material Industri & Proyek Secara"} <span className="accent">{settings.heroTitleAccent || "Cepat, Tepat & Kompetitif."}</span></h1>
            <p>{settings.heroSubtitle || "Mendukung kebutuhan pabrik, kontraktor, dan proyek dengan jaringan supplier terpercaya."}</p>
            <div className="hero-trust">
              {(settings.heroTrust || []).map((item, i) => (
                <div key={i} className="hero-trust-item">{item}</div>
              ))}
            </div>
            <div className="hero-ctas">
              <a href="#contact" className="btn-hero-primary" id="hero-request-btn">
                Request Penawaran
              </a>
              <a href={`https://wa.me/${settings.primaryWhatsapp}`} target="_blank" rel="noopener noreferrer" suppressHydrationWarning className="btn-hero-secondary" id="hero-wa-btn">
                Chat WhatsApp
              </a>
            </div>
          </div>

          <div className={`hero-card fade-up delay-2 ${isMounted ? 'visible' : ''}`}>
            <div className="hero-card-header">
              <span className="hero-card-brand">{settings.heroCardBrand || "PT. Selaras Mitra Utama"}</span>
              <div className="hero-card-dot"></div>
            </div>
            <img src={settings.heroCardImage || "img/hero.jpg"} alt="Suasana Kantor Selaras Mitra Utama" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "14px", marginBottom: "16px" }} />
            <p style={{ fontSize: "12px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>{settings.heroCardText}</p>
            <div className="hero-card-chips">
              {(settings.heroCardChips || []).map((chip, i) => (
                <span key={i} className="hero-chip">{chip}</span>
              ))}
            </div>
            <div className="hero-card-footer">{settings.heroCardFooter}</div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. STATS STRIP
      ============================================================ */}
      <div className="stats-strip">
        <div className="container">
          {(settings.stats || []).map((stat, i) => (
            <div key={i} className={`stat-item fade-up delay-${i}`}>
              <div className="stat-number" data-target={stat.number} data-suffix={stat.suffix}>0</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          3. TENTANG KAMI + VISI/MISI
      ============================================================ */}
      <section className="about-section" id="about">
        <div className="container">
          {/* About Grid */}
          <div className="about-grid">
            <div className="about-img-wrap fade-up">
              <img src={settings.aboutImage || "img/p0_img1.png"} alt="Gedung Graha MIR Jakarta — Kantor PT Selaras Mitra Utama" />
              <div className="about-badge">
                {settings.aboutBadge || "Melayani Seluruh Indonesia"}
              </div>
            </div>
            <div className="about-content fade-up delay-1">
              <span className="section-tag">Tentang Kami</span>
              <h2 className="section-title">{settings.aboutTitle || "Mitra Bisnis Terintegrasi untuk Industri Indonesia"}</h2>
              {(settings.aboutText || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <div className="about-keys">
                {(settings.aboutKeys || []).map((keyItem, i) => (
                  <div key={i} className="about-key"><span className="about-key-dot"></span> {keyItem}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Visi & Misi Side-by-Side Split Grid */}
          <div className="vm-section-grid fade-up" style={{ marginTop: '56px' }}>
            {/* Visi Card */}
            <div className="vm-card-visi">
              <div className="vm-title color-gold">Visi</div>
              <p className="visi-text">
                {settings.visiText}
              </p>
            </div>

            {/* Misi Card */}
            <div className="vm-card-misi">
              <div className="vm-title color-navy">Misi</div>
              <div className="misi-list">
                {(settings.misi || []).map((m) => (
                  <div key={m.num} className="misi-list-item">
                    <h5 className="misi-item-title">
                      <span className="misi-item-num">{m.num}.</span> {m.title}
                    </h5>
                    <p className="misi-item-desc">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. LAYANAN (Pindah menjadi section mandiri)
      ============================================================ */}
      <section className="about-section" id="services" style={{ background: 'var(--white)', borderTop: 'none', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="section-header fade-up" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <span className="section-tag">Layanan Kami</span>
            <h2 className="section-title">Daftar Layanan Pendukung</h2>
            <p style={{ fontSize: "14px", color: "var(--gray-500)", marginTop: "8px" }}>Solusi terpadu untuk pengadaan, pengerjaan proyek, instalasi, hingga perawatan berkala.</p>
          </div>
          <div className="service-pillar fade-up delay-1" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '20px', padding: '36px' }}>
            <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Layanan Terintegrasi (B2B)</p>
            <div className="service-pill-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {(settings.services || []).map((s, i) => (
                <span key={i} className="service-pill" style={{ background: 'var(--white)', border: '1px solid var(--gray-250)' }}>✓ {s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. KEUNGGULAN KAMI — 5 poin
      ============================================================ */}
      <section className="advantages-section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Keunggulan Kami</span>
            <h2 className="section-title">Mengapa Memilih PT. Selaras Mitra Utama?</h2>
            <p className="section-sub">Layanan pengadaan industri yang handal, cepat, dan terpercaya untuk berbagai sektor di seluruh Indonesia.</p>
          </div>
          <div className="advantages-grid advantages-5">
            {(settings.advantages || []).map((adv, i) => {
              const IconComponent = IconMap[adv.iconName] || ShieldCheck;
              return (
                <div key={i} className={`advantage-card fade-up delay-${i % 4}`}>
                  <div className={`advantage-icon ${adv.iconClass}`}>
                    <IconComponent size={26} strokeWidth={1.8} />
                  </div>
                  <h3>{adv.title}</h3>
                  <p>{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. KATEGORI PRODUK
      ============================================================ */}
      <CatalogCategories products={PRODUCTS} />

      {/* ============================================================
          7. FEATURED PRODUCTS
      ============================================================ */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="products-header fade-up">
            <div>
              <span className="section-tag">Katalog Produk</span>
              <h2 className="section-title">Produk Industri &amp; K3 Unggulan</h2>
              <p style={{ fontSize: "14px", color: "var(--gray-500)", marginTop: "6px" }}>Order &amp; negosiasi harga langsung via WhatsApp — tanpa cart, tanpa checkout.</p>
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

      {/* ============================================================
          8. AREA LAYANAN / SECTORS (Marquee Slider)
      ============================================================ */}
      <SectorMarquee sectors={settings.sectors || []} />

      {/* ============================================================
          9. CTA BESAR / CONTACT
      ============================================================ */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-tag">Hubungi Kami</span>
            <h2 className="section-title">Kirim kebutuhan Anda sekarang dan dapatkan penawaran terbaik</h2>
            <p className="section-sub">Isi form berikut dan kami akan menghubungi Anda via WhatsApp dengan cepat.</p>
          </div>

          {/* Trust strip wording CTA */}
          <div className="cta-trust-strip fade-up">
            <span>✔ Didukung jaringan supplier</span>
            <span>✔ Partner pengadaan industry</span>
            <span>✔ Mendukung berbagai kebutuhan Industri, proyek</span>
          </div>

          <div className="contact-grid fade-up delay-1">
            <div className="contact-info">
              {/* Office */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><Phone size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Office</div>
                  <div className="contact-info-value">
                    <a href={`tel:${(settings.officePhone || "+62 21 2936 8919").replace(/[^0-9+]/g, "")}`}>{settings.officePhone || "+62 21 2936 8919"}</a>
                  </div>
                </div>
              </div>
              {/* Sales Hotline */}
              {settings.salesHotlines && settings.salesHotlines.length > 0 && (
                <div className="contact-info-card">
                  <div className="contact-info-icon"><Smartphone size={18} strokeWidth={1.8} /></div>
                  <div>
                    <div className="contact-info-label">Sales Hotline</div>
                    <div className="contact-info-value">
                      {(settings.salesHotlines).map((hotline, i) => (
                        <Fragment key={i}>
                          <a href={`https://wa.me/${hotline.replace(/[^0-9]/g, "").startsWith("0") ? "62" + hotline.replace(/[^0-9]/g, "").slice(1) : hotline.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>{hotline}</a>{i < (settings.salesHotlines?.length || 0) - 1 && <br />}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* WA Business */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><MessageSquare size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">WhatsApp Business</div>
                  <div className="contact-info-value">
                    <a href={`https://wa.me/${settings.primaryWhatsapp}`} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>{settings.primaryWhatsapp} (Utama)</a>
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><Mail size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </div>
                </div>
              </div>
              {/* Business Hours */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><Clock size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Business Hours</div>
                  <div className="contact-info-value" style={{ whiteSpace: "pre-line" }}>{settings.businessHours}</div>
                </div>
              </div>
              {/* Head Office - Jakarta */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><Building size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Head Office – Jakarta</div>
                  <div className="contact-info-value" style={{ whiteSpace: "pre-line" }}>
                    <a href={settings.googleMapsUrl !== "#" ? settings.googleMapsUrl : undefined} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none", cursor: "pointer" }}>
                      {settings.headOffice}
                    </a>
                  </div>
                </div>
              </div>
                            {/* Head Office - Cibitung Bekasi */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><Building size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Head Office – Cibitung Bekasi</div>
                  <div className="contact-info-value" style={{ whiteSpace: "pre-line" }}>
                    <a href="https://www.google.com/maps/place/6%C2%B015'11.8%22S+107%C2%B006'07.5%22E/@-6.253269,107.0995082,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-6.253269!4d107.1020831?hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                      {settings.repOffice}
                    </a>
                  </div>
                </div>
              </div>
              {/* Rep Office */}
              <div className="contact-info-card">
                <div className="contact-info-icon"><MapPin size={18} strokeWidth={1.8} /></div>
                <div>
                  <div className="contact-info-label">Representative Office</div>
                  <div className="contact-info-value" style={{ whiteSpace: "pre-line" }}>
                    <a href="https://www.google.com/maps/place/6%C2%B015'11.8%22S+107%C2%B006'07.5%22E/@-6.253269,107.0995082,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-6.253269!4d107.1020831?hl=en&entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                      {settings.repOffice}
                    </a>
                  </div>
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
                      <option value="Industrial Safety &amp; PPE">Industrial Safety &amp; PPE</option>
                      <option value="Tools &amp; Equipment">Tools &amp; Equipment</option>
                      <option value="Chemical &amp; Lubricant">Chemical &amp; Lubricant</option>
                      <option value="Human Capital / HR">Human Capital / HR</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ display: 'none' }}>
                  {/* Keep for layout spacing compatibility */}
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

          {/* Google Maps Embed */}
          <div className="maps-embed fade-up delay-2" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="#02376C" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Peta Lokasi: Head Office – Jakarta (Graha MIR)</span>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3888362635!2d106.878012376288!3d-6.19256079379435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4ecf7bcb995%3A0xb04ae6fd1223811a!2sGraha%20MIR!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%" 
                height="340" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', background: '#fff', border: '1px solid #e2e8f0' }}>
              <div style={{ padding: '12px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#02376C" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Peta Lokasi: Head Office &amp; Rep. Office – Cibitung Bekasi</span>
              </div>
              <iframe 
                src="https://maps.google.com/maps?q=-6.253269,107.1020831&hl=id&z=16&output=embed"
                width="100%" 
                height="340" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
