import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApachePathDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeploy: (path: string) => void;
}

export const ApachePathDialog = ({
  isOpen,
  onOpenChange,
  onDeploy,
}: ApachePathDialogProps) => {
  const [apachePath, setApachePath] = useState("/var/www/html");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={() => onDeploy(apachePath)}>Deploy Sitemap</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};