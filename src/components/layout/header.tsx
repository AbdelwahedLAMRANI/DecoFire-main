
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { CartSheet } from "./cart-sheet";
import { DecoFireLogo } from "../icons/decofire-logo";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
                <div className="flex flex-col h-full py-6">
                <Link href="/" className="mb-8 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <DecoFireLogo />
                </Link>
                <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-lg transition-colors hover:text-accent ${
                        pathname === link.href ? "text-accent" : "text-foreground"
                        }`}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
                </div>
            </SheetContent>
            </Sheet>
        </div>

        <div className="flex items-center justify-center md:justify-start flex-1 md:flex-none">
            <Link href="/" className="flex items-center">
              <DecoFireLogo className="text-primary"/>
            </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors text-muted-foreground hover:text-primary ${
                pathname === link.href ? "!text-primary font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end">
            <CartSheet>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-7 w-7 text-primary" />
                    {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                        {cart.length}
                    </span>
                    )}
                    <span className="sr-only">Ouvrir le panier</span>
                </Button>
            </CartSheet>
        </div>
      </div>
    </header>
  );
}
