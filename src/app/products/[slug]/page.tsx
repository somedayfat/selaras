import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ShieldCheck, CheckCircle2, ArrowLeft, MessageSquare } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import settings from "@/data/settings.json";

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
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      
      {/* Back to Catalog */}
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-xs font-bold text-[#02376C] hover:text-amber-600 transition-colors mb-6 group animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Left Column: Image Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center">
            {product.image ? (
              <img
                src={`/${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/50 p-8 text-slate-400 gap-3 select-none">
                <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-current stroke-[1.2] fill-none opacity-60">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">Catalog Image Placeholder</span>
              </div>
            )}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-500 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">Jaminan 100% produk original berstandar keselamatan industri nasional dengan jaminan kualitas terbaik.</p>
          </div>
        </div>

        {/* Right Column: Information Details */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Badge Category & Brand */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-[#02376C]/10 text-[#02376C] rounded-full font-bold">
              {product.brand}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-semibold">
              {categoryName}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stok Tersedia / Ready Order
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-1.5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-0.5">
              {[...Array(product.rating || 5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-semibold">(5.0 Rating Mitra)</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Deskripsi Produk</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Spesifikasi Detail</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Box */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider text-[9px]">Harga Khusus Mitra B2B</span>
                <strong className="text-slate-900 text-sm font-bold">Hubungi Sales Untuk Penawaran Harga Grosir</strong>
              </div>
              <span className="text-[9px] bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-sky-100 shrink-0 w-fit">
                Pengadaan Cepat & Aman
              </span>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Tanya via WhatsApp (Fast Response)
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
