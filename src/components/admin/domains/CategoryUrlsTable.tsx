import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryTableActions } from "./CategoryTableActions";

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
  const handleUrlSubmit = async (categoryId: string, url: string) => {
    onUrlSubmit(categoryId, url);
    // After saving the URL, update the sitemap with the new domain
    await onUpdateSitemap(categoryId, url);
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
                    onClick={() => handleUrlSubmit(category.id, categoryUrls[category.id])}
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
                <CategoryTableActions
                  categoryId={category.id}
                  onDownloadSitemap={onDownloadSitemap}
                  onUpdateSitemap={onUpdateSitemap}
                  domain={domain}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};