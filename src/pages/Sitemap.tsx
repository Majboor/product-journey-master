import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Sitemap = () => {
  const { categorySlug } = useParams();

  const { data: pages, isLoading } = useQuery({
    queryKey: ['sitemap-pages', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('pages')
        .select('slug, updated_at');
      
      if (categorySlug) {
        query = query.eq('category_id', categorySlug);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: domainMappings } = useQuery({
    queryKey: ['domain-mappings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_mappings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && pages) {
      const mainDomainMapping = domainMappings?.find(dm => dm.is_main);
      const categoryDomainMapping = categorySlug ? domainMappings?.find(dm => dm.category_id === categorySlug) : null;
      const domain = categoryDomainMapping?.domain || mainDomainMapping?.domain || window.location.host;

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>https://${domain}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      // Set the content type to XML
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);

      // If accessed directly (not in an iframe), download the file
      if (window.self === window.top) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `sitemap.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // If in iframe, display the content
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.src = url;
        }
      }
    }
  }, [pages, isLoading, categorySlug, domainMappings]);

  if (isLoading) {
    return null;
  }

  if (!pages) {
    return <div>No pages found</div>;
  }

  return (
    <iframe 
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