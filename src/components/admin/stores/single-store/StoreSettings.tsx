import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

interface StoreSettingsProps {
  store: Tables<'categories'>;
}

export const StoreSettings = ({ store }: StoreSettingsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description || '');

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name, description })
        .eq('id', store.id);

      if (error) throw error;

      // Update store page content with new name
      const { data: pages } = await supabase
        .from('pages')
        .select('*')
        .eq('category_id', store.id);

      if (pages && pages.length > 0) {
        const mainPage = pages[0];
        const content = mainPage.content as any;
        content.brandName = name;

        const { error: pageError } = await supabase
          .from('pages')
          .update({ content })
          .eq('id', mainPage.id);

        if (pageError) throw pageError;
      }

      queryClient.invalidateQueries({ queryKey: ['store', store.slug] });
      queryClient.invalidateQueries({ queryKey: ['store-pages', store.id] });

      toast({
        title: "Success",
        description: "Store settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update store settings.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Store Name</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter store name"
          />
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter store description"
          />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};