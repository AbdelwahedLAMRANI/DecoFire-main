
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories, customizations } from "@/lib/data";
import { ArrowLeft, Trash2, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useRef, useActionState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { createProduct } from "../actions";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const initialState = { success: false, message: '' };

export const maxDuration = 120;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(createProduct, initialState);
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

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
    // When the main category changes, reset the sub-category
    setSelectedSubCategory(undefined);
  }, [selectedCategory]);

  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return categories.find(c => c.id === selectedCategory)?.subCategories || [];
  }, [selectedCategory]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (!fileInputRef.current) return;
    
    const dataTransfer = new DataTransfer();
    const files = Array.from(fileInputRef.current.files || []);
    
    files.forEach((file, index) => {
      if (index !== indexToRemove) {
        dataTransfer.items.add(file);
      }
    });

    fileInputRef.current.files = dataTransfer.files;

    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };
  
  const toggleCustomization = (customizationId: string) => {
    setSelectedCustomizations(prev => 
      prev.includes(customizationId) 
        ? prev.filter(id => id !== customizationId)
        : [...prev, customizationId]
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
      </div>

      <form action={formAction} ref={formRef}>
         {selectedCustomizations.map(id => <input type="hidden" key={id} name="customizationIds" value={id} />)}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Fill in the main details for your new product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Serene Ceramic Vase" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="A beautifully crafted..." required />
                </div>
                <div className="space-y-4">
                    <Label htmlFor="images">Product Images</Label>
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
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
                           {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeImage(index)}
                                            aria-label="Remove image"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                           ))}
                        </div>
                     )}
                    <p className="text-xs text-muted-foreground">Upload one or more images for the product.</p>
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
                  <Input id="price" name="price" type="number" step="0.01" placeholder="450" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Level</Label>
                  <Input id="stock" name="stock" type="number" placeholder="15" required />
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
                  <Select name="category" onValueChange={setSelectedCategory} required>
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
                    <Select name="subcategory" value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
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
                    <Switch id="is-featured" name="is-featured" />
                    <Label htmlFor="is-featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Product
            </Button>
        </div>
      </form>
    </div>
  );
}
