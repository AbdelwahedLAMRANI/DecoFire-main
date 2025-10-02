
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Category } from '@/lib/types';

interface FilterSidebarProps {
  categories: Category[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, isChecked: boolean, parentCategory?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (isChecked) {
        if (name === 'category') {
            // If it's the same category, do nothing (or toggle off if we want that behavior)
            if (params.get('category') === value) {
                 params.delete('category');
                 params.delete('subCategory');
            } else {
                params.set(name, value);
                params.delete('subCategory'); // Clear sub-category when a new main category is chosen
            }
        } else if (name === 'subCategory') {
            if (params.get('subCategory') === value) {
                params.delete('subCategory');
            } else {
                if (parentCategory) params.set('category', parentCategory);
                params.set(name, value);
            }
        }
      } else {
         if (name === 'category') {
            params.delete('category');
            params.delete('subCategory');
         } else {
            params.delete(name);
         }
      }

      return params.toString();
    },
    [searchParams]
  );

  const clearFilters = () => {
    router.push(pathname);
  };

  const selectedCategory = searchParams.get('category');
  const selectedSubCategory = searchParams.get('subCategory');
  
  const subCategories = categories.find(c => c.id === selectedCategory)?.subCategories || [];

  return (
    <div className="space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-headline">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={!searchParams.toString()}>
          Tout effacer
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={['category']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="font-semibold">Catégorie</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-1">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCategory === cat.id}
                    onCheckedChange={(checked) => {
                        router.push(pathname + '?' + createQueryString('category', cat.id, !!checked))
                    }}
                  />
                  <Label htmlFor={`cat-${cat.id}`} className="font-normal cursor-pointer">{cat.name}</Label>
                </div>
              ))}
            </div>
            {selectedCategory && subCategories.length > 0 && (
              <div className="mt-4 pt-4 space-y-3 pl-6 border-t">
                <h4 className="font-medium text-sm text-muted-foreground -ml-4 mb-2">Sous-catégories</h4>
                 {subCategories.map(subCat => (
                  <div key={subCat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subcat-${subCat.id}`}
                      checked={selectedSubCategory === subCat.id}
                      onCheckedChange={(checked) => {
                          router.push(pathname + '?' + createQueryString('subCategory', subCat.id, !!checked, selectedCategory))
                      }}
                    />
                    <Label htmlFor={`subcat-${subCat.id}`} className="font-normal cursor-pointer">{subCat.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
