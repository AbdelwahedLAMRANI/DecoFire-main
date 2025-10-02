
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Tag, LogOut, Home, Shapes, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleLogout } from '../login/actions';
import { Button } from '@/components/ui/button';
import { DecoFireLogo } from '@/components/icons/decofire-logo';


const navLinks = [
  { href: '/', label: 'View Site', icon: Home },
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/customizations', label: 'Customizations', icon: Shapes },
  { href: '/admin/general', label: 'Général', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center space-x-2">
            <DecoFireLogo className="text-xl"/>
        </Link>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === '/admin' 
              ? pathname === link.href 
              : link.href !== '/' && pathname.startsWith(link.href);
            
            const isHomeLink = link.href === '/';
            
            if (isHomeLink) {
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
              </li>
              )
            }

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t">
        <form action={handleLogout}>
            <Button variant="ghost" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </form>
      </div>
    </aside>
  );
}
