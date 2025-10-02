
'use server';

import { revalidatePath } from 'next/cache';
import { siteConfig } from '@/lib/data';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// This function needs to exist to persist the changes.
// In a real app, this would be writing to a database.
// Here we write to a TypeScript file.
async function updateConfigFile() {
  const dataPath = join(process.cwd(), 'data', 'site-config.ts');
  const updatedData = `
import type { SiteConfig } from "@/lib/types";

export let siteConfig: SiteConfig = ${JSON.stringify(siteConfig, null, 2)};
`;
  try {
    await writeFile(dataPath, updatedData, 'utf-8');
  } catch (err) {
    console.error("Failed to write to site config file:", err);
    throw new Error("Failed to update site config file.");
  }
}

async function fileToDataUri(file: File) {
    if (!file || file.size === 0) return null;
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function updateSiteConfig(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
      const contact = {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        whatsapp: formData.get('whatsapp') as string,
        address: formData.get('address') as string,
      };

      const social = {
        instagram: formData.get('instagram') as string,
        facebook: formData.get('facebook') as string,
      };

      const about = {
        title: formData.get('aboutTitle') as string,
        paragraph1: formData.get('aboutParagraph1') as string,
        paragraph2: formData.get('aboutParagraph2') as string,
        quote: formData.get('aboutQuote') as string,
        paragraph3: formData.get('aboutParagraph3') as string,
        paragraph4: formData.get('aboutParagraph4') as string,
      };

      siteConfig.contact = contact;
      siteConfig.social = social;
      siteConfig.about = about;

      const logoFile = formData.get('logoUrl') as File;
      const heroFile = formData.get('heroImageUrl') as File;
      const aboutFile = formData.get('aboutImageUrl') as File;
      const contactFile = formData.get('contactImageUrl') as File;

      const newLogoUrl = await fileToDataUri(logoFile);
      const newHeroUrl = await fileToDataUri(heroFile);
      const newAboutUrl = await fileToDataUri(aboutFile);
      const newContactUrl = await fileToDataUri(contactFile);

      if (newLogoUrl) siteConfig.logoUrl = newLogoUrl;
      if (newHeroUrl) siteConfig.heroImageUrl = newHeroUrl;
      if (newAboutUrl) siteConfig.aboutImageUrl = newAboutUrl;
      if (newContactUrl) siteConfig.contactImageUrl = newContactUrl;

      await updateConfigFile();
  } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred while updating the configuration.'}
  }

  revalidatePath('/admin/general');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');
  
  return { success: true, message: 'Configuration updated successfully.' };
}


