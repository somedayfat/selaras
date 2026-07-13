"use client";

import { useCart } from "./CartContext";
import { ShoppingBasket } from "lucide-react";

type AddToCartButtonProps = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
  variant?: "primary" | "outline";
};

export default function AddToCartButton({ slug, name, brand, category, image, variant = "primary" }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ slug, name, brand, category, image });
  };

  if (variant === "outline") {
    return (
      <button
        onClick={handleAdd}
        style={{
          flex: 1, minWidth: "160px", display: "flex", alignItems: "center", justifyContent: "center",
          gap: "8px", background: "#fff", color: "#02376C", border: "1.5px solid #02376C",
          padding: "14px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
          cursor: "pointer", transition: "background 0.2s"
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#eff6ff")}
        onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
      >
        <ShoppingBasket style={{ width: "17px", height: "17px" }} />
        + Keranjang Penawaran
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      style={{
        flex: 1, minWidth: "160px", display: "flex", alignItems: "center", justifyContent: "center",
        gap: "8px", background: "#02376C", color: "#fff",
        padding: "14px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 700,
        cursor: "pointer", border: "none", transition: "background 0.2s"
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#012b54")}
      onMouseLeave={e => (e.currentTarget.style.background = "#02376C")}
    >
      <ShoppingBasket style={{ width: "17px", height: "17px" }} />
      + Keranjang Penawaran
    </button>
  );
}
