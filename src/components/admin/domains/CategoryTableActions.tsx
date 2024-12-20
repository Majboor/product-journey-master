import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ApachePathDialog } from "./ApachePathDialog";

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
  const [isApacheDialogOpen, setIsApacheDialogOpen] = useState(false);

  const deployToApache = async (apachePath: string) => {
    try {
      const response = await fetch('/functions/v1/manage-apache-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          categoryId,
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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => onDownloadSitemap(categoryId)}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Sitemap
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsApacheDialogOpen(true)}
      >
        Deploy to Apache
      </Button>

      <ApachePathDialog
        isOpen={isApacheDialogOpen}
        onOpenChange={setIsApacheDialogOpen}
        onDeploy={deployToApache}
      />
    </div>
  );
};