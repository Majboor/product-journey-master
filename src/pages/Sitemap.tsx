import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Sitemap = () => {
  const { categorySlug } = useParams();

  useEffect(() => {
    const fetchAndServeSitemap = async () => {
      try {
        let query = supabase.from('sitemaps').select('content');
        
        if (categorySlug) {
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();
            
          if (category) {
            query = query.eq('category_id', category.id);
          }
        } else {
          query = query.is('category_id', null);
        }

        const { data: sitemap } = await query.single();

        if (sitemap?.content) {
          // Create a blob with the XML content
          const blob = new Blob([sitemap.content], { type: 'application/xml' });
          const url = URL.createObjectURL(blob);
          
          // Navigate to the blob URL
          window.location.href = url;
          
          // Clean up the URL object after navigation
          setTimeout(() => URL.revokeObjectURL(url), 100);
        }
      } catch (error) {
        console.error('Error fetching sitemap:', error);
      }
    };

    fetchAndServeSitemap();
  }, [categorySlug]);

  // Return null as we're handling the navigation
  return null;
};

export default Sitemap;