import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SettingsProvider } from "@/components/SettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://smuindustrial.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PT. Selaras Mitra Utama | General Trading & Industrial Supplier Jakarta",
    template: "%s | PT. Selaras Mitra Utama",
  },
  description:
    "Supplier industrial terpercaya di Jakarta & Bekasi. Produk K3/PPE, safety footwear SNI, alat teknik, spare parts, electrical, dan solusi HR untuk sektor manufaktur, konstruksi, EPC, dan energi. Pengiriman seluruh Indonesia.",
  keywords: [
    "supplier industrial jakarta",
    "supplier K3 bekasi",
    "PPE jakarta",
    "safety shoes SNI",
    "helm safety",
    "tools industrial",
    "general trading jakarta",
    "supplier karawang",
    "pengadaan industri",
    "PT Selaras Mitra Utama",
  ],
  authors: [{ name: "PT. Selaras Mitra Utama", url: BASE_URL }],
  creator: "PT. Selaras Mitra Utama",
  publisher: "PT. Selaras Mitra Utama",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "PT. Selaras Mitra Utama",
    title: "PT. Selaras Mitra Utama | General Trading & Industrial Supplier",
    description:
      "Supplier industrial terpercaya di Jakarta & Bekasi. K3/PPE, safety footwear SNI, alat teknik, spare parts, electrical supply. Pengiriman seluruh Indonesia.",
    images: [
      {
        url: "/img/logo.png",
        width: 1200,
        height: 630,
        alt: "PT. Selaras Mitra Utama – Industrial Supplier Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Selaras Mitra Utama | General Trading & Industrial Supplier",
    description:
      "Supplier industrial terpercaya di Jakarta & Bekasi. K3/PPE, safety footwear, alat teknik, spare parts, electrical supply.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

import LayoutWrapper from "@/components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <SettingsProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}

