/** public-footer.tsx — Shared footer for all pages. */
'use client';

import Link from 'next/link';
import { APP_VERSION_LABEL } from '@idrac/shared';
import PageContainer from './page-container';

export default function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-border-card py-4 shrink-0">
      <PageContainer>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-secondary">
          <div className="flex items-center gap-1 shrink-0 flex-wrap justify-center sm:justify-start">
            <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="iDRAC Console" className="h-4 opacity-50" />
              <span className="ml-1">Universal iDRAC Console</span>
            </Link>
            <Link href="/versions" className="text-dell-blue hover:underline">
              {APP_VERSION_LABEL}
            </Link>
          </div>
          <span className="text-center sm:text-right">
            &copy; {year}{' '}
            <a href="https://www.sumitkumawat.com" className="text-dell-blue hover:underline">
              Sumit Kumawat
            </a>
            · MIT License
          </span>
        </div>
      </PageContainer>
    </footer>
  );
}
