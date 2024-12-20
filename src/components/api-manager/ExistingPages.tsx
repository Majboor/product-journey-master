import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ExistingPagesProps {
  onLoadPage: (slug: string, content: any) => void;
}

export const ExistingPages = ({ onLoadPage }: ExistingPagesProps) => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, content')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleEdit = (slug: string, content: any) => {
    onLoadPage(slug, content);
  };

  if (isLoading) {
    return <p>Loading pages...</p>;
  }

  if (!pages?.length) {
    return <p>No pages found. Create your first page in the Content Editor tab.</p>;
  }

  return (
    <Card className="p-6">
      <div className="grid gap-4">
        {pages.map((page) => (
          <div key={page.slug} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{page.slug === '' ? '/ (Root)' : `/${page.slug}`}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(page.slug, page.content)}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};