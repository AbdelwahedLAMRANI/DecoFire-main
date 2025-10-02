
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { products, categories, customizations } from '../../../../../data/data';
import type { Customization, CustomizationOption } from '@/lib/types';
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

export async function createOrUpdateCustomization(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;

  const optionValues = formData.getAll('optionValue');
  const priceModifiers = formData.getAll('priceModifier');

  const options: CustomizationOption[] = optionValues.map((value, index) => ({
    value: value as string,
    priceModifier: Number(priceModifiers[index]) || 0,
  })).filter(opt => opt.value); // Filter out empty options

  if (!name || !id) {
    return { success: false, message: 'ID and Name are required.' };
  }

  const existingIndex = customizations.findIndex(c => c.id === id);

  if (existingIndex > -1) {
    // Update
    customizations[existingIndex] = { id, name, options };
  } else {
    // Create
    const newCustomization: Customization = { id, name, options };
    customizations.push(newCustomization);
  }

  await updateDataFile();

  revalidatePath('/admin/customizations');
  revalidatePath('/admin/products');
  redirect('/admin/customizations');
}

export async function deleteCustomization(id: string): Promise<{ success: boolean; message: string; }> {
    const index = customizations.findIndex(c => c.id === id);
    if (index > -1) {
        customizations.splice(index, 1);
        
        // Also remove from any products that use it
        products.forEach(p => {
            if (p.customizationIds) {
                p.customizationIds = p.customizationIds.filter(custId => custId !== id);
            }
        });

        try {
            await updateDataFile();
        } catch (error) {
            return { success: false, message: 'Failed to save changes.' };
        }
    } else {
        return { success: false, message: 'Customization not found.' };
    }

    revalidatePath('/admin/customizations');
    revalidatePath('/admin/products');
    return { success: true, message: 'Customization deleted successfully.' };
}
