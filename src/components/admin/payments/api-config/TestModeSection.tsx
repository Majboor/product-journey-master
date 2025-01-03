import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TestModeSection = () => {
  const queryClient = useQueryClient();
  
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

  const updateTestMode = async (value: string) => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ 
          name: 'ZIINA_TEST_MODE',
          value: value 
        }, {
          onConflict: 'name',
          ignoreDuplicates: false
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['ziina-test-mode'] });
      await queryClient.refetchQueries({ 
        queryKey: ['ziina-test-mode'],
        exact: true 
      });
      
      toast.success(`Test mode ${value === 'true' ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating test mode:', error);
      toast.error("Failed to update test mode");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Test Mode</label>
      <Select
        disabled={isLoading}
        onValueChange={updateTestMode}
        value={testMode === undefined ? undefined : testMode ? 'true' : 'false'}
      >
        <SelectTrigger disabled={isLoading} className="w-[200px]">
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
  );
};