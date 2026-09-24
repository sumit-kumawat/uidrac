'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { persistAuth, readAccessToken, readStoredUser } from '@/lib/auth-client';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/auth/me').then((r) => setProfile(r.data.user)).catch(() => setMsg('Failed to load profile'));
  }, []);

  const refreshSession = async () => {
    const token = readAccessToken();
    if (!token) return;
    const { data } = await api.get('/auth/me');
    persistAuth(token, data.user);
    setProfile(data.user);
    setMsg('Account refreshed from server.');
  };

  const stored = readStoredUser();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {msg && <p className="text-sm text-dell-blue mb-4">{msg}</p>}
      <div className="bg-white border border-border-card rounded p-6 max-w-lg space-y-3 text-sm">
        <div><span className="text-text-secondary">Email</span><p className="font-medium">{profile?.email || stored?.email}</p></div>
        <div><span className="text-text-secondary">Role</span><p className="font-medium capitalize">{profile?.role?.toLowerCase() || stored?.role?.toLowerCase()}</p></div>
        <div><span className="text-text-secondary">Organization</span><p className="font-medium">{profile?.tenant?.name || '—'}</p></div>
        <div><span className="text-text-secondary">Last login</span><p className="font-medium">{profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : '—'}</p></div>
        <button type="button" onClick={refreshSession} className="mt-2 px-4 py-2 bg-dell-blue text-white text-sm font-semibold rounded hover:bg-dell-blue-hover">
          Refresh account
        </button>
      </div>
    </>
  );
}
