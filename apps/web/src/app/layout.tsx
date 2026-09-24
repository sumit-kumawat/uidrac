import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Universal iDRAC Console',
  description: 'Open-source, self-hosted web platform for Dell PowerEdge iDRAC 6–9',
  icons: { icon: '/favicon.png' },
  authors: [{ name: 'Sumit Kumawat', url: 'https://www.sumitkumawat.com' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-body">{children}</body>
    </html>
  );
}
