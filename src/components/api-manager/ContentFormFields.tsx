import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContentFormFieldsProps {
  slug: string;
  content: string;
  categoryId: string;
  loading: boolean;
  isEditing?: boolean;
  onSlugChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ContentFormFields = ({
  slug,
  content,
  categoryId,
  loading,
  isEditing,
  onSlugChange,
  onContentChange,
  onCategoryChange,
  onReset,
  onSubmit
}: ContentFormFieldsProps) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="slug">Page Slug</Label>
        <div className="text-sm text-muted-foreground mb-2">
          Leave empty for root page ("/")
        </div>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="e.g., menu (or leave empty for root page)"
          className={isEditing ? "bg-muted" : ""}
          readOnly={isEditing}
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
    "accent": "#dbeafe",
    "primaryText": "#ffffff",
    "secondaryText": "#000000",
    "accentText": "#000000"
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