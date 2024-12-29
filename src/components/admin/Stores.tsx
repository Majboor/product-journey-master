import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StoreCard } from "./stores/StoreCard";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DeleteStoreDialog } from "./stores/DeleteStoreDialog";

export const Stores = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletePages, setDeletePages] = useState(false);
  const [deleteAnalytics, setDeleteAnalytics] = useState(false);
  
  const { data: stores, isLoading: loadingStores } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: storeAnalytics } = useQuery({
    queryKey: ['store-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      const analyticsMap = new Map();
      
      data.forEach(visit => {
        const date = new Date(visit.created_at).toISOString().split('T')[0];
        const storeSlug = visit.page_slug.split('/')[0];
        
        if (!analyticsMap.has(storeSlug)) {
          analyticsMap.set(storeSlug, new Map());
        }
        
        const storeData = analyticsMap.get(storeSlug);
        storeData.set(date, (storeData.get(date) || 0) + 1);
      });

      const result = {};
      analyticsMap.forEach((storeData, storeSlug) => {
        const chartData = Array.from(storeData.entries()).map(([date, count]) => ({
          date,
          visits: count
        }));
        result[storeSlug] = chartData;
      });

      return result;
    }
  });

  const handleStoreClick = (storeSlug: string) => {
    navigate(`/admin/stores/${storeSlug}`);
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      if (deletePages) {
        // Get all pages for this store
        const { data: pages } = await supabase
          .from('pages')
          .select('slug')
          .eq('category_id', storeId);

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
            .eq('category_id', storeId);

          if (pagesError) throw pagesError;
        }
      }

      // Finally delete the store
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Success",
        description: "Store and related data deleted successfully.",
      });

      // Reset checkboxes
      setDeletePages(false);
      setDeleteAnalytics(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete store. Please try again.",
      });
    }
  };

  if (loadingStores) {
    return <div>Loading stores...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stores</h1>
        <Button onClick={() => navigate('/admin/stores/new')}>Create New Store</Button>
      </div>

      <div className="grid gap-4">
        {stores?.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            analytics={storeAnalytics?.[store.slug] || []}
            onClick={() => handleStoreClick(store.slug)}
            onDelete={() => (
              <DeleteStoreDialog
                onDelete={(deletePages, deleteAnalytics) => 
                  handleDeleteStore(store.id)
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