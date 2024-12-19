import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileEdit, Trash, FolderOpen, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";

export const Categories = () => {
  const navigate = useNavigate();
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

  const { data: categoryAnalytics } = useQuery({
    queryKey: ['category-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Group analytics by day for each category
      const analyticsMap = new Map();
      
      data.forEach(visit => {
        const date = new Date(visit.created_at).toISOString().split('T')[0];
        const categorySlug = visit.page_slug.split('/')[0];
        
        if (!analyticsMap.has(categorySlug)) {
          analyticsMap.set(categorySlug, new Map());
        }
        
        const categoryData = analyticsMap.get(categorySlug);
        categoryData.set(date, (categoryData.get(date) || 0) + 1);
      });

      // Convert to chart data format
      const result = {};
      analyticsMap.forEach((categoryData, categorySlug) => {
        const chartData = Array.from(categoryData.entries()).map(([date, count]) => ({
          date,
          visits: count
        }));
        result[categorySlug] = chartData;
      });

      return result;
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

  const handleCategoryClick = (categoryId: string, categorySlug: string) => {
    setSelectedCategory(categoryId);
    navigate(`/admin/categories/${categorySlug}`);
  };

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
              onClick={() => handleCategoryClick(category.id, category.slug)}
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{category.description}</p>
                
                {/* Analytics Chart */}
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={categoryAnalytics?.[category.slug] || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
                            onClick={() => navigate(`/admin/api-manager?edit=${page.slug}`)}
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