
'use server';

import { revalidatePath } from 'next/cache';
import { products, categories, customizations } from '../../../../../data/data';
import type { Category, SubCategory } from '@/lib/types';
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
    throw new Error("Failed to update data file.");
  }
}

async function fileToDataUri(file: File) {
    if (!file || file.size === 0) return null;
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}


export async function createCategory(prevState: any, formData: FormData): Promise<{ success: boolean, message: string }> {
  try {
    const name = formData.get('name') as string;
    const id = formData.get('id') as string;
    const imageFile = formData.get('image') as File;

    const subCategoryIds = formData.getAll('subCategoryId') as string[];
    const subCategoryNames = formData.getAll('subCategoryName') as string[];

    if (!name || !id) {
      return { success: false, message: 'Name and ID are required.' };
    }

    const imageUrl = await fileToDataUri(imageFile);

    const subCategories: SubCategory[] = subCategoryIds.map((subId, index) => ({
      id: subId,
      name: subCategoryNames[index],
    })).filter(sub => sub.id && sub.name);

    const newCategory: Category = {
      id,
      name,
      imageUrl: imageUrl || undefined,
      subCategories,
    };

    categories.unshift(newCategory);
    
    await updateDataFile();

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create category.' };
  }

  revalidatePath('/admin/categories');
  return { success: true, message: 'Category created successfully.' };
}

export async function updateCategory(prevState: any, formData: FormData): Promise<{ success: boolean, message: string }> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const imageFile = formData.get('image') as File;

  const subCategoryIds = formData.getAll('subCategoryId') as string[];
  const subCategoryNames = formData.getAll('subCategoryName') as string[];

  const categoryIndex = categories.findIndex(c => c.id === id);

  if (categoryIndex === -1) {
    return { success: false, message: 'Category not found' };
  }

  const existingCategory = categories[categoryIndex];

  try {
    let imageUrl = existingCategory.imageUrl;
    if (imageFile && imageFile.size > 0) {
        imageUrl = await fileToDataUri(imageFile);
    }

    const updatedSubCategories: SubCategory[] = subCategoryIds.map((subId, index) => ({
      id: subId,
      name: subCategoryNames[index],
    })).filter(sub => sub.id && sub.name);


    categories[categoryIndex] = {
      ...existingCategory,
      name,
      imageUrl,
      subCategories: updatedSubCategories,
    };

    await updateDataFile();

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update category.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/edit/${id}`);
  revalidatePath('/');
  return { success: true, message: 'Category updated successfully.' };
}

export async function deleteCategory(id: string): Promise<{ success: boolean, message: string }> {
  const productsInCategory = products.some(p => p.categoryId === id);
  if (productsInCategory) {
    return { success: false, message: 'Cannot delete category. Products are still associated with it.' };
  }
  
  const index = categories.findIndex(c => c.id === id);
  
  if (index > -1) {
    categories.splice(index, 1);
    try {
      await updateDataFile();
    } catch (error) {
      return { success: false, message: 'Failed to save changes.' };
    }
  } else {
    return { success: false, message: 'Category not found.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/shop');
  revalidatePath('/');
  
  return { success: true, message: 'Category deleted successfully.' };
}
