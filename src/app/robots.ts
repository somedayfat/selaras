import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login/', '/products/', '/categories/', '/img/'],
      },
      {
        userAgent: 'Googlebot-Image',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://smuindustrial.com/sitemap.xml',
  };
}
