import { MetadataRoute } from 'next';
import { store } from '@/lib/data-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://gorkhaligym.com';
  const lastModified = new Date();

  // Static public routes
  const staticRoutes = [
    '',
    '/about',
    '/training',
    '/services',
    '/membership',
    '/membership/club',
    '/membership/refer-a-friend',
    '/offers',
    '/events',
    '/gallery',
    '/reviews',
    '/team',
    '/blog',
    '/faq',
    '/contact',
    '/apply',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic published training programs & services
  const programRoutes = store.getPrograms(true).map((p) => ({
    url: `${baseUrl}/${p.category === 'service' ? 'services' : 'training'}/${p.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic published offers
  const offerRoutes = store.getOffers(true).map((o) => ({
    url: `${baseUrl}/offers/${o.slug}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Dynamic published events
  const eventRoutes = store.getEvents(true).map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Dynamic published blog posts
  const blogRoutes = store.getBlog(true).map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt || lastModified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...offerRoutes, ...eventRoutes, ...blogRoutes];
}
