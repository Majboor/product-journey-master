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

      // Set content type and display XML
      document.body.innerHTML = '';
      document.body.style.margin = '0';
      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '20px';
      pre.style.whiteSpace = 'pre-wrap';
      pre.textContent = xml;
      document.body.appendChild(pre);

      // Set XML content type
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml';
      document.head.appendChild(meta);
    }
  }, [pages, isLoading, categorySlug, domainMappings]);

  if (isLoading) {
    return null;
  }

  if (!pages) {
    return <div>No pages found</div>;
  }

  return null;
};

export default Sitemap;