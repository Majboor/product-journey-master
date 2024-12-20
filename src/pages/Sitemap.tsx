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

  const { data: sitemap, isLoading } = useQuery({
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
    if (!isLoading && sitemap) {
      // Set XML content type
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml';
      document.head.appendChild(meta);

      // Clear and set content
      document.body.innerHTML = '';
      document.body.style.margin = '0';
      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '20px';
      pre.style.whiteSpace = 'pre-wrap';
      pre.textContent = sitemap.content;
      document.body.appendChild(pre);
    }
  }, [sitemap, isLoading]);

  if (isLoading) {
    return null;
  }

  if (!sitemap) {
    return <div>No sitemap found. Please generate one first.</div>;
  }

  return null;
};

export default Sitemap;