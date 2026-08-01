"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowLeft,
  AlertCircle,
  LayoutDashboard,
  ShoppingBag,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Save,
  X,
  CheckCircle,
  FileText,
  Smartphone,
  MapPin,
  RefreshCw,
  Sliders,
  Globe,
  Menu
} from "lucide-react";
import { Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useSettings } from "@/components/SettingsContext";
import LandingPageSettings from "@/components/admin/LandingPageSettings";

export default function AdminDashboardPage() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "settings">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Products CRUD State
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    category: "a",
    image: "",
    description: "",
    specs: [""] as string[],
    isPopular: false,
    isNew: false,
    rating: 5
  });

  // Settings State & context
  const { settings, refreshSettings } = useSettings();
  const [settingsForm, setSettingsForm] = useState({
    shopName: "",
    companyName: "",
    address: "",
    googleMapsUrl: "",
    primaryWhatsapp: "",
    phoneNumbers: [""] as string[],
    email: "",
    heroBadge: "",
    heroTitle: "",
    heroTitleAccent: "",
    heroSubtitle: "",
    // Landing Page
    stats: [] as { number: string; suffix: string; label: string }[],
    aboutTitle: "",
    aboutText: [] as string[],
    aboutKeys: [] as string[],
    visiText: "",
    misi: [] as { num: string; title: string; desc: string }[],
    services: [] as string[],
    advantages: [] as { iconClass: string; title: string; desc: string; iconName: string }[],
    heroTrust: [] as string[],
    heroCardBrand: "",
    heroCardImage: "",
    heroCardText: "",
    heroCardChips: [] as string[],
    heroCardFooter: "",
    aboutImage: "",
    aboutBadge: "",
    sectors: [] as string[],
    salesHotlines: [] as string[],
    headOffice: "",
    repOffice: "",
    footerDesc: "",
    footerBadge: "",
    footerBrands: [] as string[],
    businessHours: "",
    officePhone: "",
    primaryColor: "",
    accentColor: ""
  });

  // Status Alerts
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Check login session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("selaras_admin_logged");
    if (session === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch products list
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      if (settings) {
        setSettingsForm({
          shopName: settings.shopName || "",
          companyName: settings.companyName || "",
          address: settings.address || "",
          googleMapsUrl: settings.googleMapsUrl || "",
          primaryWhatsapp: settings.primaryWhatsapp || "",
          phoneNumbers: settings.phoneNumbers ? [...settings.phoneNumbers] : [""],
          email: settings.email || "",
          heroBadge: settings.heroBadge || "",
          heroTitle: settings.heroTitle || "",
          heroTitleAccent: settings.heroTitleAccent || "",
          heroSubtitle: settings.heroSubtitle || "",
          stats: settings.stats ? [...settings.stats] : [],
          aboutTitle: settings.aboutTitle || "",
          aboutText: settings.aboutText ? [...settings.aboutText] : [],
          aboutKeys: settings.aboutKeys ? [...settings.aboutKeys] : [],
          visiText: settings.visiText || "",
          misi: settings.misi ? [...settings.misi] : [],
          services: settings.services ? [...settings.services] : [],
          advantages: settings.advantages ? [...settings.advantages] : [],
          heroTrust: settings.heroTrust ? [...settings.heroTrust] : [],
          heroCardBrand: settings.heroCardBrand || "",
          heroCardImage: settings.heroCardImage || "",
          heroCardText: settings.heroCardText || "",
          heroCardChips: settings.heroCardChips ? [...settings.heroCardChips] : [],
          heroCardFooter: settings.heroCardFooter || "",
          aboutImage: settings.aboutImage || "",
          aboutBadge: settings.aboutBadge || "",
          sectors: settings.sectors ? [...settings.sectors] : [],
          salesHotlines: settings.salesHotlines ? [...settings.salesHotlines] : [],
          headOffice: settings.headOffice || "",
          repOffice: settings.repOffice || "",
          footerDesc: settings.footerDesc || "",
          footerBadge: settings.footerBadge || "",
          footerBrands: settings.footerBrands ? [...settings.footerBrands] : [],
          businessHours: settings.businessHours || "",
          officePhone: settings.officePhone || "",
          primaryColor: settings.primaryColor || "#02376C",
          accentColor: settings.accentColor || "#D4870A"
        });
      }
    }
  }, [isLoggedIn, settings]);

  // Handle Login submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        sessionStorage.setItem("selaras_admin_logged", "true");
      } else {
        setLoginError(data.error || "Email atau password administrator salah.");
      }
    } catch (err) {
      setLoginError("Terjadi kesalahan koneksi.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setIsLoggedIn(false);
    sessionStorage.removeItem("selaras_admin_logged");
  };

  // Trigger alert banner
  const triggerAlert = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
  };

  // Open product editor for ADD
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setUploadError("");
    setProductForm({
      name: "",
      brand: "",
      category: "a",
      image: "",
      description: "",
      specs: ["Spesifikasi 1"],
      isPopular: false,
      isNew: true,
      rating: 5
    });
    setIsProductModalOpen(true);
  };

  // Open product editor for EDIT
  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setUploadError("");
    setProductForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      description: product.description,
      specs: product.specs && product.specs.length > 0 ? [...product.specs] : [""],
      isPopular: !!product.isPopular,
      isNew: !!product.isNew,
      rating: product.rating || 5
    });
    setIsProductModalOpen(true);
  };

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setIsUploadingImage(true);
    setUploadError("");

    try {
      // Client-Side Image Compression
      const compressedFile = await new Promise<File>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height && width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            } else if (height > MAX_WIDTH && height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
            }

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  });
                  resolve(newFile);
                } else {
                  reject(new Error("Gagal mengkompresi gambar."));
                }
              },
              "image/jpeg",
              0.7
            );
          };
          img.onerror = () => reject(new Error("File gambar rusak."));
        };
        reader.onerror = () => reject(new Error("Gagal membaca file."));
      });

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProductForm((prev) => ({ ...prev, image: data.url }));
        triggerAlert("success", "Gambar berhasil diupload!");
      } else {
        const err = await res.json();
        setUploadError(err.error || "Gagal mengupload gambar.");
      }
    } catch (err) {
      setUploadError("Kesalahan koneksi saat upload.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedSpecs = productForm.specs.filter(s => s.trim() !== "");
    const payload = {
      ...productForm,
      specs: cleanedSpecs,
      id: editingProduct ? editingProduct.id : undefined
    };

    try {
      const res = await fetch("/api/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        triggerAlert("success", editingProduct ? "Produk berhasil diperbarui!" : "Produk baru berhasil ditambahkan!");
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        triggerAlert("error", data.error || "Gagal menyimpan produk.");
      }
    } catch (err) {
      triggerAlert("error", "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (res.ok && data.success) {
        triggerAlert("success", "Produk berhasil dihapus!");
        fetchProducts();
      } else {
        triggerAlert("error", data.error || "Gagal menghapus produk.");
      }
    } catch (err) {
      triggerAlert("error", "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedPhoneNumbers = settingsForm.phoneNumbers.filter(p => p.trim() !== "");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settingsForm,
          phoneNumbers: cleanedPhoneNumbers
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        triggerAlert("success", "Pengaturan situs berhasil diperbarui!");
        refreshSettings();
      } else {
        triggerAlert("error", data.error || "Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      triggerAlert("error", "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Spec Input Management
  const handleSpecChange = (index: number, value: string) => {
    const updated = [...productForm.specs];
    updated[index] = value;
    setProductForm(prev => ({ ...prev, specs: updated }));
  };

  const addSpecField = () => {
    setProductForm(prev => ({ ...prev, specs: [...prev.specs, ""] }));
  };

  const removeSpecField = (index: number) => {
    if (productForm.specs.length <= 1) {
      setProductForm(prev => ({ ...prev, specs: [""] }));
      return;
    }
    setProductForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  };

  // Phone number input list management
  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...settingsForm.phoneNumbers];
    updated[index] = value;
    setSettingsForm(prev => ({ ...prev, phoneNumbers: updated }));
  };

  const addPhoneField = () => {
    setSettingsForm(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ""] }));
  };

  const removePhoneField = (index: number) => {
    if (settingsForm.phoneNumbers.length <= 1) {
      setSettingsForm(prev => ({ ...prev, phoneNumbers: [""] }));
      return;
    }
    setSettingsForm(prev => ({ ...prev, phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index) }));
  };

  // Filter products by search term
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div 
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box"
        }}
      >
        {/* Abstract Background Accents */}
        <div style={{ position: "absolute", top: 0, left: "-40px", width: "384px", height: "384px", backgroundColor: "rgba(2, 55, 108, 0.4)", borderRadius: "9999px", filter: "blur(120px)", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", bottom: 0, right: "-40px", width: "384px", height: "384px", backgroundColor: "rgba(212, 135, 10, 0.2)", borderRadius: "9999px", filter: "blur(120px)", pointerEvents: "none" }}></div>

        <div 
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "40px 32px",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            boxSizing: "border-box"
          }}
        >
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Link 
              href="/" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#94a3b8",
                textDecoration: "none",
                marginBottom: "20px",
                transition: "color 0.2s"
              }}
              className="hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Website
            </Link>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.5px", margin: 0 }}>CMS ADMINISTRATOR</h1>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px", margin: 0 }}>PT. Selaras Mitra Utama — Control Panel</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {loginError && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "12px", padding: "14px", borderRadius: "12px", display: "flex", gap: "10px" }}>
                <AlertCircle className="w-4 h-4 shrink-0" style={{ marginTop: "2px" }} />
                <span>{loginError}</span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px" }}>Email Administrator</label>
              <div style={{ position: "relative" }}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "12px 16px 12px 48px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "10px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "12px 16px 12px 48px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#D4870A",
                border: "none",
                borderRadius: "12px",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(212,135,10,0.3)"
              }}
            >
              Sign In ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  // LOGGED IN DASHBOARD
  return (
    <div 
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        fontFamily: "Inter, system-ui, sans-serif",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-overlay {
            display: none !important;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            z-index: 40;
            backdrop-filter: blur(2px);
          }
          .admin-overlay.open {
            display: block !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .admin-header-title {
            font-size: 16px !important;
          }
          .admin-main-wrapper {
            padding: 16px !important;
          }
          .admin-main-header {
            padding: 16px !important;
          }
        }
        .admin-overlay {
          display: none;
        }
        .mobile-menu-btn {
          display: none;
        }
      `}</style>
      
      <div className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar Navigation */}
      <aside 
        className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          width: "260px",
          minWidth: "260px",
          backgroundColor: "#0f172a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid #1e293b",
          boxSizing: "border-box",
          flexShrink: 0
        }}
      >
        <div>
          {/* Brand header */}
          <div 
            style={{
              padding: "24px",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box"
            }}
          >
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0, color: "#fff" }}>CMS PANEL</h2>
              <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", display: "block" }}>PT. Selaras Mitra Utama</span>
            </div>
            <Link 
              href="/" 
              target="_blank"
              suppressHydrationWarning
              style={{
                padding: "8px",
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                color: "#cbd5e1",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
              title="Lihat Website"
            >
              <Globe className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav items */}
          <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
            <button
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                backgroundColor: activeTab === "dashboard" ? "#D4870A" : "transparent",
                color: activeTab === "dashboard" ? "#fff" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                backgroundColor: activeTab === "products" ? "#D4870A" : "transparent",
                color: activeTab === "products" ? "#fff" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              <ShoppingBag className="w-4 h-4" /> Katalog Produk
            </button>
            <button
              onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                backgroundColor: activeTab === "settings" ? "#D4870A" : "transparent",
                color: activeTab === "settings" ? "#fff" : "#94a3b8",
                transition: "all 0.2s"
              }}
            >
              <SettingsIcon className="w-4 h-4" /> Pengaturan Web
            </button>
          </nav>
        </div>

        {/* Footer Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid #1e293b", boxSizing: "border-box" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "none",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "11px",
              fontWeight: 800,
              color: "#f87171",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", boxSizing: "border-box", minWidth: 0 }}>
        {/* Top Header */}
        <header 
          className="admin-main-header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e2e8f0",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              className="mobile-menu-btn"
              style={{
                padding: "8px",
                backgroundColor: "#f1f5f9",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569"
              }}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="admin-header-title" style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.5px", margin: 0, color: "#1e293b" }}>
                {activeTab === "dashboard" && "Dashboard Administrator"}
                {activeTab === "products" && "Katalog Produk Supplier"}
                {activeTab === "settings" && "Pengaturan Kontak & Toko"}
              </h1>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, marginTop: "4px" }}>Sistem Pengelolaan Konten Pengadaan B2B</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isLoading && (
              <span className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#D4870A", fontWeight: 700 }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sinkronisasi data...
              </span>
            )}
            <span className="desktop-only" style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>Admin</span>
            <div style={{ width: "36px", height: "36px", backgroundColor: "#D4870A", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "14px" }}>A</div>
          </div>
        </header>

        {/* Dynamic Alerts Banner */}
        {statusMessage.text && (
          <div style={{ 
            padding: "14px 32px", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            borderBottom: "1px solid",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            ...(statusMessage.type === "success" ? {
              backgroundColor: "#ecfdf5",
              borderColor: "#a7f3d0",
              color: "#065f46"
            } : {
              backgroundColor: "#fef2f2",
              borderColor: "#fecaca",
              color: "#991b1b"
            })
          }}>
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="admin-main-wrapper" style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "24px", boxSizing: "border-box", width: "100%" }}>
          
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                
                {/* Total Product Card */}
                <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Produk</span>
                    <h3 style={{ fontSize: "32px", fontWeight: 900, color: "#1e293b", margin: 0, lineHeight: 1 }}>{products.length}</h3>
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#f0f9ff", color: "#02376C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* Category Card */}
                <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kategori Produk</span>
                    <h3 style={{ fontSize: "32px", fontWeight: 900, color: "#1e293b", margin: 0, lineHeight: 1 }}>{CATEGORIES.length}</h3>
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#fffbeb", color: "#D4870A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sliders className="w-5 h-5" />
                  </div>
                </div>

                {/* Whatsapp Card */}
                <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>No. WhatsApp Utama</span>
                    <h3 style={{ fontSize: "16px", fontWeight: 900, color: "#1e293b", margin: 0, marginTop: "6px" }}>{settings?.primaryWhatsapp}</h3>
                  </div>
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Quick Info Guides */}
              <div 
                style={{ 
                  background: "linear-gradient(135deg, #02376C 0%, #011E3D 100%)", 
                  color: "#fff", 
                  padding: "32px", 
                  borderRadius: "24px", 
                  boxShadow: "0 10px 15px -3px rgba(2, 55, 108, 0.15)", 
                  border: "1px solid #012E5A", 
                  position: "relative", 
                  overflow: "hidden",
                  boxSizing: "border-box"
                }}
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0 }}>Panduan Pengelolaan CMS</h3>
                  <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6", margin: 0 }}>
                    Situs web ini didukung oleh file JSON statis untuk menjamin performa cepat dan keandalan tinggi. Ketika Anda melakukan perubahan pada produk atau info kontak (settings), sistem akan menyimpan data tersebut secara lokal, kemudian otomatis mendorongnya ke repositori GitHub. Cloudflare Pages akan membangun ulang (redeploy) situs Anda dalam 2-3 menit secara otomatis.
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
                    <button 
                      onClick={() => setActiveTab("products")} 
                      style={{ 
                        backgroundColor: "#D4870A", 
                        color: "#fff", 
                        padding: "10px 20px", 
                        borderRadius: "10px", 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        border: "none", 
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.15)"
                      }}
                    >
                      Kelola Produk
                    </button>
                    <button 
                      onClick={() => setActiveTab("settings")} 
                      style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#fff", 
                        padding: "10px 20px", 
                        borderRadius: "10px", 
                        fontSize: "11px", 
                        fontWeight: 700, 
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}
                    >
                      Edit Pengaturan Toko
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", overflow: "hidden" }}>
              {/* Product control header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", boxSizing: "border-box" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari produk berdasarkan nama, brand, atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px 12px 44px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                </div>
                <button
                  onClick={handleAddProductClick}
                  style={{
                    backgroundColor: "#02376C",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  <Plus className="w-4 h-4" /> Tambah Produk Baru
                </button>
              </div>

              {/* Table list */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", width: "80px" }}>Foto</th>
                      <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#64748b" }}>Nama & Brand</th>
                      <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", width: "180px" }}>Kategori</th>
                      <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", width: "140px" }}>Status</th>
                      <th style={{ padding: "16px 24px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", width: "120px", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "13px", color: "#334155" }}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => {
                        const cat = CATEGORIES.find(c => c.id === p.category);
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} className="hover:bg-slate-50/50">
                            <td style={{ padding: "16px 24px", verticalAlign: "middle" }}>
                              <div style={{ width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {p.image ? (
                                  <img src={p.image.startsWith("data:") || p.image.startsWith("http") || p.image.startsWith("/") ? p.image : `/${p.image}`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <FileText className="w-5 h-5 text-slate-300" />
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px", verticalAlign: "middle" }}>
                              <strong style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", display: "block", marginBottom: "4px" }}>{p.name}</strong>
                              <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#94a3b8" }}>{p.brand}</span>
                            </td>
                            <td style={{ padding: "16px 24px", verticalAlign: "middle", color: "#64748b", fontWeight: 500 }}>
                              {cat ? cat.name : `Kategori (${p.category})`}
                            </td>
                            <td style={{ padding: "16px 24px", verticalAlign: "middle" }}>
                              {p.isPopular && <span style={{ display: "inline-block", backgroundColor: "#fffbeb", border: "1px solid #fde68a", color: "#b45309", fontSize: "9px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "9999px", marginRight: "4px" }}>Populer</span>}
                              {p.isNew && <span style={{ display: "inline-block", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: "9px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "9999px" }}>Baru</span>}
                            </td>
                            <td style={{ padding: "16px 24px", verticalAlign: "middle" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                                <button
                                  onClick={() => handleEditProductClick(p)}
                                  style={{
                                    padding: "8px",
                                    backgroundColor: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#475569"
                                  }}
                                  title="Edit Produk"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  style={{
                                    padding: "8px",
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#ef4444"
                                  }}
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>
                          Tidak ada produk yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS EDITOR */}
          {activeTab === "settings" && (
            <div style={{ maxWidth: "800px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", padding: "32px", boxSizing: "border-box" }}>
              <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Nama Toko / CMS</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.shopName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, shopName: e.target.value }))}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#334155",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Nama Perusahaan Resmi (Legal)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.companyName}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, companyName: e.target.value }))}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#334155",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Warna Utama (Primary Color)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={settingsForm.primaryColor || "#02376C"}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        style={{ width: "50px", height: "42px", padding: "0", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}
                      />
                      <input
                        type="text"
                        value={settingsForm.primaryColor || "#02376C"}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        style={{ flexGrow: 1, backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Warna Aksen (Accent Color)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="color"
                        value={settingsForm.accentColor || "#D4870A"}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, accentColor: e.target.value }))}
                        style={{ width: "50px", height: "42px", padding: "0", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer" }}
                      />
                      <input
                        type="text"
                        value={settingsForm.accentColor || "#D4870A"}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, accentColor: e.target.value }))}
                        style={{ flexGrow: 1, backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Email Kontak</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#334155",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>WhatsApp Utama (Satu nomor, tanpa spasi/simbol)</label>
                    <input
                      type="text"
                      required
                      placeholder="6281991579265"
                      value={settingsForm.primaryWhatsapp}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, primaryWhatsapp: e.target.value }))}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#334155",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Telephone List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Daftar Nomor Telepon Toko/Sales</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {settingsForm.phoneNumbers.map((phone, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="text"
                          placeholder="Contoh: +62 819-9157-9265"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                          style={{
                            flexGrow: 1,
                            boxSizing: "border-box",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: "#334155",
                            outline: "none"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          style={{
                            padding: "12px",
                            backgroundColor: "#fef2f2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "12px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPhoneField}
                      style={{
                        width: "fit-content",
                        backgroundColor: "#f8fafc",
                        color: "#02376C",
                        border: "1px solid #cbd5e1",
                        padding: "10px 16px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Plus className="w-4 h-4" /> Tambah Nomor Telepon
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Alamat Kantor/Toko Lengkap</label>
                  <textarea
                    rows={3}
                    required
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "#334155",
                      outline: "none",
                      resize: "none",
                      lineHeight: "1.6"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Head Office</label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan alamat Head Office..."
                      value={settingsForm.headOffice}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, headOffice: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Representative Office</label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan alamat Representative Office (jika ada)..."
                      value={settingsForm.repOffice}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, repOffice: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Nomor Telepon Kantor (Office)</label>
                    <input
                      type="text"
                      placeholder="Contoh: (021) 1234567"
                      value={settingsForm.officePhone}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, officePhone: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Jam Operasional (Business Hours)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Senin - Jumat (08:00 - 17:00)"
                    value={settingsForm.businessHours}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, businessHours: e.target.value }))}
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Sales Hotlines (Pisahkan dengan Enter)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: 08123456789 (Sales 1)&#10;08987654321 (Sales 2)"
                    value={(settingsForm.salesHotlines || []).join('\n')}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, salesHotlines: e.target.value.split('\n').filter(Boolean) }))}
                    style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", outline: "none", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Google Maps Embed/Share URL (Opsional)</label>
                  <input
                    type="text"
                    placeholder="https://google.com/maps/..."
                    value={settingsForm.googleMapsUrl}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Hero Settings */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Pengaturan Teks Hero Banner</label>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Teks Badge (Kecil di Atas)</label>
                        <input
                          type="text"
                          value={settingsForm.heroBadge}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, heroBadge: e.target.value }))}
                          placeholder="General Trading & Industrial Supplier"
                          style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#334155", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Judul Utama (Awal)</label>
                        <input
                          type="text"
                          value={settingsForm.heroTitle}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                          placeholder="Solusi Pengadaan Material Industri & Proyek Secara"
                          style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#334155", outline: "none" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Judul Aksen (Warna Berbeda)</label>
                        <input
                          type="text"
                          value={settingsForm.heroTitleAccent}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, heroTitleAccent: e.target.value }))}
                          placeholder="Cepat, Tepat & Kompetitif."
                          style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#334155", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                      <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Sub-judul (Deskripsi)</label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroSubtitle}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                        placeholder="Mendukung kebutuhan pabrik..."
                        style={{ width: "100%", boxSizing: "border-box", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#334155", outline: "none", resize: "none", lineHeight: "1.6" }}
                      />
                    </div>
                  </div>
                </div>

                {/* LANDING PAGE SETTINGS COMPONENT */}
                <div style={{ paddingTop: "24px", marginTop: "12px", borderTop: "2px dashed #e2e8f0" }}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Pengaturan Landing Page (Beranda)</h2>
                  <LandingPageSettings settingsForm={settingsForm} setSettingsForm={setSettingsForm} />
                </div>

                <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#02376C",
                      color: "#fff",
                      padding: "12px 28px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    <Save className="w-4 h-4" /> Simpan Pengaturan
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* PRODUCT EDITOR MODAL */}
      {isProductModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "640px", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", maxHeight: "90vh", boxSizing: "border-box" }}>
            {/* Modal header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f8fafc", boxSizing: "border-box" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0, color: "#1e293b" }}>
                  {editingProduct ? "Edit Informasi Produk" : "Tambah Produk Baru"}
                </h3>
                <p style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", margin: 0 }}>Lengkapi form di bawah untuk mengubah katalog.</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{
                  padding: "6px",
                  backgroundColor: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  color: "#64748b",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body (Scrollable) */}
            <form onSubmit={handleSaveProduct} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Nama Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gosave Safety Shoes Beta"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Brand / Merek</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: GOSAVE"
                    value={productForm.brand}
                    onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Kategori</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Rating (Bintang)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={productForm.rating}
                    onChange={(e) => setProductForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Foto Produk</label>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="Direktori file (Contoh: img/p3_img1.jpeg) atau link eksternal"
                    value={productForm.image}
                    onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                    style={{
                      flex: 1,
                      minWidth: "200px",
                      boxSizing: "border-box",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "12px",
                      color: "#334155",
                      outline: "none"
                    }}
                  />
                  <div style={{ position: "relative" }}>
                    <input
                      type="file"
                      id="product-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="product-image-upload"
                      style={{
                        display: "inline-block",
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#475569",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                    >
                      {isUploadingImage ? "Uploading..." : "Pilih File"}
                    </label>
                  </div>
                </div>
                {uploadError && <p style={{ fontSize: "10px", color: "#ef4444", fontWeight: 700, margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle className="w-3.5 h-3.5" /> {uploadError}</p>}
                {productForm.image && (
                  <div style={{ marginTop: "8px", width: "80px", height: "80px", borderRadius: "12px", border: "1px solid #cbd5e1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
                    <img src={productForm.image.startsWith("data:") || productForm.image.startsWith("http") || productForm.image.startsWith("/") ? productForm.image : `/${productForm.image}`} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Deskripsi Lengkap Produk</label>
                <textarea
                  rows={4}
                  placeholder="Berikan keterangan detail mengenai keunggulan, penggunaan, dan standar produk..."
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "12px",
                    color: "#334155",
                    outline: "none",
                    resize: "none",
                    lineHeight: "1.6"
                  }}
                />
              </div>

              {/* Dynamic specs bullet list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>Daftar Spesifikasi Detail (Poin-poin)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {productForm.specs.map((spec, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Contoh: Bahan Kulit Kerbau Asli"
                        value={spec}
                        onChange={(e) => handleSpecChange(index, e.target.value)}
                        style={{
                          flexGrow: 1,
                          boxSizing: "border-box",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #cbd5e1",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          fontSize: "12px",
                          color: "#334155",
                          outline: "none"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        style={{
                          padding: "12px",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          border: "1px solid #fecaca",
                          borderRadius: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpecField}
                    style={{
                      width: "fit-content",
                      backgroundColor: "#f8fafc",
                      color: "#02376C",
                      border: "1px solid #cbd5e1",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Plus className="w-4 h-4" /> Tambah Poin Spesifikasi
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", paddingTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#475569", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Tampilkan di Produk Populer (Homepage)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#475569", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  Tampilkan Badge Baru (New Tag)
                </label>
              </div>

              {/* Modal footer */}
              <div style={{ padding: "20px 24px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", margin: "16px -24px -24px -24px", boxSizing: "border-box" }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#02376C",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  <Save className="w-4 h-4" /> {editingProduct ? "Simpan Perubahan" : "Simpan Produk"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
