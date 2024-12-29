import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface CategoryManagerProps {
  storeId: string;
}

export const CategoryManager = ({ storeId }: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddCategory = async () => {
    try {
      const { error } = await supabase
        .from('pages')
        .insert([{
          category_id: storeId,
          slug: `categories/${newCategory.toLowerCase().replace(/\s+/g, '-')}`,
          content: {
            brandName: "",
            hero: {
              title: newCategory,
              description: `Products in ${newCategory}`,
              image: "/placeholder.svg",
              price: 0
            },
            product: {
              images: [],
              details: {
                title: "",
                price: 0,
                description: "",
                specifications: [],
                buyNowLink: "#"
              },
              features: []
            },
            features: [],
            reviews: [],
            footer: {
              contact: {
                email: "",
                phone: "",
                address: ""
              },
              links: []
            }
          }
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: ['store-pages'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
      </div>
    </Card>
  );
};