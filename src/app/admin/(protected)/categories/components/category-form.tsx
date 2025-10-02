
'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import type { Category, SubCategory } from '@/lib/types';
import { createCategory, updateCategory } from '../actions';
import Image from 'next/image';

interface CategoryFormProps {
    category?: Category;
}

const initialState = { success: false, message: '' };

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const action = category ? updateCategory : createCategory;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [subCategories, setSubCategories] = useState<SubCategory[]>(category?.subCategories || []);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);
  
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: "Success", description: state.message });
      } else {
        toast({ variant: 'destructive', title: "Error", description: state.message });
      }
    }
  }, [state.message, state.success, toast]);

  useEffect(() => {
    if (state.success && !isPending) {
      router.push('/admin/categories');
    }
  }, [state.success, isPending, router]);

  const addSubCategory = () => {
    setSubCategories([...subCategories, { id: `new-${Date.now()}`, name: '' }]);
  };

  const removeSubCategory = (index: number) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const handleSubCategoryChange = (index: number, field: keyof SubCategory, value: string) => {
    const newSubCategories = [...subCategories];
    (newSubCategories[index] as any)[field] = value;
    setSubCategories(newSubCategories);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const generateIdFromName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  return (
    <form action={formAction} ref={formRef}>
      {category?.id && <input type="hidden" name="id" value={category.id} />}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            {category ? 'Edit the details for this category.' : 'Fill in the details for your new category.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={category?.name}
              placeholder="e.g., Textiles"
              required 
              onChange={(e) => {
                if (!category) {
                  const idInput = document.getElementById('id') as HTMLInputElement;
                  if (idInput) idInput.value = generateIdFromName(e.target.value);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="id">Category ID</Label>
            <Input 
              id="id" 
              name="id" 
              placeholder="e.g., textiles" 
              defaultValue={category?.id}
              readOnly={!!category}
              required 
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier. Use lowercase letters and dashes. Cannot be changed after creation.
            </p>
          </div>
          
           <div className="space-y-4">
              <Label htmlFor="image">Category Image</Label>
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                  <Image src={imagePreview} alt="Image Preview" fill className="object-cover" />
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              <p className="text-xs text-muted-foreground">
                This image will be displayed on the homepage.
              </p>
            </div>

          <div className="space-y-4">
              <Label>Sub-Categories</Label>
              {subCategories.map((sub, index) => (
                  <div key={index} className="flex items-center gap-2">
                      <Input 
                          name="subCategoryId"
                          placeholder="ID (e.g., ceramic-vases)"
                          value={sub.id}
                          onChange={(e) => handleSubCategoryChange(index, 'id', e.target.value)}
                          required
                      />
                      <Input 
                          name="subCategoryName"
                          placeholder="Name (e.g., Ceramic Vases)"
                          value={sub.name}
                          onChange={(e) => handleSubCategoryChange(index, 'name', e.target.value)}
                          required
                      />
                      <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeSubCategory(index)}
                      >
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                  </div>
              ))}
               <Button type="button" variant="outline" size="sm" onClick={addSubCategory}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Sub-Category
              </Button>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
