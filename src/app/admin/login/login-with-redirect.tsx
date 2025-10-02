'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { ADMIN_PASSWORD } from '@/lib/constants';
import { LoginForm } from './components/login-form';

export function LoginWithRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  useEffect(() => {
    const password = getCookie('admin-password');
    if (password === ADMIN_PASSWORD) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  return <LoginForm />;
}
