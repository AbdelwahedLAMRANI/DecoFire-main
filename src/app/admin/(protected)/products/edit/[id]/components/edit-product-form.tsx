
'use client';

import { useMemo, useState, useRef, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct, deleteProductImage } from '../../../actions';
import type { Product, Category, Customization } from '@/lib/types';
import Image from 'next/image';
import { Trash2, Loader2, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EditProductFormProps {
    product: Product;
    categories: Category[];
    customizations: Customization[];
}

const initialState = { success: false, message: '' };

export function EditProductForm({ product, categories, customizations }: EditProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(updateProduct, initialState);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(product?.categoryId);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(product?.subCategoryId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>(product?.customizationIds || []);
  
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
             router.push('/admin/products');
        }
    }, [state.success, isPending, router]);
    
    useEffect(() => {
      setSelectedSubCategory(undefined);
    }, [selectedCategory]);

  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return categories.find(c => c.id === selectedCategory)?.subCategories || [];
  }, [selectedCategory, categories]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };
  
  const handleImageDelete = async (imageUrl: string) => {
    await deleteProductImage(product.id, imageUrl);
  };

  const toggleCustomization = (customizationId: string) => {
    setSelectedCustomizations(prev => 
      prev.includes(customizationId) 
        ? prev.filter(id => id !== customizationId)
        : [...prev, customizationId]
    );
  }

  return (
    <form action={formAction}>
      {selectedCustomizations.map(id => <input type="hidden" key={id} name="customizationIds" value={id} />)}
      <input type="hidden" name="id" value={product.id} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Update the details for your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" defaultValue={product.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={product.description} required />
              </div>
              
              <div className="space-y-4">
                  <Label>Current Images</Label>
                  {product.imageUrls.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                         {product.imageUrls.map((imageUrl, index) => (
                              <div key={index} className="relative group aspect-square">
                                  <Image src={imageUrl} alt={`${product.name} image ${index + 1}`} fill className="object-cover rounded-md" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              <Button
                                                  type="button"
                                                  variant="destructive"
                                                  size="icon"
                                                  aria-label="Delete image"
                                              >
                                                  <Trash2 className="h-4 w-4" />
                                              </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      This action cannot be undone. This will permanently delete the image from this product.
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction
                                                      onClick={() => handleImageDelete(imageUrl)}
                                                  >
                                                      Delete
                                                  </AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  </div>
                              </div>
                         ))}
                      </div>
                  ) : (
                      <p className="text-sm text-muted-foreground">No images exist for this product.</p>
                  )}
              </div>

              <div className="space-y-4">
                  <Label htmlFor="images">Upload More Images</Label>
                   <Input 
                      id="images" 
                      name="images" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      ref={fileInputRef}
                      onChange={handleImageChange}
                   />
                   {imagePreviews.length > 0 && (
                      <div className="space-y-3 pt-4">
                          <p className="text-sm font-medium">New image previews:</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                          {imagePreviews.map((src, index) => (
                                  <div key={index} className="relative group aspect-square">
                                      <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md" />
                                  </div>
                          ))}
                          </div>
                      </div>
                   )}
                  <p className="text-xs text-muted-foreground">Newly uploaded images will replace any existing ones.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (in MAD)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Level</Label>
                <Input id="stock" name="stock" type="number" defaultValue={product.stockLevel} required />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} defaultValue={product.categoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {subCategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Sub-category</Label>
                  <Select name="subcategory" value={selectedSubCategory} onValueChange={setSelectedSubCategory} defaultValue={product.subCategoryId ?? undefined}>
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
               <div className="space-y-2">
                  <Label>Customizations</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start font-normal">
                              <div className="flex gap-1 flex-wrap">
                                  {selectedCustomizations.length > 0 ? (
                                    selectedCustomizations.map(id => {
                                      const cust = customizations.find(c => c.id === id);
                                      return <Badge variant="secondary" key={id}>{cust?.name}</Badge>
                                    })
                                  ) : "Select customizations"}
                              </div>
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                              <CommandInput placeholder="Search customizations..." />
                              <CommandList>
                                <CommandEmpty>No customizations found.</CommandEmpty>
                                <CommandGroup>
                                    {customizations.map(cust => (
                                        <CommandItem
                                            key={cust.id}
                                            value={cust.name}
                                            onSelect={() => toggleCustomization(cust.id)}
                                        >
                                            <div className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selectedCustomizations.includes(cust.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}>
                                                <X className="h-3 w-3" />
                                            </div>
                                            <span>{cust.name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                          </Command>
                      </PopoverContent>
                  </Popover>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                  <Switch id="is-featured" name="is-featured" defaultChecked={product.isFeatured} />
                  <Label htmlFor="is-featured">Featured Product</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 flex justify-end items-center gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
      </div>
    </form>
  );
}
