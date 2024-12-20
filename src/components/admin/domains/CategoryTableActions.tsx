import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ApachePathDialog } from "./ApachePathDialog";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [isLocalDownloadDialogOpen, setIsLocalDownloadDialogOpen] = useState(false);
  const [localPath, setLocalPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const deployToApache = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-apache-sitemap', {
        body: {
          categoryId,
        },
      });

      if (error) throw error;
      
      toast.success("Sitemap deployed successfully");
      toast.success(`File location: ${data.path}`);
      toast.success(`Public URL: ${data.url}`);
      
      setIsApacheDialogOpen(false);
    } catch (error) {
      console.error('Error deploying sitemap:', error);
      toast.error("Failed to deploy sitemap");
    }
  };

  const downloadLocally = async () => {
    setIsLoading(true);
    try {
      if (!localPath) {
        toast.error("Please enter a valid file path");
        return;
      }

      const { data, error } = await supabase.functions.invoke('save-sitemap-locally', {
        body: {
          categoryId,
          localPath,
        },
      });

      if (error) throw error;
      if (!data.success) {
        throw new Error(data.error || 'Failed to save sitemap');
      }
      
      setIsLocalDownloadDialogOpen(false);
      toast.success("Sitemap saved successfully");
      toast.success(`File location: ${data.path}`);
    } catch (error: any) {
      console.error('Error saving sitemap:', error);
      toast.error(error.message || "Failed to save sitemap locally");
    } finally {
      setIsLoading(false);
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
        Deploy to Storage
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsLocalDownloadDialogOpen(true)}
      >
        Save Locally
      </Button>

      <ApachePathDialog
        isOpen={isApacheDialogOpen}
        onOpenChange={setIsApacheDialogOpen}
        onDeploy={deployToApache}
      />

      <Dialog open={isLocalDownloadDialogOpen} onOpenChange={setIsLocalDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Sitemap Locally</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter server path (e.g., /var/www/sitemaps)"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsLocalDownloadDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={downloadLocally}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};