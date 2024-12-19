import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryHeader } from "./category/CategoryHeader";
import { CategoryAnalytics } from "./category/CategoryAnalytics";
import { PagesList } from "./category/PagesList";

export const SingleCategory = () => {
  const { slug } = useParams();

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

      const analyticsMap = new Map();
      
      data.forEach(visit => {
        const date = new Date(visit.created_at).toISOString().split('T')[0];
        analyticsMap.set(date, (analyticsMap.get(date) || 0) + 1);
      });

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
      <CategoryHeader name={category.name} description={category.description} />
      <CategoryAnalytics data={categoryAnalytics || []} />
      <PagesList pages={pages || []} />
    </div>
  );
};