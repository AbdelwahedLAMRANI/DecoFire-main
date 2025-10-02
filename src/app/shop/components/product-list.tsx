
"use client";

import { useMemo } from 'react';
import { ProductCard } from './product-card';
import { FilterSidebar } from './filter-sidebar';
import type { Product, Category, CustomizationOption } from '@/lib/types';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductList({
  products,
  categories,
  searchParams,
}: ProductListProps) {
  const filteredProducts = useMemo(() => {
    const category = searchParams?.category as string;
    const subCategory = searchParams?.subCategory as string;
    
    let filtered = products;

    if (category) {
      filtered = filtered.filter(p => p.categoryId === category);
    }
    if (subCategory) {
      filtered = filtered.filter(p => p.subCategoryId === subCategory);
    }
    
    return filtered;
  }, [products, searchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <FilterSidebar categories={categories} />
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[40vh] bg-secondary/30 rounded-lg">
            <h3 className="text-2xl font-bold font-headline">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mt-2">Essayez d'ajuster vos filtres.</p>
          </div>
        )}
      </main>
    </div>
  );
}
