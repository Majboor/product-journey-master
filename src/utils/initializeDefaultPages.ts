import { supabase } from "@/integrations/supabase/client";
import { defaultPages } from "@/components/sections/DefaultPages";
import { Json } from "@/integrations/supabase/types";
import { PageContent } from "@/types/content";

export const initializeDefaultPages = async () => {
  try {
    // Check if pages already exist
    const { data: existingPages } = await supabase
      .from('pages')
      .select('slug');

    const existingSlugs = existingPages?.map(page => page.slug) || [];

    // Insert only pages that don't exist yet
    for (const [slug, content] of Object.entries(defaultPages)) {
      if (!existingSlugs.includes(slug)) {
        // Convert PageContent to a plain object that matches Json type
        const jsonContent = {
          ...content,
          toJSON() { return this; }
        } as unknown as Json;

        await supabase
          .from('pages')
          .insert({
            slug,
            content: jsonContent
          });
      }
    }

    console.log('Default pages initialized successfully');
  } catch (error) {
    console.error('Error initializing default pages:', error);
  }
};