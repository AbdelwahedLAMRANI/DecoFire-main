
import type {Metadata} from 'next';
import './globals.css';
import { Poppins, Lato } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '500', '600', '700']
});

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'DecoFire',
  description: "L'élégance moderne rencontre la chaleur naturelle dans un décor personnalisable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} ${lato.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
