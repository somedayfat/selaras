"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/components/SettingsContext";

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-upper">
          <div className="footer-brand">
            <div className="footer-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(212,135,10,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontWeight: "900", fontSize: "13px", color: "#FCD34D", letterSpacing: "-1px" }}>
                SM
              </div>
              <div>
                <strong style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: "800", fontSize: "15px", textTransform: "uppercase", color: "white", letterSpacing: "-0.3px" }}>{settings.shopName}</strong>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Trusted Industrial Partner</div>
              </div>
            </div>
            <p>Mitra strategis untuk kebutuhan K3, PPE, alat teknik industri, dan solusi SDM profesional di seluruh Indonesia.</p>
            <div className="footer-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" /></svg>
              Spesialis Industrial Supply & K3
            </div>
          </div>
          <div className="footer-col">
            <h5>Kategori Produk</h5>
            <div className="footer-links">
              <Link href="/categories/personal-protective-equipment-ppe">Safety Footwear</Link>
              <Link href="/categories/personal-protective-equipment-ppe">Respiratory & Eye</Link>
              <Link href="/categories/personal-protective-equipment-ppe">Safety Apparel</Link>
              <Link href="/categories/personal-protective-equipment-ppe">Head Protection</Link>
              <Link href="/categories/industrial-tools-equipment">Tools & Equipment</Link>
              <Link href="/categories/mechanical-industrial-spare-parts">Chemical & Lubricant</Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Informasi</h5>
            <div className="footer-links">
              <Link href="/#about">Tentang Kami</Link>
              <Link href="/#services">Layanan</Link>
              <Link href="/products">Katalog Produk</Link>
              <Link href="/#contact">Hubungi Kami</Link>
              <a href={`https://wa.me/${settings.primaryWhatsapp}`} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>Request Penawaran</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Kontak Kami</h5>
            <div className="footer-links">
              {settings.phoneNumbers.map((phone, idx) => {
                const cleanedPhone = phone.replace(/[^0-9]/g, "");
                const formattedPhone = cleanedPhone.startsWith("0") ? "62" + cleanedPhone.slice(1) : cleanedPhone;
                return (
              <a key={idx} href={`https://wa.me/${formattedPhone}`} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>
                    {phone} {formattedPhone === settings.primaryWhatsapp && "(Utama)"}
                  </a>
                );
              })}
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
              <a href={settings.googleMapsUrl !== "#" ? settings.googleMapsUrl : undefined}>{settings.address}</a>
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
            <p>© {new Date().getFullYear()} {settings.companyName}. Semua Hak Dilindungi.</p>
          </div>
        </div>
      </footer>

      {/* Floating WA Button */}
      <a href={`https://wa.me/${settings.primaryWhatsapp}`} target="_blank" rel="noopener noreferrer" className="floating-wa" aria-label="Chat via WhatsApp" style={{ fontSize: "22px" }} suppressHydrationWarning>💬</a>
    </>
  );
}
