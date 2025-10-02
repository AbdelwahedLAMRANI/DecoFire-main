'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { customizations } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteCustomization } from "./actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Customization } from "@/lib/types";

const initialState = { success: false, message: '' };

function DeleteCustomizationButton({ customizationId }: { customizationId: string }) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteCustomization.bind(null, customizationId), initialState);

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
              This action cannot be undone. This will permanently delete the customization and remove it from all associated products.
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


export default function AdminCustomizationsPage() {
  const currentCustomizations: Customization[] = customizations;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Customizations</h1>
        <Button asChild>
          <Link href="/admin/customizations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customization
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Customizations</CardTitle>
          <CardDescription>Define options for product personalization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomizations.map((customization) => (
                  <TableRow key={customization.id}>
                    <TableCell className="font-medium">{customization.name}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-2">
                            {customization.options.map(option => (
                                <Badge key={option.value} variant="secondary">
                                    {option.value} {option.priceModifier !== 0 ? `(${formatPrice(option.priceModifier)})` : ''}
                                </Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                            <Link href={`/admin/customizations/edit/${customization.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DeleteCustomizationButton customizationId={customization.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
