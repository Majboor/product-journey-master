import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiTabs } from "./api-status/ApiTabs";
import { samplePageData, sampleCategoryData } from "./api-status/sampleData";
import { useAuth } from "@/components/auth/AuthProvider";

export const ApiStatus = () => {
  const [testResponse, setTestResponse] = useState("");
  const { session } = useAuth();

  const testApi = async () => {
    try {
      // First create the category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: sampleCategoryData.name,
          slug: sampleCategoryData.slug
        })
        .select()
        .single();

      if (categoryError) {
        console.error('Category creation error:', categoryError);
        throw new Error(`Failed to create category: ${categoryError.message}`);
      }

      if (!categoryData || !categoryData.id) {
        throw new Error('Category was created but no ID was returned');
      }

      // Then create the page with the new category_id
      const pageDataWithCategory = {
        ...samplePageData,
        category_id: categoryData.id,
        content: samplePageData.content // Explicitly include content
      };

      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', pageDataWithCategory.slug)
        .maybeSingle();

      if (existingPage) {
        toast.error("A page with this slug already exists. Please use a different slug.");
        setTestResponse(JSON.stringify({
          error: "Duplicate slug",
          message: "A page with this slug already exists"
        }, null, 2));
        return;
      }

      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert(pageDataWithCategory)
        .select();

      if (pageError) {
        console.error('Page creation error:', pageError);
        throw pageError;
      }

      // Now test deleting the category (this should fail due to FK constraint, which is expected)
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryData.id);

      const deleteStatus = deleteError 
        ? "Category deletion failed (expected due to FK constraint with pages)"
        : "Category successfully deleted";

      toast.success("API test successful! Category and page created.");
      setTestResponse(JSON.stringify({
        category: categoryData,
        page: pageData,
        deleteStatus
      }, null, 2));
      
    } catch (error: any) {
      console.error('API test error:', error);
      toast.error(error.message || "Failed to test API");
      setTestResponse(JSON.stringify({
        error: error.message,
        details: error.details || "No additional details available"
      }, null, 2));
    }
  };

  const refreshToken = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      toast.success("JWT token refreshed successfully!");
      setTestResponse(JSON.stringify({
        message: "Token refreshed successfully",
        newToken: data.session?.access_token,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour from now
      }, null, 2));
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh token");
      setTestResponse(JSON.stringify({
        error: error.message,
        details: error.details || "No additional details available"
      }, null, 2));
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
            <Button 
              variant="outline"
              onClick={refreshToken}
            >
              Refresh JWT Token
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