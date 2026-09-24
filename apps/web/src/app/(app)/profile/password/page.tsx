'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearAuthStorage } from '@/lib/auth-client';

export default function ProfilePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      clearAuthStorage();
      router.push('/login?reason=password-changed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Change password</h1>
      <form onSubmit={submit} className="bg-white border border-border-card rounded p-6 max-w-lg space-y-4">
        {error && <p className="text-sm text-red-critical bg-red-50 border border-red-200 rounded p-3">{error}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">Current password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 border border-border-card rounded text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-3 py-2 border border-border-card rounded text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm new password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="w-full px-3 py-2 border border-border-card rounded text-sm" />
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-dell-blue text-white text-sm font-semibold rounded hover:bg-dell-blue-hover disabled:opacity-50">
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </>
  );
}
