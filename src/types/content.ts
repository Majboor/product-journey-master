import { Json } from "@/integrations/supabase/types";

export interface Hero {
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface ProductDetails {
  description: string;
  specifications: string[];
  buyNowLink: string;
}

export interface Product {
  images: string[];
  details: ProductDetails;
  features: string[];
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  image: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface Contact {
  email: string;
  phone: string;
  address: string;
}

export interface Footer {
  contact: Contact;
  links: FooterLink[];
}

export interface PageContent {
  brandName: string;
  hero: Hero;
  product: Product;
  features: Feature[];
  reviews: Review[];
  footer: Footer;
}

// Type guard to ensure PageContent is compatible with Json
export const isPageContent = (content: unknown): content is PageContent => {
  const pageContent = content as PageContent;
  return (
    typeof pageContent?.brandName === 'string' &&
    pageContent?.hero !== undefined &&
    pageContent?.product !== undefined &&
    Array.isArray(pageContent?.features) &&
    Array.isArray(pageContent?.reviews) &&
    pageContent?.footer !== undefined
  );
};

// Add this validation function
export const validatePageContent = (content: unknown): content is PageContent => {
  const pageContent = content as PageContent;
  return (
    typeof pageContent?.brandName === 'string' &&
    pageContent?.hero !== undefined &&
    typeof pageContent.hero.title === 'string' &&
    typeof pageContent.hero.description === 'string' &&
    typeof pageContent.hero.image === 'string' &&
    typeof pageContent.hero.price === 'number' &&
    pageContent?.product !== undefined &&
    Array.isArray(pageContent.product.images) &&
    pageContent.product.details !== undefined &&
    Array.isArray(pageContent.product.features) &&
    Array.isArray(pageContent?.features) &&
    Array.isArray(pageContent?.reviews) &&
    pageContent?.footer !== undefined &&
    pageContent.footer.contact !== undefined &&
    Array.isArray(pageContent.footer.links)
  );
};