import productsData from "./products.json";

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  image: string;
  description: string;
  specs: string[];
  isPopular?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  rating?: number;
  colors?: string[];
};

export const PRODUCTS: Product[] = productsData as Product[];
