"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [index, setIndex] = useState(0);
  const images = product.imageUrls || [];
  const total = images.length;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation when clicking arrows
    setIndex((i) => (i === 0 ? total - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setIndex((i) => (i === total - 1 ? 0 : i + 1));
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {total > 0 ? (
            <>
              <Image
                src={images[index]}
                alt={`${product.name} image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              {total > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-secondary"></div>
          )}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-medium font-headline flex-grow leading-tight">
            {product.name}
          </h3>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.stockLevel < 10 && product.stockLevel > 0 && (
              <p className="text-sm text-accent">
                Plus que {product.stockLevel} restants
              </p>
            )}
            {product.stockLevel === 0 && (
              <p className="text-sm text-destructive-foreground bg-destructive px-2 py-1 rounded-sm">
                Épuisé
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
