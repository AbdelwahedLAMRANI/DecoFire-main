
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImageUrl = product.imageUrls[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {primaryImageUrl ? (
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              data-ai-hint="product"
            />
          ) : (
            <div className="w-full h-full bg-secondary"></div>
          )}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-medium font-headline flex-grow leading-tight">{product.name}</h3>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
            {product.stockLevel < 10 && product.stockLevel > 0 && (
              <p className="text-sm text-accent">Plus que {product.stockLevel} restants</p>
            )}
            {product.stockLevel === 0 && (
                <p className="text-sm text-destructive-foreground bg-destructive px-2 py-1 rounded-sm">Épuisé</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
