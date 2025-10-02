
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { categories } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const initialState = { success: false, message: '' };

function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteCategory.bind(null, categoryId), initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({ title: 'Success', description: state.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      }
    }
  }, [state, toast]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={formAction}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category. Make sure no products are using this category first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Catégories</h1>
        <Button asChild>
            <Link href="/admin/categories/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            Here you can add, edit, or delete categories and sub-categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {categories.map(category => (
              <AccordionItem value={category.id} key={category.id}>
                <div className="flex items-center w-full pr-4 hover:bg-muted/50 rounded-t-md">
                    <AccordionTrigger className="hover:no-underline flex-1 py-4 px-6">
                        <span className="font-semibold text-lg">{category.name}</span>
                    </AccordionTrigger>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Category Actions</DropdownMenuLabel>
                         <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/edit/${category.id}`}>Edit</Link>
                         </DropdownMenuItem>
                        <DeleteCategoryButton categoryId={category.id} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <AccordionContent>
                  <ul className="space-y-2 pl-8 pt-2">
                    {category.subCategories.map(sub => (
                      <li key={sub.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                        <span>{sub.name}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sub-Category Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                     <li className="pl-2 pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/categories/edit/${category.id}`}>
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Add Sub-category
                          </Link>
                        </Button>
                     </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
