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
    try {
      if (!localPath) {
        toast.error("Please enter a valid file path");
        return;
      }

      const { data: sitemap, error } = await supabase
        .from('sitemaps')
        .select('content')
        .eq('category_id', categoryId)
        .order('last_generated', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!sitemap?.content) {
        toast.error("No sitemap found. Try updating the sitemap first.");
        return;
      }

      // Create a blob with the XML content
      const blob = new Blob([sitemap.content], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `${localPath}/sitemap.xml`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLocalDownloadDialogOpen(false);
      toast.success("Sitemap downloaded successfully");
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      toast.error("Failed to download sitemap");
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
        Download Locally
      </Button>

      <ApachePathDialog
        isOpen={isApacheDialogOpen}
        onOpenChange={setIsApacheDialogOpen}
        onDeploy={deployToApache}
      />

      <Dialog open={isLocalDownloadDialogOpen} onOpenChange={setIsLocalDownloadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Sitemap Locally</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter file path (e.g., /path/to/folder)"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocalDownloadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={downloadLocally}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};