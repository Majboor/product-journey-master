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

  const generateSitemap = async (categoryId: string, domain: string) => {
    try {
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('slug, updated_at')
        .eq('category_id', categoryId);

      if (pagesError) throw pagesError;
      if (!pages || pages.length === 0) {
        toast.error("No pages found for this category");
        return;
      }

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

      const { error: sitemapError } = await supabase
        .from('sitemaps')
        .upsert({
          category_id: categoryId,
          content: sitemap,
          last_generated: new Date().toISOString(),
        }, {
          onConflict: 'category_id'
        });

      if (sitemapError) throw sitemapError;

    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  };

  const downloadSitemap = async (categoryId: string) => {
    try {
      const { data: sitemap, error } = await supabase
        .from('sitemaps')
        .select('content')
        .eq('category_id', categoryId)
        .single();

      if (error) throw error;
      
      if (!sitemap?.content) {
        toast.error("No sitemap found. Try updating the sitemap first.");
        return;
      }

      const blob = new Blob([sitemap.content], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast.error("Failed to download sitemap");
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
          onUpdateSitemap={generateSitemap}
        />
      </Card>
    </div>
  );
};