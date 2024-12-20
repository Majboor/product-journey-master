import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { MainDomainSection } from "./domains/MainDomainSection";
import { CategoryUrlsTable } from "./domains/CategoryUrlsTable";

export const Domains = () => {
  const [categoryUrls, setCategoryUrls] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
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

  const updateDomainMapping = useMutation({
    mutationFn: async ({ categoryId, domain, isMain = false }: { categoryId?: string, domain: string, isMain?: boolean }) => {
      const { error } = await supabase
        .from('domain_mappings')
        .upsert({
          category_id: categoryId,
          domain,
          is_main: isMain,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-mappings'] });
      toast.success("Domain mapping updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update domain mapping");
      console.error(error);
    },
  });

  const handleMainDomainSubmit = (domain: string) => {
    if (!domain) return;
    updateDomainMapping.mutate({ domain, isMain: true });
  };

  const handleCategoryUrlSubmit = (categoryId: string, url: string) => {
    if (!url) return;
    updateDomainMapping.mutate({ categoryId, domain: url });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const downloadSitemap = async (categorySlug: string) => {
    try {
      const { data: pages } = await supabase
        .from('pages')
        .select('slug, updated_at')
        .eq('category_id', categorySlug);

      if (!pages) throw new Error("No pages found");

      const mainDomainMapping = domainMappings?.find(dm => dm.is_main);
      const categoryDomainMapping = domainMappings?.find(dm => dm.category_id === categorySlug);
      const domain = categoryDomainMapping?.domain || mainDomainMapping?.domain || window.location.host;

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>https://${domain}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to generate sitemap");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <MainDomainSection onSubmit={handleMainDomainSubmit} />
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Category URLs</h2>
        <CategoryUrlsTable
          categories={categories || []}
          domainMappings={domainMappings || []}
          categoryUrls={categoryUrls}
          onUrlChange={(categoryId, url) => setCategoryUrls({
            ...categoryUrls,
            [categoryId]: url
          })}
          onUrlSubmit={handleCategoryUrlSubmit}
          onCopyLink={copyToClipboard}
          onDownloadSitemap={downloadSitemap}
        />
      </Card>
    </div>
  );
};