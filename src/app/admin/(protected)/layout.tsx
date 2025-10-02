
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_PASSWORD } from '@/lib/constants';
import { AdminSidebar } from '../components/admin-sidebar';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const passwordCookie = cookieStore.get('admin-password');

  if (passwordCookie?.value !== ADMIN_PASSWORD) {
    // In a real app, you'd want to get the full requested URL.
    // For this example, we'll just redirect to the login page.
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
