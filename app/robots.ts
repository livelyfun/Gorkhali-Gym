import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://gorkhaligym.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/gorkhali-gym-management', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
