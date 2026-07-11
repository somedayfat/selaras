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
        <aside 
          className="shrink-0 bg-white rounded-[24px] h-fit shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/80 overflow-hidden flex flex-col"
          style={{ width: '300px', minWidth: '300px' }}
        >
          {/* Header Area */}
          <div 
            className="border-b border-slate-100 bg-slate-50/60 flex items-center justify-between"
            style={{ padding: '18px 20px' }}
          >
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2.5 font-extrabold text-sm text-slate-800 lg:cursor-default"
            >
              <div className="bg-sky-100 p-1.5 rounded-lg">
                <Filter className="w-4 h-4 text-sky-700" /> 
              </div>
              <span>Filter Katalog</span>
              <span className="lg:hidden text-[10px] text-slate-400 font-normal ml-1 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {isMobileFilterOpen ? "Tutup" : "Buka"}
              </span>
            </button>
            <button 
              onClick={resetFilters} 
              className="text-[11px] font-bold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200 hover:border-amber-200 shadow-sm"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Filter Body Content */}
          <div className={`transition-all duration-300 ease-in-out ${isMobileFilterOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0 lg:max-h-[1500px] lg:opacity-100"} lg:block`}>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Search Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Pencarian</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Cari nama produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#02376C]/20 focus:border-[#02376C] transition-all"
                  />
                  <div className="absolute right-2.5 top-2.5 p-1 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:border-sky-200 transition-colors">
                    <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#02376C]" />
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kategori Produk</label>
                <div className="flex flex-col max-h-[300px] overflow-y-auto pr-1 scrollbar-none" style={{ gap: '4px' }}>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsMobileFilterOpen(false);
                      router.push('/products');
                    }}
                    className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                      selectedCategory === "all" 
                        ? "bg-[#02376C] text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    {selectedCategory === "all" && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                  
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileFilterOpen(false);
                        router.push(`/products?category=${cat.id}`);
                      }}
                      className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-between group ${
                        selectedCategory === cat.id 
                          ? "bg-[#02376C] text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="line-clamp-1">{cat.name}</span>
                      {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Section */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Filter Brand</label>
                <div className="flex flex-col max-h-[200px] overflow-y-auto pr-1 scrollbar-none" style={{ gap: '2px' }}>
                  {brands.map(brand => (
                    <label 
                      key={brand}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-[#02376C] focus:ring-[#02376C] w-3.5 h-3.5 cursor-pointer border-slate-300"
                      />
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900">{brand}</span>
                    </label>
                  ))}
                </div>
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
