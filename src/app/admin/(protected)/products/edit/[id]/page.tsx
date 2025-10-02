import { notFound } from 'next/navigation';
import { products, categories, customizations } from '@/lib/data';
import { EditProductForm } from './components/edit-product-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
      </div>
      <EditProductForm product={product} categories={categories} customizations={customizations} />
    </div>
  );
}
