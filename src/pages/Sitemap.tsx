import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Sitemap = () => {
  const { categorySlug } = useParams();

  const { data: pages, isLoading } = useQuery({
    queryKey: ['sitemap-pages', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, updated_at')
        .eq('category_id', categorySlug);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return null;
  }

  if (!pages) {
    return <div>No pages found</div>;
  }

  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${window.location.origin}/${categorySlug}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  // Set the content type to XML
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  // Create an iframe to display the XML content
  return (
    <iframe 
      src={url} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        border: 'none' 
      }}
      title="Sitemap XML"
    />
  );
};

export default Sitemap;