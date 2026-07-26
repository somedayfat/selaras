"use client";

import { useCart } from "./CartContext";
import { useSettings } from "./SettingsContext";
import { X, Minus, Plus, ShoppingBasket, Send } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems } = useCart();
  const { settings } = useSettings();

  // Build WhatsApp message from all cart items
  const buildWaMessage = () => {
    const lines = items.map(i => `• *${i.name}* (${i.brand}) — Qty: ${i.qty}`);
    return `Halo PT Selaras Mitra Utama,\n\nSaya ingin meminta penawaran harga untuk:\n\n${lines.join("\n")}\n\nMohon info ketersediaan dan harga terbaik. Terima kasih.`;
  };

  const waLink = `https://wa.me/${settings.primaryWhatsapp}?text=${encodeURIComponent(buildWaMessage())}`;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 998, backdropFilter: "blur(2px)"
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: "380px", maxWidth: "95vw",
        background: "#fff", zIndex: 999, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)"
      }}>

        {/* Header */}
        <div style={{
          background: "#02376C", color: "#fff",
          padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBasket style={{ width: "20px", height: "20px" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>Daftar Penawaran</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>{totalItems} item dipilih</div>
            </div>
          </div>
          <button
            onClick={closeCart}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <ShoppingBasket style={{ width: "48px", height: "48px", marginBottom: "12px", opacity: 0.4 }} />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>Belum ada produk dipilih</p>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>Tekan &ldquo;+ Keranjang&rdquo; pada produk</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.slug} style={{
                  background: "#fff", border: "1px solid #f1f5f9", borderRadius: "14px",
                  padding: "12px 14px", display: "flex", gap: "12px", alignItems: "center"
                }}>
                  {/* Image */}
                  <div style={{ width: "56px", height: "56px", background: "#f8fafc", borderRadius: "10px", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.image ? (
                      <img src={item.image.startsWith("data:") || item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/${item.image}`} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                    ) : (
                      <div style={{ width: "24px", height: "24px", background: "#e2e8f0", borderRadius: "6px" }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827", lineHeight: "1.3", marginBottom: "2px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {item.brand} • {item.category}
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                      <button
                        onClick={() => updateQty(item.slug, -1)}
                        style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Minus style={{ width: "10px", height: "10px" }} />
                      </button>
                      <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.slug, 1)}
                        style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Plus style={{ width: "10px", height: "10px" }} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.slug)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: "4px", flexShrink: 0, display: "flex" }}
                  >
                    <X style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9", flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            onClick={items.length === 0 ? (e) => e.preventDefault() : undefined}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              background: items.length > 0 ? "#02376C" : "#cbd5e1",
              color: "#fff", padding: "14px", borderRadius: "12px",
              fontSize: "14px", fontWeight: 700, textDecoration: "none",
              cursor: items.length > 0 ? "pointer" : "not-allowed",
              transition: "background 0.2s"
            }}
          >
            <Send style={{ width: "16px", height: "16px" }} />
            Minta Penawaran via WhatsApp
          </a>
          <button
            onClick={closeCart}
            style={{ background: "none", border: "1px solid #e2e8f0", color: "#374151", padding: "12px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    </>
  );
}
