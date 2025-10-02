
import { notFound } from 'next/navigation';
import { products, categories } from '@/lib/data';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ProductImageGallery } from '@/app/(app)/products/[slug]/components/product-image-gallery';
import ProductCustomizer from '@/app/(app)/products/[slug]/components/product-customizer';

export async function generateStaticParams() {
  return products.map(product => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const category = categories.find(c => c.id === product.categoryId);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Boutique</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/shop?category=${category.id}`}>{category.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <ProductImageGallery product={product} />
        <ProductCustomizer 
          product={product} 
        />
      </div>
    </div>
  );
}
