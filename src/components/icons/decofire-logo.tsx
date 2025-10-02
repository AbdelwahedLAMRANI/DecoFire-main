
import Image from 'next/image';
import { siteConfig } from '@/lib/data';

export function DecoFireLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8">
        <Image
          src={siteConfig.logoUrl}
          alt="DecoFire Logo"
          fill
          className="rounded-full object-contain"
        />
      </div>
      <span className="font-bold text-xl">DecoFire</span>
    </div>
  );
}
