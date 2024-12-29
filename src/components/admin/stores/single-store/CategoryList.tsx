import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Folder, Grid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "./CategoryForm";
import { useState } from "react";
import { ProductsList } from "./ProductsList";

interface CategoryListProps {
  storeId: string;
}

export const CategoryList = ({ storeId }: CategoryListProps) => {
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['store-categories', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('store_id', storeId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => setShowNewCategoryForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {showNewCategoryForm && (
        <CategoryForm 
          storeId={storeId} 
          onClose={() => setShowNewCategoryForm(false)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  {category.name}
                </div>
              </CardTitle>
              <Grid className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {category.description || 'No description'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <ProductsList 
          storeId={storeId} 
          categoryId={selectedCategory} 
        />
      )}
    </div>
  );
};