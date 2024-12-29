import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsList } from "./single-store/ProductsList";
import { StoreSettings } from "./single-store/StoreSettings";
import { CategoryManager } from "./single-store/CategoryManager";
import { ErrorPage } from "@/components/ErrorPage";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export const SingleStore = () => {
  const { storeSlug } = useParams();

  const { data: store, isLoading, error } = useQuery({
    queryKey: ['store', storeSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', storeSlug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: pages } = useQuery({
    queryKey: ['store-pages', store?.id],
    enabled: !!store?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('category_id', store.id);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading store...</div>;
  }

  if (error) {
    return <ErrorPage 
      title="Error Loading Store" 
      description={error.message} 
    />;
  }

  if (!store) {
    return <ErrorPage 
      title="Store Not Found" 
      description="The requested store could not be found." 
    />;
  }

  const mainPage = pages?.[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-muted-foreground">{store.description}</p>
        </div>
        <div className="flex gap-4">
          {mainPage && (
            <Link 
              to={`/${store.slug}`} 
              target="_blank" 
              className="inline-flex items-center"
            >
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Store
              </Button>
            </Link>
          )}
          <Button>Add Product</Button>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <ProductsList storeId={store.id} pages={pages || []} />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <CategoryManager storeId={store.id} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <StoreSettings store={store} />
        </TabsContent>
      </Tabs>
    </div>
  );
};