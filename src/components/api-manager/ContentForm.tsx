import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContentFormProps {
  slug: string;
  content: string;
  loading: boolean;
  onSlugChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContentForm = ({
  slug,
  content,
  loading,
  onSlugChange,
  onContentChange,
  onReset,
  onSubmit
}: ContentFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          Page Slug
        </label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="e.g., menu"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Page Content (JSON)
        </label>
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
          {loading ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </form>
  );
};