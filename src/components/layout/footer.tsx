
import Link from "next/link";
import { Separator } from "../ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <Separator />
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} DecoFire. Tous droits réservés.
          </p>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
