"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Flame,
  Wrench,
  Settings,
  Zap,
  Cpu,
  Gauge,
  Building2,
  Droplets,
  Wind,
  Monitor,
  Server,
  ShieldAlert,
  Armchair,
  Boxes,
  Package,
  Sparkles,
  HeartPulse,
  FlaskConical,
  Shirt,
  Coffee,
  SunMedium,
  Gift,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/data/products";

type Props = {
  products: Product[];
};

// Custom theme styling for each category
const CATEGORY_THEMES: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  a: { icon: ShieldCheck, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)" }, // PPE
  b: { icon: Flame, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.25)" },       // Fire Safety
  c: { icon: Wrench, color: "#d97706", bg: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.25)" },     // Industrial Tools
  d: { icon: Settings, color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)", border: "rgba(2, 132, 199, 0.25)" },     // Mechanical
  e: { icon: Zap, color: "#ca8a04", bg: "rgba(202, 138, 4, 0.1)", border: "rgba(202, 138, 4, 0.25)" },         // Electrical
  f: { icon: Cpu, color: "#4f46e5", bg: "rgba(79, 70, 229, 0.1)", border: "rgba(79, 70, 229, 0.25)" },       // Automation
  g: { icon: Gauge, color: "#0891b2", bg: "rgba(8, 145, 178, 0.1)", border: "rgba(8, 145, 178, 0.25)" },       // Pneumatic
  h: { icon: Building2, color: "#475569", bg: "rgba(71, 85, 105, 0.1)", border: "rgba(71, 85, 105, 0.25)" }, // Building
  i: { icon: Droplets, color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.25)" },  // Plumbing
  j: { icon: Wind, color: "#0d9488", bg: "rgba(13, 148, 136, 0.1)", border: "rgba(13, 148, 136, 0.25)" },      // HVAC
  k: { icon: Monitor, color: "#1d4ed8", bg: "rgba(29, 78, 216, 0.1)", border: "rgba(29, 78, 216, 0.25)" },     // Office Eq
  l: { icon: Server, color: "#4338ca", bg: "rgba(67, 56, 202, 0.1)", border: "rgba(67, 56, 202, 0.25)" },      // IT & Net
  m: { icon: ShieldAlert, color: "#be123c", bg: "rgba(190, 18, 60, 0.1)", border: "rgba(190, 18, 60, 0.25)" }, // Security
  n: { icon: Armchair, color: "#b45309", bg: "rgba(180, 83, 9, 0.1)", border: "rgba(180, 83, 9, 0.25)" },   // Furniture
  o: { icon: Boxes, color: "#713f12", bg: "rgba(113, 63, 18, 0.1)", border: "rgba(113, 63, 18, 0.25)" },      // Warehouse
  p: { icon: Package, color: "#c2410c", bg: "rgba(194, 65, 12, 0.1)", border: "rgba(194, 65, 12, 0.25)" },     // Packaging
  q: { icon: Sparkles, color: "#65a30d", bg: "rgba(101, 163, 13, 0.1)", border: "rgba(101, 163, 13, 0.25)" },   // Cleaning
  r: { icon: HeartPulse, color: "#be123c", bg: "rgba(190, 18, 60, 0.1)", border: "rgba(190, 18, 60, 0.25)" },   // Medical
  s: { icon: FlaskConical, color: "#7e22ce", bg: "rgba(126, 34, 206, 0.1)", border: "rgba(126, 34, 206, 0.25)" }, // Lab
  t: { icon: Shirt, color: "#0f766e", bg: "rgba(15, 118, 110, 0.1)", border: "rgba(15, 118, 110, 0.25)" },     // Uniform
  u: { icon: Coffee, color: "#78350f", bg: "rgba(120, 53, 15, 0.1)", border: "rgba(120, 53, 15, 0.25)" },      // Pantry
  v: { icon: SunMedium, color: "#ea580c", bg: "rgba(234, 88, 12, 0.1)", border: "rgba(234, 88, 12, 0.25)" }, // Energy
  w: { icon: Gift, color: "#a21caf", bg: "rgba(162, 28, 175, 0.1)", border: "rgba(162, 28, 175, 0.25)" }       // Souvenir
};

// Filter groups for quick tab filtering
const GROUPS = [
  { id: "all", label: "Semua Kategori (23)" },
  { id: "safety", label: "K3 & Safety", ids: ["a", "b", "m", "r", "t"] },
  { id: "tools", label: "Tools & Technical", ids: ["c", "d", "g", "h", "i", "j"] },
  { id: "tech", label: "Electrical & Tech", ids: ["e", "f", "k", "l", "v"] },
  { id: "office", label: "Logistik & Operasional", ids: ["n", "o", "p", "q", "s", "u", "w"] }
];

export default function CatalogCategories({ products }: Props) {
  const [activeGroup, setActiveGroup] = useState("all");

  const filteredCategories = CATEGORIES.filter(cat => {
    if (activeGroup === "all") return true;
    const group = GROUPS.find(g => g.id === activeGroup);
    return group?.ids?.includes(cat.id);
  });

  return (
    <section className="categories-section" style={{ background: '#f8fafc', padding: '56px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Compact Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(2, 55, 108, 0.08)', color: '#02376c', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkle size={12} style={{ color: '#d4870a' }} />
              <span>Katalog B2B Terintegrasi</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
              Jelajahi Katalog Kami
            </h2>
          </div>

          {/* Group Filter Tabs (Compact Pills) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {GROUPS.map(group => {
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#ffffff' : '#475569',
                    background: isActive ? '#02376c' : '#ffffff',
                    border: isActive ? '1px solid #02376c' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 2px 6px rgba(2, 55, 108, 0.2)' : 'none'
                  }}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Category List Grid (Horizontal Row Pills - Space Efficient) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '10px'
          }}
        >
          {filteredCategories.map((c) => {
            const count = products.filter(p => p.category === c.id).length;
            const theme = CATEGORY_THEMES[c.id] || { icon: ShieldCheck, color: '#02376c', bg: 'rgba(2,55,108,0.08)', border: 'rgba(2,55,108,0.2)' };
            const IconComponent = theme.icon;

            return (
              <Link
                href={`/categories/${c.slug}`}
                key={c.id}
                className="compact-cat-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Left Colored Accent Bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: theme.color,
                    borderRadius: '12px 0 0 12px'
                  }}
                />

                {/* Compact Icon Badge */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.color,
                    flexShrink: 0
                  }}
                >
                  <IconComponent size={18} strokeWidth={2} />
                </div>

                {/* Text Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.3'
                    }}
                    title={c.name}
                  >
                    {c.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                    {count} produk
                  </span>
                </div>

                {/* Right Chevron */}
                <ChevronRight size={16} className="compact-cat-arrow" style={{ color: '#cbd5e1', flexShrink: 0, transition: 'all 0.2s ease' }} />
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .compact-cat-item:hover {
          transform: translateX(3px);
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
          background: #fafafa !important;
        }
        .compact-cat-item:hover .compact-cat-arrow {
          color: #02376c !important;
          transform: translateX(2px);
        }
      `}</style>
    </section>
  );
}
