
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { products, categories, customizations } from '../../../../../data/data';
import type { Product } from '@/lib/types';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function updateDataFile() {
  const dataPath = join(process.cwd(), 'data', 'data.ts');
  const updatedData = `
import type { Product, Category, Customization } from '../src/lib/types';

export const customizations: Customization[] = ${JSON.stringify(customizations, null, 2)};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export let products: Product[] = ${JSON.stringify(products, null, 2)};
`;
  try {
    await writeFile(dataPath, updatedData, 'utf-8');
  } catch (err) {
    console.error("Failed to write to data file:", err);
  }
}


function generateSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

async function fileToDataUri(file: File) {
    if (!file || file.size === 0) return null;
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function createProduct(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stockLevel = Number(formData.get('stock'));
    const categoryId = formData.get('category') as string;
    const subCategoryId = formData.get('subcategory') as string || null;
    const isFeatured = formData.get('is-featured') === 'on';
    const customizationIds = formData.getAll('customizationIds') as string[];
    
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    if (imageFiles.length > 0) {
        for (const file of imageFiles) {
            if (file.size > 0) {
                const dataUri = await fileToDataUri(file);
                if (dataUri) imageUrls.push(dataUri);
            }
        }
    }

    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name,
        slug: generateSlug(name),
        description,
        price,
        stockLevel,
        categoryId,
        subCategoryId,
        imageUrls,
        isFeatured,
        customizationIds,
    };

    products.unshift(newProduct);
    await updateDataFile();

    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/shop');
    
    return { success: true, message: 'Product created successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while creating the product.' };
  }
}

export async function updateProduct(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; }> {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const stockLevel = Number(formData.get('stock'));
        const categoryId = formData.get('category') as string;
        const subCategoryId = formData.get('subcategory') as string || null;
        const isFeatured = formData.get('is-featured') === 'on';
        const customizationIds = formData.getAll('customizationIds') as string[];
        
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return { success: false, message: 'Product not found'};
        }

        const existingProduct = products[productIndex];
        
        const imageFiles = formData.getAll('images') as File[];
        const newImageUrls: string[] = [];
        if (imageFiles.length > 0 && imageFiles[0].size > 0) {
            for (const file of imageFiles) {
                const dataUri = await fileToDataUri(file);
                if (dataUri) newImageUrls.push(dataUri);
            }
        }

        const updatedProduct: Product = {
            ...existingProduct,
            name,
            slug: generateSlug(name),
            description,
            price,
            stockLevel,
            categoryId,
            subCategoryId,
            isFeatured,
            imageUrls: newImageUrls.length > 0 
              ? [...existingProduct.imageUrls, ...newImageUrls] 
              : existingProduct.imageUrls,
            customizationIds,
        };

        products[productIndex] = updatedProduct;

        await updateDataFile(); 
        
        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath(`/products/${updatedProduct.slug}`);
        
        return { success: true, message: 'Product updated successfully.' };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while updating the product.' };
    }
}

export async function deleteProductImage(productId: string, imageUrl: string) {
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return { success: false, message: 'Product not found' };
    }
    
    const product = products[productIndex];
    
    product.imageUrls = product.imageUrls.filter(url => url !== imageUrl);
    
    products[productIndex] = product;
    
    await updateDataFile();

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/edit/${productId}`);
    revalidatePath('/shop');
    revalidatePath(`/products/${product.slug}`);
    revalidatePath('/');
    
    return { success: true, message: 'Image deleted successfully' };
}

export async function deleteProduct(id: string) {
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex > -1) {
    products.splice(productIndex, 1);
  }

  await updateDataFile();

  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/shop');
  redirect('/admin/products');
}
