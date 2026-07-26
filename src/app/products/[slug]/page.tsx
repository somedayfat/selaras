import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, ArrowLeft, MessageSquare } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import settings from "@/data/settings.json";
import AddToCartButton from "@/components/AddToCartButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find category name
  const category = CATEGORIES.find(c => c.id === product.category);
  const categoryName = category ? category.name : "Industrial Supply";

  // Pre-filled WhatsApp message
  const waMessage = `Halo PT Selaras Mitra Utama, saya ingin bertanya tentang ketersediaan stok & penawaran harga untuk produk:\n\n*${product.name}* (${product.brand})`;
  const waLink = `https://wa.me/${settings.primaryWhatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f9fafb', paddingTop: '36px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* Breadcrumb */}
        <Link 
          href="/products"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '28px', textDecoration: 'none' }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Kembali ke Katalog
        </Link>

        {/* Main Layout: Image + Details side by side */}
        <div style={{ display: 'flex', gap: '56px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left: Image */}
          <div style={{ flex: '0 0 400px', maxWidth: '400px', width: '100%' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: '#f3f4f6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px', marginBottom: '16px', overflow: 'hidden' }}>
              {product.image ? (
                <img
                  src={product.image.startsWith("data:") || product.image.startsWith("http") || product.image.startsWith("/") ? product.image : `/${product.image}`}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
              ) : (
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>No Image Available</span>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <ShieldCheck style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', color: '#15803d', lineHeight: '1.55' }}>
                <strong>Jaminan 100% Produk Original.</strong> Didistribusikan resmi sesuai standar keselamatan industri nasional.
              </p>
            </div>
          </div>

          {/* Right: Product Details */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <span style={{ padding: '4px 12px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.brand}
              </span>
              <span style={{ padding: '4px 12px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                {categoryName}
              </span>
              <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Stok Tersedia
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(product.rating || 5)].map((_, idx) => (
                  <Star key={idx} style={{ width: '15px', height: '15px', color: '#facc15', fill: '#facc15' }} />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>(5.0 Rating Toko)</span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Deskripsi Produk</h3>
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Spesifikasi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                {product.specs.map((spec, i) => {
                  const parts = spec.split(':');
                  const label = parts[0];
                  const value = parts.slice(1).join(':');
                  return (
                    <div key={i} style={{ display: 'flex', gap: '8px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: '13px', color: '#9ca3af', flexShrink: 0, minWidth: '100px' }}>{label}</span>
                      <span style={{ fontSize: '13px', color: '#111827', fontWeight: 600 }}>{value || "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Area */}
            <div style={{ paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Pengadaan B2B</span>
                  <strong style={{ fontSize: '17px', color: '#111827', fontWeight: 700 }}>Hubungi Sales Untuk Penawaran</strong>
                </div>
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Tanpa Minimum Order
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <AddToCartButton
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  category={categoryName}
                  image={product.image}
                />
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', color: '#16a34a', border: '1.5px solid #16a34a', padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
                >
                  <MessageSquare style={{ width: '17px', height: '17px' }} />
                  Tanya via WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
