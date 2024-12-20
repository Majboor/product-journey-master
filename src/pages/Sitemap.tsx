import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  // Set XML content type and write the XML directly to the document
  if (sitemap?.content) {
    document.open('text/xml');
    document.write(sitemap.content);
    document.close();
    return null;
  }

  return null;
};

export default Sitemap;