"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  // Filter States
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync with searchParams
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrands, selectedCategory]);

  // Extract unique brands from all products
  const brands = Array.from(new Set(PRODUCTS.map(p => p.brand)));

  // Filter Products Logic
  const filteredProducts = PRODUCTS.filter(product => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specs.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    // Brand filter
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Category filter
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Paginated Products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedCategory("all");
    setCurrentPage(1);
    router.push('/products');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 font-medium">
        <Link href="/" className="hover:text-sky-700 transition-colors">Beranda</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Katalog Produk</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filter */}
        <aside className="w-full lg:w-72 shrink-0 bg-white border border-slate-100 rounded-2xl p-5 lg:p-6 h-fit space-y-5 lg:space-y-6 shadow-sm">
          {/* Header & Reset */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 font-bold text-sm text-slate-900 hover:text-sky-700 lg:cursor-default"
            >
              <Filter className="w-4 h-4 text-sky-700" /> 
              <span>Filter Produk</span>
              <span className="lg:hidden text-[10px] text-slate-400 font-normal ml-1">
                ({isMobileFilterOpen ? "Sembunyikan" : "Ketuk untuk Buka"})
              </span>
            </button>
            <button 
              onClick={resetFilters} 
              className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Filter content */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMobileFilterOpen ? "max-h-[1200px] opacity-100 pt-4 border-t border-slate-100" : "max-h-0 opacity-0 lg:max-h-[1200px] lg:opacity-100"} lg:block space-y-6`}>
            {/* Search Input in Sidebar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Cari</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-600 text-slate-950"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
              <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsMobileFilterOpen(false);
                    router.push('/products');
                  }}
                  className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === "all" 
                      ? "bg-[#02376C] text-white" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Semua Kategori
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsMobileFilterOpen(false);
                      router.push(`/products?category=${cat.id}`);
                    }}
                    className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === cat.id 
                        ? "bg-[#02376C] text-white" 
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Brand / Produsen</label>
              <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                {brands.map(brand => (
                  <label 
                    key={brand}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-sky-700 focus:ring-sky-700 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <section className="flex-1 space-y-6">
          {/* Active stats bar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Katalog Produk</h1>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan <strong className="text-slate-800">{filteredProducts.length}</strong> produk terbaik dari PT. Selaras Mitra Utama
              </p>
            </div>
          </div>

          {/* Grid Products */}
          {paginatedProducts.length > 0 ? (
            <div className="space-y-10">
              <div className="product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 text-slate-700 disabled:text-slate-300 disabled:border-slate-100 rounded-xl hover:border-[#02376C] hover:text-[#02376C] disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive 
                              ? "bg-[#02376C] text-white" 
                              : "border border-slate-200 text-slate-700 hover:border-[#02376C] hover:text-[#02376C]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 text-slate-700 disabled:text-slate-300 disabled:border-slate-100 rounded-xl hover:border-[#02376C] hover:text-[#02376C] disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-400 text-sm font-semibold">Tidak ditemukan produk yang cocok dengan pencarian atau filter Anda.</p>
              <button 
                onClick={resetFilters} 
                className="mt-4 bg-[#02376C] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-sky-800 transition-all cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 font-bold text-sm">
        Memuat Katalog Produk...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
