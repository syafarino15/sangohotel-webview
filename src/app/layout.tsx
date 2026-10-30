import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Sango Hotels | Direct Booking',
  description:
    'Booking engine resmi Sango Hotel Management: Metro Park View Semarang, Manhattan Jakarta, Merlynn Park Jakarta, dan Sunlake Jakarta.',
  applicationName: 'Sango Hotels',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sango Hotels',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#100B07',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={dmSans.variable}>
      <body className="min-h-screen bg-slate-200 font-sans">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-canvas shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}