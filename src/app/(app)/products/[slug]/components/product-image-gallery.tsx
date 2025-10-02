
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  if (!product.imageUrls || product.imageUrls.length === 0) {
    return (
        <div className="aspect-square w-full rounded-lg bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground">Aucune image disponible</span>
        </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {product.imageUrls.map((url, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`${product.name} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                data-ai-hint="product"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {product.imageUrls.length > 1 && (
        <>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </>
      )}
    </Carousel>
  );
}
