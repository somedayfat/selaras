"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { useSettings } from "@/components/SettingsContext";

export default function Header() {
  const router = useRouter();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  return (
    <>
      {/* Sidebar Overlay & Mobile Sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-logo">
            <Link href="/" onClick={() => setIsSidebarOpen(false)}>
              <img src="/img/logo.png" alt="Logo Selaras Mitra Utama" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
            </Link>
          </div>
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="sidebar-body">
          <p className="sidebar-section-title">Kategori Produk</p>
          <Link
            href="/products"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="sidebar-link-dot" /> Semua Produk
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="sidebar-link"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sidebar-link-dot" /> {c.name}
            </Link>
          ))}
          <p className="sidebar-section-title">Layanan</p>
          <Link href="/#services" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="sidebar-link-dot" /> Industrial Supply
          </Link>
          <Link href="/#services" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="sidebar-link-dot" /> Human Capital / HR
          </Link>
          <Link href="/#about" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="sidebar-link-dot" /> Tentang Kami
          </Link>
          <Link href="/#contact" className="sidebar-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="sidebar-link-dot" /> Hubungi Kami
          </Link>
        </div>
        <div className="sidebar-footer">{settings.companyName} · +62 819-9157-9265</div>
      </div>

      {/* Announcement Banner */}
      <div className="announcement-banner">
        Pengiriman ke seluruh Indonesia &nbsp;·&nbsp; <span>SNI Certified Products</span> &nbsp;·&nbsp; Respons cepat hari kerja
      </div>

      {/* Main Sticky Header */}
      <header className="site-header" id="site-header">
        <div className="header-main">
          {/* Logo */}
          <Link href="/" className="nav-logo" id="nav-logo">
            <img src="/img/logo.png" alt="Logo Selaras Mitra Utama" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search">
            <input
              type="text"
              placeholder="Cari produk K3, safety shoes, tools, lubricant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari produk"
            />
            <button
              type="submit"
              className="nav-search-btn"
              id="search-btn"
              aria-label="Cari"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          {/* Actions */}
          <div className="nav-actions">
            <a
              href={`https://wa.me/${settings.primaryWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa-header"
              id="header-wa-btn"
            >
              <div className="wa-dot" />
              <span>Hubungi WA</span>
            </a>
            <button
              className="hamburger-btn"
              id="hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subnav links */}
        <nav className="header-subnav scrollbar-none">
          <div className="header-subnav-inner">
            <Link href="/" id="subnav-home">Beranda</Link>
            <span className="subnav-divider">·</span>
            <Link href="/products" id="subnav-products">Semua Produk</Link>
            {CATEGORIES.slice(0, 5).map(c => (
              <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span className="subnav-divider">·</span>
                <Link href={`/categories/${c.slug}`}>
                  {c.name}
                </Link>
              </span>
            ))}
            <span className="subnav-divider">·</span>
            <Link href="/#about">Tentang Kami</Link>
            <span className="subnav-divider">·</span>
            <Link href="/#contact">Hubungi Kami</Link>
          </div>
        </nav>
      </header>
    </>
  );
}
