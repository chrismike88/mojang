import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mojang-samboja.vercel.app'),
  title: 'MOJANG — Monitoring JTM ULP Samboja',
  description: 'Pusat monitoring pelanggan, beban, dan inspeksi jaringan tegangan menengah ULP Samboja.',
  applicationName: 'MOJANG',
  openGraph: {
    title: 'MOJANG — Monitoring JTM ULP Samboja',
    description: 'Pusat monitoring pelanggan, beban, dan inspeksi jaringan tegangan menengah ULP Samboja.',
    type: 'website',
    locale: 'id_ID',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'MOJANG — Monitoring JTM ULP Samboja' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOJANG — Monitoring JTM ULP Samboja',
    description: 'Pusat monitoring pelanggan dan jaringan tegangan menengah ULP Samboja.',
    images: ['/og.png'],
  },
  icons: { icon: '/og.png', apple: '/og.png' },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
