import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContentFormFieldsProps {
  slug: string;
  content: string;
  loading: boolean;
  isEditing?: boolean;
  onSlugChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContentFormFields = ({
  slug,
  content,
  loading,
  isEditing,
  onSlugChange,
  onContentChange,
  onReset,
  onSubmit
}: ContentFormFieldsProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="slug">Page Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="e.g., menu"
          required
          readOnly={isEditing}
          className={isEditing ? "bg-muted" : ""}
        />
      </div>

      <div>
        <Label htmlFor="content">Page Content (JSON)</Label>
        <div className="mb-2 text-sm text-muted-foreground">
          Include colorScheme in your JSON to customize the page colors:
          {`{
  "colorScheme": {
    "primary": "#2563eb",
    "secondary": "#f0f9ff",
    "accent": "#dbeafe"
  }
}`}
        </div>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="font-mono min-h-[300px]"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Content" : "Save Content"}
        </Button>
      </div>
    </form>
  );
};