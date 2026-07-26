"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { useSettings } from "@/components/SettingsContext";
import { useCart } from "@/components/CartContext";
import { ShoppingBasket } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { settings } = useSettings();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep header search input in sync with URL or clear it when navigating away
  useEffect(() => {
    if (pathname === "/products") {
      setSearchQuery(searchParams.get("search") || "");
    } else {
      setSearchQuery("");
    }
  }, [pathname, searchParams]);
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
            {/* Cart Button */}
            <button
              onClick={openCart}
              style={{
                position: "relative", display: "flex", alignItems: "center", gap: "7px",
                background: "rgba(255,255,255,0.12)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)", padding: "7px 14px",
                borderRadius: "9999px", fontSize: "13px", fontWeight: 700, cursor: "pointer"
              }}
            >
              <ShoppingBasket style={{ width: "15px", height: "15px" }} />
              <span>Keranjang</span>
              {totalItems > 0 && (
                <span style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  background: "#D4870A", color: "#fff",
                  width: "18px", height: "18px", borderRadius: "50%",
                  fontSize: "10px", fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {totalItems}
                </span>
              )}
            </button>
            <a
              href={`https://wa.me/${settings.primaryWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
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
