import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, ExternalLink, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

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
  const openSitemap = (categorySlug: string) => {
    const mapping = domainMappings?.find(dm => dm.category_id === categorySlug);
    const mainMapping = domainMappings?.find(dm => dm.is_main);
    const domain = mapping?.domain || mainMapping?.domain || window.location.host;
    const sitemapUrl = `${window.location.protocol}//${domain}/${categorySlug}/sitemap.xml`;
    const win = window.open(sitemapUrl, '_blank');
    if (win) {
      win.focus();
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
                    onClick={() => openSitemap(category.slug)}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Sitemap
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await onUpdateSitemap(category.id, domain);
                        toast.success("Sitemap updated successfully");
                      } catch (error) {
                        toast.error("Failed to update sitemap");
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Update Sitemap
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