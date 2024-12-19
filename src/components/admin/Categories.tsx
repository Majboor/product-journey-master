import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileEdit, Trash, FolderOpen, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: pages, isLoading: loadingPages } = useQuery({
    queryKey: ['category-pages', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          analytics (count)
        `)
        .eq('category_id', selectedCategory);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory
  });

  if (loadingCategories) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => {}}>Create New Category</Button>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <Card key={category.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader 
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                <CardTitle className="text-xl font-medium">
                  {category.name}
                </CardTitle>
              </div>
              <ChevronRight className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pages in Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {pages?.map((page) => (
                  <Card key={page.id} className="w-[300px] flex-shrink-0">
                    <CardHeader>
                      <CardTitle className="text-lg">{page.slug}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium">Visitors</div>
                          <Progress value={45} className="mt-2" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {}}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {}}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};