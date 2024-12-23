import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { MainDomainSection } from "./domains/MainDomainSection";
import { CategoryUrlsTable } from "./domains/CategoryUrlsTable";
import { BashScriptGenerator } from "./domains/BashScriptGenerator";
import { updateDomainMapping } from "./domains/DomainMappingService";
import { generateSitemap, downloadSitemap } from "./domains/SitemapService";

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
      return data || [];
    },
  });

  const updateDomainMappingMutation = useMutation({
    mutationFn: updateDomainMapping,
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
    updateDomainMappingMutation.mutate({ domain, isMain: true });
  };

  const handleCategoryUrlSubmit = (categoryId: string, url: string) => {
    if (!url) return;
    updateDomainMappingMutation.mutate({ categoryId, domain: url });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const handleGenerateSitemap = async (categoryId: string, domain: string) => {
    try {
      await generateSitemap(categoryId, domain);
      toast.success("Sitemap generated successfully");
    } catch (error: any) {
      console.error('Error generating sitemap:', error);
      toast.error(error.message || "Failed to generate sitemap");
    }
  };

  const handleDownloadSitemap = async (categoryId: string) => {
    try {
      const content = await downloadSitemap(categoryId);
      const blob = new Blob([content], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading sitemap:', error);
      toast.error(error.message || "Failed to download sitemap");
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
          onDownloadSitemap={handleDownloadSitemap}
          onUpdateSitemap={handleGenerateSitemap}
        />
      </Card>

      <BashScriptGenerator />
    </div>
  );
};