import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Sitemap = () => {
  const { categorySlug } = useParams();

  const { data: category } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      if (!categorySlug) return null;
      const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!categorySlug,
  });

  const { data: sitemap } = useQuery({
    queryKey: ['sitemap', category?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sitemaps')
        .select('content')
        .eq('category_id', category?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  useEffect(() => {
    if (sitemap?.content) {
      // Create a new document with XML content type
      const xmlDoc = new DOMParser().parseFromString(sitemap.content, 'application/xml');
      
      // Clear the current document
      document.open('text/xml');
      
      // Write the XML content
      document.write(xmlDoc.documentElement.outerHTML);
      
      // Close the document
      document.close();
    }
  }, [sitemap]);

  // Return null as we're handling the document content directly
  return null;
};

export default Sitemap;