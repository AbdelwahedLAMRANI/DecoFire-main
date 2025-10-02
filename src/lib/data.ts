
import type { Product, Category, Customization, SiteConfig } from './types';
import { products as productsData, categories as categoriesData, customizations as customizationsData } from '../../data/data';
import { siteConfig as siteConfigData } from '../../data/site-config';

export const categories: Category[] = categoriesData;
export let products: Product[] = productsData;
export const customizations: Customization[] = customizationsData;
export const siteConfig: SiteConfig = siteConfigData;
