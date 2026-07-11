"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Do not show main Header & Footer on admin or login pages
  const isAdminOrLogin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminOrLogin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
