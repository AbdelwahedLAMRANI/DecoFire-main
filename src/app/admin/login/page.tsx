'use client';

import { Suspense } from 'react';
import { LoginWithRedirect } from './login-with-redirect';

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline">Admin Login</h1>
          <p className="text-muted-foreground">
            Enter your password to access the dashboard.
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginWithRedirect />
        </Suspense>
      </div>
    </div>
  );
}
