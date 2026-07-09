import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter products belonging to this category
  const filteredProducts = PRODUCTS.filter((p) => p.category === category.id);

  // Pagination Settings (12 products per page)
  const itemsPerPage = 12;
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || "1"));
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      
      {/* Back button */}
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-xs font-bold text-[#02376C] hover:text-amber-600 transition-colors mb-8 group"
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Lihat Semua Kategori & Produk
      </Link>

      {/* Header Info */}
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
        <span className="section-tag">Kategori Produk</span>
        <h2 className="section-title">{category.name}</h2>
        <p className="section-sub" style={{ margin: '8px 0 0 0', maxWidth: '100%', fontSize: '14px', lineHeight: '1.6' }}>
          {category.description}
        </p>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="space-y-10">
          <div className="product-grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
              {currentPage > 1 ? (
                <Link
                  href={`/categories/${slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 border border-slate-200 hover:border-[#02376C] hover:text-[#02376C] text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span className="px-4 py-2 border border-slate-100 text-slate-300 text-xs font-bold rounded-xl cursor-not-allowed">
                  Sebelumnya
                </span>
              )}

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/categories/${slug}?page=${pageNum}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#02376C] text-white"
                          : "border border-slate-200 text-slate-700 hover:border-[#02376C] hover:text-[#02376C]"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages ? (
                <Link
                  href={`/categories/${slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 border border-slate-200 hover:border-[#02376C] hover:text-[#02376C] text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Selanjutnya
                </Link>
              ) : (
                <span className="px-4 py-2 border border-slate-100 text-slate-300 text-xs font-bold rounded-xl cursor-not-allowed">
                  Selanjutnya
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <p className="text-slate-400 text-sm font-semibold">Belum ada produk yang ditambahkan ke kategori ini.</p>
          <Link
            href="/products"
            className="mt-4 bg-[#02376C] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-sky-850 transition-all inline-block"
          >
            Lihat Semua Produk
          </Link>
        </div>
      )}
    </div>
  );
}
