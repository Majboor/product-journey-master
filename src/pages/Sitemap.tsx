import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

const Sitemap = () => {
  const { categorySlug } = useParams();
  const xmlContentRef = useRef<HTMLDivElement>(null);

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
    if (sitemap?.content && xmlContentRef.current) {
      // Set response headers
      const headers = new Headers({
        'Content-Type': 'application/xml',
        'X-Content-Type-Options': 'nosniff'
      });

      // Create response with XML content
      const response = new Response(sitemap.content, { headers });

      // Convert response to blob and create URL
      response.blob().then(blob => {
        const url = URL.createObjectURL(blob);
        window.location.replace(url);
        
        // Clean up URL object after navigation
        setTimeout(() => URL.revokeObjectURL(url), 100);
      });
    }
  }, [sitemap]);

  // Return a hidden container while processing
  return <div ref={xmlContentRef} style={{ display: 'none' }} />;
};

export default Sitemap;