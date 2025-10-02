
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { categories } from '@/lib/data';
import { CategoryForm } from '../../components/category-form';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = categories.find(c => c.id === params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Category</h1>
      </div>

       <CategoryForm category={category} />
    </div>
  );
}
