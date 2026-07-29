"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "./CartContext";
import CartDrawer from "./CartDrawer";
import { useSettings } from "./SettingsContext";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { settings } = useSettings();
  
  // Do not show main Header & Footer on admin or login pages
  const isAdminOrLogin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  const dynamicStyles = (
    <style>{`
      :root {
        ${settings?.primaryColor ? `--navy: ${settings.primaryColor}; --navy-dark: ${settings.primaryColor}; --navy-deeper: ${settings.primaryColor};` : ''}
        ${settings?.accentColor ? `--gold: ${settings.accentColor}; --gold-light: ${settings.accentColor};` : ''}
      }
    `}</style>
  );

  if (isAdminOrLogin) {
    return (
      <CartProvider>
        {dynamicStyles}
        <main className="flex-grow">{children}</main>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      {dynamicStyles}
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<div style={{ height: "60px" }} />}>
          <Header />
        </Suspense>
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
