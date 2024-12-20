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
      // Clear any existing document content
      document.documentElement.innerHTML = '';
      
      // Set XML content type
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml';
      document.head.appendChild(meta);
      
      // Write the XML content directly
      document.write(sitemap.content);
    }
  }, [sitemap]);

  // Return null as we're handling the document content directly
  return null;
};

export default Sitemap;