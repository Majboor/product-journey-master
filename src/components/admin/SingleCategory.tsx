import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SingleCategory = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ['single-category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: pages, isLoading: loadingPages } = useQuery({
    queryKey: ['category-pages', category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('category_id', category.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id
  });

  const { data: categoryAnalytics } = useQuery({
    queryKey: ['single-category-analytics', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .like('page_slug', `${slug}/%`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      // Group analytics by day
      const analyticsMap = new Map();
      
      data.forEach(visit => {
        const date = new Date(visit.created_at).toISOString().split('T')[0];
        analyticsMap.set(date, (analyticsMap.get(date) || 0) + 1);
      });

      // Convert to chart data format
      return Array.from(analyticsMap.entries()).map(([date, count]) => ({
        date,
        visits: count
      }));
    }
  });

  if (loadingCategory || loadingPages) {
    return <div>Loading category...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <Button onClick={() => navigate('/admin/api-manager')}>Create New Page</Button>
      </div>

      {/* Category Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={categoryAnalytics || []}
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
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
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
                        <div className="text-sm font-medium">Page Content</div>
                        <p className="text-sm text-muted-foreground truncate">
                          {JSON.stringify(page.content).slice(0, 50)}...
                        </p>
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
    </div>
  );
};