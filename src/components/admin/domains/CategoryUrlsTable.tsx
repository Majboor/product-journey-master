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
import { useState, useEffect } from "react";

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
  const [localUrls, setLocalUrls] = useState<Record<string, string>>({});

  // Initialize localUrls with existing values
  useEffect(() => {
    const initialUrls: Record<string, string> = {};
    categories?.forEach((category) => {
      const mapping = domainMappings?.find(dm => dm.category_id === category.id);
      if (mapping?.domain) {
        initialUrls[category.id] = mapping.domain;
      }
    });
    setLocalUrls(initialUrls);
  }, [categories, domainMappings]);

  const handleUrlSubmit = async (categoryId: string, url: string) => {
    if (!url) return;
    
    // Update both local and parent state
    setLocalUrls(prev => ({
      ...prev,
      [categoryId]: url
    }));
    
    // First save the URL
    onUrlSubmit(categoryId, url);
    
    try {
      // Then update the sitemap with the new domain
      await onUpdateSitemap(categoryId, url);
    } catch (error) {
      console.error('Error updating sitemap:', error);
    }
  };

  const handleLocalUrlChange = (categoryId: string, url: string) => {
    setLocalUrls(prev => ({
      ...prev,
      [categoryId]: url
    }));
    onUrlChange(categoryId, url);
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
                    value={localUrls[category.id] || ''}
                    onChange={(e) => handleLocalUrlChange(category.id, e.target.value)}
                    placeholder="Enter custom URL"
                  />
                  <Button
                    onClick={() => handleUrlSubmit(category.id, localUrls[category.id])}
                    disabled={!localUrls[category.id]}
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