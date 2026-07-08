import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PT. Selaras Mitra Utama | General Trading & Industrial Supplier Jakarta",
  description: "Supplier industrial terpercaya di Jakarta. Produk K3/PPE, safety footwear, tools & equipment, chemical, dan solusi HR untuk sektor manufaktur, konstruksi, EPC, dan energi. Pengiriman seluruh Indonesia.",
  keywords: "supplier industrial jakarta, supplier K3 jakarta, PPE jakarta, safety shoes, helm safety SNI, tools industrial, general trading jakarta",
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
