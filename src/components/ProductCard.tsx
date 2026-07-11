"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

// Shorten category names for mobile/grid display
function getShortCategory(name: string) {
  const map: Record<string, string> = {
    "Personal Protective Equipment (PPE)": "PPE & K3",
    "Fire Safety Equipment": "Fire Safety",
    "Industrial Tools & Equipment": "Tools & Eq.",
    "Mechanical & Industrial Spare Parts": "Spare Parts",
    "Electrical Supplies": "Electrical",
    "Instrumentation & Automation": "Automation",
    "Pneumatic & Hydraulic": "Pneumatic",
    "Building Materials": "Building",
    "Plumbing & Sanitary": "Plumbing",
    "HVAC Equipment": "HVAC",
    "Office Equipment": "Office Eq.",
    "IT & Networking": "IT & Net",
    "Security System": "Security",
    "Office Furniture": "Furniture",
    "Warehouse Equipment": "Warehouse",
    "Packaging Materials": "Packaging",
    "Cleaning & Housekeeping": "Cleaning",
    "Medical & First Aid": "Medical/P3K",
    "Laboratory Equipment": "Lab Eq.",
    "Uniform & Garment": "Uniform"
  };
  return map[name] ?? name;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryObj = CATEGORIES.find(c => c.id === product.category);
  const categoryName = categoryObj ? categoryObj.name : "Industrial Supply";
  const shortCategory = getShortCategory(categoryName);

  const waMessage = `Halo PT Selaras Mitra Utama,\n\nSaya tertarik dengan produk:\n*${product.name}*\n\nBoleh info ketersediaan dan harga terbaik?`;
  const waLink = `https://wa.me/6281991579265?text=${encodeURIComponent(waMessage)}`;

  // Show SNI badge for safety footwear, helmets or certified goods
  const isSni = product.name.toLowerCase().includes("safety shoes") || 
                product.name.toLowerCase().includes("helm") || 
                product.name.toLowerCase().includes("sepatu safety");

  return (
    <div className="product-card show">
      <Link href={`/products/${product.slug}`} className="product-card-img">
        <span className="product-card-badge" style={{ fontSize: '8px', padding: '3px 8px' }}>
          {shortCategory}
        </span>
        {isSni && <span className="product-card-sni" style={{ fontSize: '8px', padding: '3px 7px' }}>SNI</span>}
        {product.image ? (
          <img
            src={`/${product.image}`}
            alt={product.name}
            className="transition-transform duration-300 hover:scale-102"
          />
        ) : (
          <div style={{ width: '100%', height: '160px', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
            <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.2" fill="none">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upload Foto</span>
          </div>
        )}
      </Link>
      <div className="product-card-info" style={{ padding: '14px 16px' }}>
        <div className="product-card-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 800, color: '#1e293b' }}>{product.brand}</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>•</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>{shortCategory}</span>
        </div>
        <h3 className="product-card-title" style={{ fontSize: '12px', lineHeight: '1.4', height: '34px', margin: '0 0 10px 0', overflow: 'hidden' }}>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-card-bottom" style={{ paddingTop: '8px' }}>
          <div className="product-card-stars" style={{ marginBottom: '8px' }}>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-card"
            style={{ borderRadius: '10px', padding: '8px 10px', fontSize: '11px' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>Tanya via WA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
