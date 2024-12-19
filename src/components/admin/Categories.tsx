import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "./categories/CategoryCard";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DeleteCategoryDialog } from "./categories/DeleteCategoryDialog";

export const Categories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletePages, setDeletePages] = useState(false);
  const [deleteAnalytics, setDeleteAnalytics] = useState(false);
  
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
    try {
      if (deletePages) {
        // Get all pages for this category
        const { data: pages } = await supabase
          .from('pages')
          .select('slug')
          .eq('category_id', categoryId);

        if (pages && pages.length > 0) {
          const pageSlugs = pages.map(page => page.slug);

          if (deleteAnalytics) {
            // Delete analytics for these pages
            const { error: analyticsError } = await supabase
              .from('analytics')
              .delete()
              .in('page_slug', pageSlugs);

            if (analyticsError) throw analyticsError;

            // Delete button clicks
            const { error: buttonClicksError } = await supabase
              .from('button_clicks')
              .delete()
              .in('page_slug', pageSlugs);

            if (buttonClicksError) throw buttonClicksError;

            // Delete signin attempts
            const { error: signinError } = await supabase
              .from('signin_attempts')
              .delete()
              .in('page_slug', pageSlugs);

            if (signinError) throw signinError;

            // Delete swipe events
            const { error: swipeError } = await supabase
              .from('swipe_events')
              .delete()
              .in('page_slug', pageSlugs);

            if (swipeError) throw swipeError;
          }

          // Delete the pages
          const { error: pagesError } = await supabase
            .from('pages')
            .delete()
            .eq('category_id', categoryId);

          if (pagesError) throw pagesError;
        }
      }

      // Finally delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Success",
        description: "Category and related data deleted successfully.",
      });

      // Reset checkboxes
      setDeletePages(false);
      setDeleteAnalytics(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
      });
    }
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
            onDelete={() => (
              <DeleteCategoryDialog
                onDelete={(deletePages, deleteAnalytics) => 
                  handleDeleteCategory(category.id)
                }
                deletePages={deletePages}
                setDeletePages={setDeletePages}
                deleteAnalytics={deleteAnalytics}
                setDeleteAnalytics={setDeleteAnalytics}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
};