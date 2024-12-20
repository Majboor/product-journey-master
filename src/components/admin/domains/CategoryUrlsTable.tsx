import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, RefreshCw } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

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
  const [isApacheDialogOpen, setIsApacheDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [apachePath, setApachePath] = useState("/var/www/html");

  const handleSitemapUpdate = async (categoryId: string, domain: string) => {
    try {
      await onUpdateSitemap(categoryId, domain);
      toast.success("Sitemap updated successfully");
    } catch (error) {
      console.error('Error updating sitemap:', error);
      toast.error("Failed to update sitemap");
    }
  };

  const handleApacheSitemap = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsApacheDialogOpen(true);
  };

  const deployToApache = async () => {
    if (!selectedCategoryId || !apachePath) return;

    try {
      const response = await fetch('/functions/v1/manage-apache-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          apachePath,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Sitemap deployed to Apache successfully");
      toast.success(`File location: ${data.path}`);
      toast.success(`Live URL: ${data.url}`);
      
      setIsApacheDialogOpen(false);
    } catch (error) {
      console.error('Error deploying sitemap:', error);
      toast.error("Failed to deploy sitemap to Apache");
    }
  };

  return (
    <>
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
                      onClick={() => handleApacheSitemap(category.id)}
                      className="flex items-center gap-2"
                    >
                      Deploy to Apache
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={isApacheDialogOpen} onOpenChange={setIsApacheDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Sitemap to Apache</DialogTitle>
            <DialogDescription>
              Enter the Apache root directory path where the sitemap should be deployed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Apache Directory Path</label>
              <Input
                value={apachePath}
                onChange={(e) => setApachePath(e.target.value)}
                placeholder="/var/www/html"
              />
            </div>
            <Button onClick={deployToApache}>Deploy Sitemap</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};