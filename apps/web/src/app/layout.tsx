import './globals.css';
import type { Metadata } from 'next';
import { PRODUCT_NAME } from '@idrac/shared';
import ClientProviders from '@/components/layout/client-providers';

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: 'Open-source, self-hosted web platform for Dell PowerEdge iDRAC 6–9',
  icons: { icon: '/favicon.png' },
  authors: [{ name: 'Sumit Kumawat', url: 'https://www.sumitkumawat.com' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-body">
        <div id="app-modal-root" />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
