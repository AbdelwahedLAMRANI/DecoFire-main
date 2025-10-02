'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_PASSWORD } from '@/lib/constants';

// The first argument is the previous state, which we don't use here.
export async function handleLogin(prevState: any, formData: FormData) {
  const password = formData.get('password');
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  if (password === ADMIN_PASSWORD) {
    cookies().set('admin-password', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    // Redirect to the originally requested page, or the dashboard.
    redirect(redirectTo);
  } else {
    // If the password is incorrect, return an error.
    return { success: false, error: 'Incorrect password.' };
  }
}

export async function handleLogout() {
  cookies().delete('admin-password');
  redirect('/admin/login');
}
