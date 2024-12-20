import { Json } from "@/integrations/supabase/types";
import { ColorScheme } from "./colors";

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
  colorScheme?: ColorScheme;
}

interface ValidationError {
  field: string;
  message: string;
}

export const validatePageContent = (content: unknown): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  const pageContent = content as PageContent;

  if (!pageContent?.brandName) {
    errors.push({ field: 'brandName', message: 'Brand name is required' });
  }

  // Validate hero section
  if (!pageContent?.hero) {
    errors.push({ field: 'hero', message: 'Hero section is required' });
  } else {
    if (!pageContent.hero.title) errors.push({ field: 'hero.title', message: 'Hero title is required' });
    if (!pageContent.hero.description) errors.push({ field: 'hero.description', message: 'Hero description is required' });
    if (!pageContent.hero.image) errors.push({ field: 'hero.image', message: 'Hero image is required' });
    if (typeof pageContent.hero.price !== 'number') errors.push({ field: 'hero.price', message: 'Hero price must be a number' });
  }

  // Validate product section
  if (!pageContent?.product) {
    errors.push({ field: 'product', message: 'Product section is required' });
  } else {
    if (!Array.isArray(pageContent.product.images)) {
      errors.push({ field: 'product.images', message: 'Product images must be an array' });
    }
    if (!pageContent.product.details) {
      errors.push({ field: 'product.details', message: 'Product details are required' });
    } else {
      if (!pageContent.product.details.description) {
        errors.push({ field: 'product.details.description', message: 'Product description is required' });
      }
      if (!pageContent.product.details.buyNowLink) {
        errors.push({ field: 'product.details.buyNowLink', message: 'Buy now link is required' });
      }
      if (!Array.isArray(pageContent.product.details.specifications)) {
        errors.push({ field: 'product.details.specifications', message: 'Product specifications must be an array' });
      }
    }
    if (!Array.isArray(pageContent.product.features)) {
      errors.push({ field: 'product.features', message: 'Product features must be an array' });
    }
  }

  // Validate features array
  if (!Array.isArray(pageContent?.features)) {
    errors.push({ field: 'features', message: 'Features must be an array' });
  } else {
    pageContent.features.forEach((feature, index) => {
      if (!feature.icon) errors.push({ field: `features[${index}].icon`, message: 'Feature icon is required' });
      if (!feature.title) errors.push({ field: `features[${index}].title`, message: 'Feature title is required' });
      if (!feature.description) errors.push({ field: `features[${index}].description`, message: 'Feature description is required' });
    });
  }

  // Validate footer
  if (!pageContent?.footer) {
    errors.push({ field: 'footer', message: 'Footer section is required' });
  } else {
    if (!pageContent.footer.contact) {
      errors.push({ field: 'footer.contact', message: 'Footer contact information is required' });
    } else {
      if (!pageContent.footer.contact.email) errors.push({ field: 'footer.contact.email', message: 'Contact email is required' });
      if (!pageContent.footer.contact.phone) errors.push({ field: 'footer.contact.phone', message: 'Contact phone is required' });
      if (!pageContent.footer.contact.address) errors.push({ field: 'footer.contact.address', message: 'Contact address is required' });
    }
    if (!Array.isArray(pageContent.footer.links)) {
      errors.push({ field: 'footer.links', message: 'Footer links must be an array' });
    } else {
      pageContent.footer.links.forEach((link, index) => {
        if (!link.title) errors.push({ field: `footer.links[${index}].title`, message: 'Link title is required' });
        if (!link.url) errors.push({ field: `footer.links[${index}].url`, message: 'Link URL is required' });
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Type guard to ensure PageContent is compatible with Json
export const isPageContent = (content: unknown): content is PageContent => {
  const validation = validatePageContent(content);
  return validation.isValid;
};
