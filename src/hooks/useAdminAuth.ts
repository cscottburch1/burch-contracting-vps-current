'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithTimeout, isAbortLikeError } from '@/lib/fetchWithTimeout';

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'admin' | string;
};

export function useAdminAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      setAuthLoading(true);
      setAuthError('');

      try {
        const res = await fetchWithTimeout('/api/admin/me', { cache: 'no-store' });
        if (!res.ok) {
          if (mounted) {
            setAuthError('Your admin session has expired. Redirecting to login...');
          }
          router.push('/admin');
          return;
        }

        const data = (await res.json()) as { user?: AdminUser };
        if (!mounted) {
          return;
        }

        if (!data?.user) {
          setAuthError('Admin session is valid, but user details could not be loaded.');
          return;
        }

        setUser(data.user);
      } catch (error) {
        if (mounted) {
          setAuthError(
            isAbortLikeError(error)
              ? 'Session check timed out. Please refresh and try again.'
              : 'Unable to verify admin session. Please refresh and try again.'
          );
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, [router]);

  return {
    user,
    authLoading,
    authError,
    isAuthenticated: !!user,
  };
}
