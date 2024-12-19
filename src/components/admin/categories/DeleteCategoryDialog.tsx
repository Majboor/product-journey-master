import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface DeleteCategoryDialogProps {
  onDelete: (deletePages: boolean, deleteAnalytics: boolean) => Promise<void>;
  deletePages: boolean;
  setDeletePages: (checked: boolean) => void;
  deleteAnalytics: boolean;
  setDeleteAnalytics: (checked: boolean) => void;
}

export const DeleteCategoryDialog = ({
  onDelete,
  deletePages,
  setDeletePages,
  deleteAnalytics,
  setDeleteAnalytics
}: DeleteCategoryDialogProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <p>This action cannot be undone.</p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deletePages"
              checked={deletePages}
              onCheckedChange={(checked) => setDeletePages(checked as boolean)}
            />
            <label htmlFor="deletePages">
              Delete all pages in this category
            </label>
          </div>
          {deletePages && (
            <div className="flex items-center space-x-2 ml-6">
              <Checkbox
                id="deleteAnalytics"
                checked={deleteAnalytics}
                onCheckedChange={(checked) => setDeleteAnalytics(checked as boolean)}
              />
              <label htmlFor="deleteAnalytics">
                Delete all analytics data for these pages
              </label>
            </div>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onDelete(deletePages, deleteAnalytics)}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};