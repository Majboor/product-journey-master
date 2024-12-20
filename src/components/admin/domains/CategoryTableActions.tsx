import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CategoryTableActionsProps {
  categoryId: string;
  onDownloadSitemap: (categoryId: string) => void;
  onUpdateSitemap: (categoryId: string, domain: string) => Promise<void>;
  domain: string;
}

export const CategoryTableActions = ({
  categoryId,
  onDownloadSitemap,
  onUpdateSitemap,
  domain,
}: CategoryTableActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => onDownloadSitemap(categoryId)}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Sitemap
      </Button>
    </div>
  );
};