
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CategoryForm } from "../components/category-form";

export const maxDuration = 120;

export default function NewCategoryPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Add New Category</h1>
      </div>

      <CategoryForm />
    </div>
  );
}
