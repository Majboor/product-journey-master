import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiTabs } from "./api-status/ApiTabs";
import { samplePageData } from "./api-status/sampleData";

export const ApiStatus = () => {
  const [testResponse, setTestResponse] = useState("");

  const testApi = async () => {
    try {
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', samplePageData.slug)
        .maybeSingle();

      if (existingPage) {
        toast.error("A page with this slug already exists. Please use a different slug.");
        setTestResponse(JSON.stringify({
          error: "Duplicate slug",
          message: "A page with this slug already exists"
        }, null, 2));
        return;
      }

      const { data, error } = await supabase
        .from('pages')
        .insert(samplePageData)
        .select();

      if (error) throw error;

      toast.success("API test successful! Page created.");
      setTestResponse(JSON.stringify(data, null, 2));
      
    } catch (error: any) {
      toast.error(error.message || "Failed to test API");
      setTestResponse(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">API Status</h2>
          <p className="text-muted-foreground">
            Test the API endpoints and view sample responses.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={testApi}>
              Test API Now
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="response">
          <ApiTabs testResponse={testResponse} />
        </Tabs>
      </Card>
    </div>
  );
};