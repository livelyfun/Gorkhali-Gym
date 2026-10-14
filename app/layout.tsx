import type {Metadata} from 'next';
import './globals.css';
import { store } from '@/lib/data-store';
import { getSiteUrl } from '@/lib/site-url';

const baseUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const settings = store.getSettings();
  const title = settings.metaTitle || 'Gorkhali Gym — Premium Fitness Club & Training Center | Itahari, Nepal';
  const description =
    settings.metaDescription ||
    'Gorkhali Gym is the premier strength, fitness, yoga, and personal training center in Itahari, Koshi Province, Nepal. Modern equipment, expert coaches, and motivating community.';
  const ogImage = settings.logoUrl || '/icon.png';

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: baseUrl,
      siteName: settings.gymName || 'Gorkhali Gym',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
      apple: settings.faviconUrl || '/icon.png',
    },
  };
}

function buildJsonLd() {
  const settings = store.getSettings();
  const sameAs = [settings.facebookUrl, settings.instagramUrl, settings.tiktokUrl].filter(
    (url): url is string => Boolean(url)
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: settings.gymName || 'Gorkhali Gym',
    description:
      settings.metaDescription ||
      'Premier strength, conditioning, and fitness facility in Itahari, Koshi Province, Nepal.',
    url: baseUrl,
    telephone: settings.phone,
    email: settings.contactEmail || undefined,
    image: settings.logoUrl || undefined,
    hasMap: settings.mapUrl || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Itahari',
      addressRegion: 'Koshi Province',
      addressCountry: 'NP',
    },
    openingHours: settings.openingHours,
    sameAs,
    priceRange: '₨₨',
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = buildJsonLd();

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
