
import { products, categories } from '@/lib/data';
import { ProductTable } from './components/product-table';

export default function AdminProductsPage() {
  const currentProducts = products;
  const currentCategories = categories;

  return (
    <ProductTable products={currentProducts} categories={currentCategories} />
  );
}
