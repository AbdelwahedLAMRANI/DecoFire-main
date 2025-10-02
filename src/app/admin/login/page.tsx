'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { ADMIN_PASSWORD } from '@/lib/constants';
import { LoginForm } from './components/login-form';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  useEffect(() => {
    const password = getCookie('admin-password');
    if (password === ADMIN_PASSWORD) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline">Admin Login</h1>
          <p className="text-muted-foreground">Enter your password to access the dashboard.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
