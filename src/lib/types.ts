

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Can be remote URLs or data URIs
  categoryId: string;
  subCategoryId: string;
  stockLevel: number;
  isFeatured: boolean;
  customizationIds?: string[];
};

export type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  subCategories: SubCategory[];
};

export type SubCategory = {
  id: string;
  name: string;
};

export type CustomizationOption = {
  value: string;
  priceModifier: number;
};

export type Customization = {
  id: string;
  name: string;
  options: CustomizationOption[];
};

export type SelectedCustomization = {
  customizationId: string;
  customizationName: string;
  optionValue: string;
};

export type CartItem = {
  id: string; // A unique ID for the cart item, combining product id and customizations
  product: Product;
  quantity: number;
  price: number; // Final price per item, including customizations
  customizations: SelectedCustomization[];
};

export interface SiteConfig {
  logoUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  contactImageUrl: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    paragraph3: string;
    paragraph4: string;
  };
}
