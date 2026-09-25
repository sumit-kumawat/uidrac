'use client';

import { PlusCircle } from 'lucide-react';
import { useAddServerModal } from '@/components/servers/add-server-modal-context';

/** Primary add-server action for OSS fleet pages (no edge agent). */
export function AddServerHeaderActions({ className = '' }: { className?: string }) {
  const { openAddServer } = useAddServerModal();

  return (
    <button
      type="button"
      onClick={openAddServer}
      className={`px-4 py-2 bg-dell-blue text-white text-sm font-semibold rounded hover:bg-dell-blue-hover transition-colors flex items-center gap-1.5 ${className}`}
    >
      <PlusCircle className="w-4 h-4" /> Add Server
    </button>
  );
}
