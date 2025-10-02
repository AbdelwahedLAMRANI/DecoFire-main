
import { products, categories } from '@/lib/data';
import ProductList from '@/app/shop/components/product-list';

// This is now a Server Component
export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentProducts = products;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Notre Collection</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Trouvez la pièce parfaite pour compléter votre espace.</p>
      </div>
      <ProductList
        products={currentProducts}
        categories={categories}
        searchParams={searchParams}
      />
    </div>
  );
}
