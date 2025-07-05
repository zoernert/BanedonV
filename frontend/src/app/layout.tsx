import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientThemeProvider } from '@/components/providers/client-theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BanedonV - Enterprise Knowledge Management',
  description: 'Premium knowledge management platform for enterprise teams',
  keywords: ['knowledge management', 'enterprise', 'collaboration', 'documents'],
  authors: [{ name: 'BanedonV Team' }],
  creator: 'BanedonV',
  metadataBase: new URL('https://banedonv.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://banedonv.com',
    title: 'BanedonV - Enterprise Knowledge Management',
    description: 'Premium knowledge management platform for enterprise teams',
    siteName: 'BanedonV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BanedonV - Enterprise Knowledge Management',
    description: 'Premium knowledge management platform for enterprise teams',
    creator: '@banedonv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
