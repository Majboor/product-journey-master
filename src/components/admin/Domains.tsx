import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Domains = () => {
  const [mainDomain, setMainDomain] = useState("");
  const [categoryUrls, setCategoryUrls] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  
  // Fetch categories and their domain mappings
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

  // Update domain mapping mutation
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

  const handleMainDomainSubmit = () => {
    if (!mainDomain) return;
    updateDomainMapping.mutate({ domain: mainDomain, isMain: true });
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
      const domain = categoryDomainMapping?.domain || mainDomainMapping?.domain || window.location.origin;

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${domain}/${categorySlug}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap-${categorySlug}.xml`;
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
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Main Domain</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Domain URL
            </label>
            <Input
              value={mainDomain}
              onChange={(e) => setMainDomain(e.target.value)}
              placeholder="Enter main domain (e.g., https://example.com)"
            />
          </div>
          <Button onClick={handleMainDomainSubmit} disabled={!mainDomain}>
            Set Main Domain
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Category URLs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Custom URL</TableHead>
              <TableHead>Live Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => {
              const mapping = domainMappings?.find(dm => dm.category_id === category.id);
              const mainMapping = domainMappings?.find(dm => dm.is_main);
              const domain = mapping?.domain || mainMapping?.domain || window.location.origin;
              const liveLink = `${domain}/${category.slug}`;

              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Input
                        value={categoryUrls[category.id] || mapping?.domain || ''}
                        onChange={(e) => setCategoryUrls({
                          ...categoryUrls,
                          [category.id]: e.target.value
                        })}
                        placeholder="Enter custom URL"
                      />
                      <Button
                        onClick={() => handleCategoryUrlSubmit(category.id, categoryUrls[category.id])}
                        disabled={!categoryUrls[category.id]}
                      >
                        Save
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{liveLink}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(liveLink)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => downloadSitemap(category.id)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Sitemap
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};