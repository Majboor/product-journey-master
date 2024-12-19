import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pages = () => {
  const navigate = useNavigate();
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading pages...</div>;
  }

  // Check if root page exists
  const hasRootPage = pages?.some(page => page.slug === '');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pages Management</h1>
        <div className="space-x-4">
          {!hasRootPage && (
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/api-manager?edit=')}
            >
              Create Root Page
            </Button>
          )}
          <Button onClick={() => navigate('/admin/api-manager')}>Create New Page</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {pages?.map((page) => (
          <Card key={page.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                {page.slug === '' ? '/' : `/${page.slug}`}
              </CardTitle>
              <div className="flex gap-2">
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
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(page.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};