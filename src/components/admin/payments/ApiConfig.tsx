import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ApiConfig = () => {
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

  const { data: testMode, isLoading } = useQuery({
    queryKey: ['ziina-test-mode'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ZIINA_TEST_MODE')
        .maybeSingle();
      
      if (error) throw error;
      return data?.value === 'true';
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
      queryClient.invalidateQueries({ queryKey: ['ziina-key'] });
    } catch (error) {
      toast.error("Failed to update Ziina API key");
    }
  };

  const updateTestMode = async (value: string) => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ 
          name: 'ZIINA_TEST_MODE',
          value: value
        });

      if (error) throw error;

      toast.success(`Test mode ${value === 'true' ? 'enabled' : 'disabled'}`);
      await queryClient.invalidateQueries({ queryKey: ['ziina-test-mode'] });
    } catch (error) {
      console.error('Error updating test mode:', error);
      toast.error("Failed to update test mode");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Ziina API Configuration</h2>
      <div className="space-y-6">
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
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Test Mode</label>
          <Select
            disabled={isLoading}
            onValueChange={updateTestMode}
            value={testMode ? 'true' : 'false'}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select test mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Enable test mode to process payments in sandbox environment
          </p>
        </div>
      </div>
    </Card>
  );
};