import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "./categories/CategoryCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/admin/categories/${categorySlug}`);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category. Please try again.",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast({
      title: "Success",
      description: "Category deleted successfully.",
    });
  };

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
          <CategoryCard
            key={category.id}
            category={category}
            analytics={categoryAnalytics?.[category.slug] || []}
            onClick={() => handleCategoryClick(category.slug)}
            onDelete={() => handleDeleteCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
};