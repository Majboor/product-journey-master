import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, RefreshCw, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DomainMapping {
  category_id: string;
  domain: string;
  is_main: boolean;
}

interface CategoryUrlsTableProps {
  categories: Category[];
  domainMappings: DomainMapping[];
  categoryUrls: Record<string, string>;
  onUrlChange: (categoryId: string, url: string) => void;
  onUrlSubmit: (categoryId: string, url: string) => void;
  onCopyLink: (text: string) => void;
  onDownloadSitemap: (categorySlug: string) => void;
  onUpdateSitemap: (categoryId: string, domain: string) => Promise<void>;
}

export const CategoryUrlsTable = ({
  categories,
  domainMappings,
  categoryUrls,
  onUrlChange,
  onUrlSubmit,
  onCopyLink,
  onDownloadSitemap,
  onUpdateSitemap,
}: CategoryUrlsTableProps) => {
  const handleSitemapUpdate = async (categoryId: string, domain: string) => {
    try {
      await onUpdateSitemap(categoryId, domain);
      toast.success("Sitemap updated successfully");
    } catch (error) {
      console.error('Error updating sitemap:', error);
      toast.error("Failed to update sitemap");
    }
  };

  const copySitemapUrl = (domain: string, categorySlug: string) => {
    const sitemapUrl = `https://${domain}/${categorySlug}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl);
    toast.success("Sitemap URL copied to clipboard");
  };

  const viewSitemap = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('sitemaps')
        .select('content')
        .eq('category_id', categoryId)
        .order('last_generated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!data?.content) {
        toast.error("No sitemap found. Try updating the sitemap first.");
        return;
      }

      const blob = new Blob([data.content], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `sitemap.xml`; // Set the download filename
      
      // Simulate click to trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error viewing sitemap:', error);
      toast.error("Failed to view sitemap");
    }
  };

  return (
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
          const domain = mapping?.domain || mainMapping?.domain || window.location.host;
          const liveLink = `https://${domain}/${category.slug}`;

          return (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Input
                    value={categoryUrls[category.id] || mapping?.domain || ''}
                    onChange={(e) => onUrlChange(category.id, e.target.value)}
                    placeholder="Enter custom URL"
                  />
                  <Button
                    onClick={() => onUrlSubmit(category.id, categoryUrls[category.id])}
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
                    onClick={() => onCopyLink(liveLink)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onDownloadSitemap(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Sitemap
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSitemapUpdate(category.id, domain)}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update Sitemap
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => viewSitemap(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Sitemap
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copySitemapUrl(domain, category.slug)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};