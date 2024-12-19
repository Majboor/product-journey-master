import { supabase } from "@/integrations/supabase/client";
import { defaultPages } from "@/components/sections/DefaultPages";

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
        await supabase
          .from('pages')
          .insert({
            slug,
            content
          });
      }
    }

    console.log('Default pages initialized successfully');
  } catch (error) {
    console.error('Error initializing default pages:', error);
  }
};