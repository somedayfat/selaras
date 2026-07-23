import { MetadataRoute } from 'next';
import { seoLocations } from '@/data/seoLocations';

const BASE_URL = 'https://smuindustrial.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Main Homepage
  sitemapEntries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // 2. Localized SEO Landing Pages
  seoLocations.forEach((city) => {
    city.districts.forEach((district) => {
      sitemapEntries.push({
        url: `${BASE_URL}/lokasi/${city.slug}/${district.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  return sitemapEntries;
}
