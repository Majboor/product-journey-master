import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductsListProps {
  storeId: string;
  categoryId: string;
}

export const ProductsList = ({ storeId, categoryId }: ProductsListProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_category_id', categoryId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Products</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {product.description || 'No description'}
                </p>
              </div>
              <div className="text-lg font-semibold">
                ${product.price}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};