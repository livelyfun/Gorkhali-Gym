import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Gorkhali Gym — Premium Fitness Club & Training Center | Itahari, Nepal',
  description:
    'Gorkhali Gym is the premier strength, fitness, yoga, and personal training center in Itahari, Koshi Province, Nepal. Modern equipment, expert coaches, and motivating community.',
  openGraph: {
    title: 'Gorkhali Gym — Premium Fitness Club & Training Center | Itahari, Nepal',
    description:
      'Premier strength, conditioning, yoga, and personal training center in Itahari, Koshi Province, Nepal.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gorkhali Gym — Premium Fitness Club | Itahari, Nepal',
    description:
      'Premier strength, conditioning, yoga, and personal training center in Itahari, Koshi Province, Nepal.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
