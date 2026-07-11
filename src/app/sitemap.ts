import { MetadataRoute } from 'next';
import { seoLocations } from '@/data/seoLocations';
import { CATEGORIES } from '@/data/categories';
import productsData from '@/data/products.json';

const BASE_URL = 'https://smuindustrial.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  const staticPages = [
    '',
    '/products'
  ];

  staticPages.forEach((route) => {
    sitemapEntries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
    });
  });

  // 2. Categories
  CATEGORIES.forEach((category) => {
    sitemapEntries.push({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 3. Products
  const products = productsData as { slug: string }[];
  products.forEach((product) => {
    sitemapEntries.push({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // 4. Localized SEO Pages
  seoLocations.forEach((city) => {
    city.districts.forEach((district) => {
      sitemapEntries.push({
        url: `${BASE_URL}/lokasi/${city.slug}/${district.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return sitemapEntries;
}
