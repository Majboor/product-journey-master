import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ApiKeySection = () => {
  const [apiKey, setApiKey] = useState("");
  const queryClient = useQueryClient();
  
  const { data: ziinaKey } = useQuery({
    queryKey: ['ziina-key'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ZIINA_API_KEY')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const updateApiKey = async () => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ 
          name: 'ZIINA_API_KEY',
          value: apiKey 
        });

      if (error) throw error;

      toast.success("Ziina API key updated successfully");
      setApiKey("");
      await queryClient.invalidateQueries({ queryKey: ['ziina-key'] });
    } catch (error) {
      toast.error("Failed to update Ziina API key");
    }
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">
          API Key
        </label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={ziinaKey?.value ? "••••••••" : "Enter Ziina API key"}
        />
      </div>
      <Button onClick={updateApiKey} disabled={!apiKey}>
        Update API Key
      </Button>
    </div>
  );
};