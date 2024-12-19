import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApiTabs } from "./api-status/ApiTabs";
import { samplePageData, sampleCategoryData } from "./api-status/sampleData";
import { useAuth } from "@/components/auth/AuthProvider";
import { validatePageContent } from "@/types/content";

export const ApiStatus = () => {
  const [testResponse, setTestResponse] = useState("");
  const { session } = useAuth();

  const validateContent = (content: any) => {
    // Check for required top-level properties
    const requiredProps = ['brandName', 'hero', 'product', 'features', 'reviews', 'footer'];
    const missingProps = requiredProps.filter(prop => !content[prop]);
    
    if (missingProps.length > 0) {
      throw new Error(`Invalid content structure. Missing required properties: ${missingProps.join(', ')}`);
    }

    // Validate hero section
    if (!content.hero.title || !content.hero.description || !content.hero.image || typeof content.hero.price !== 'number') {
      throw new Error('Invalid hero section structure. Required: title (string), description (string), image (string), price (number)');
    }

    // Validate product section
    if (!Array.isArray(content.product.images) || !content.product.details || !Array.isArray(content.product.features)) {
      throw new Error('Invalid product section structure. Required: images (array), details (object), features (array)');
    }

    // Validate features array
    if (!content.features.every((f: any) => f.icon && f.title && f.description)) {
      throw new Error('Invalid features structure. Each feature must have: icon, title, description');
    }

    // Validate footer
    if (!content.footer.contact || !Array.isArray(content.footer.links)) {
      throw new Error('Invalid footer structure. Required: contact (object), links (array)');
    }

    return true;
  };

  const testApi = async () => {
    try {
      // First create the category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .insert(sampleCategoryData)
        .select()
        .single();

      if (categoryError) throw categoryError;

      // Validate the page content structure before creating the page
      try {
        validateContent(samplePageData);
      } catch (validationError: any) {
        throw new Error(`Content validation failed: ${validationError.message}`);
      }

      // Then create the page with the new category_id
      const pageDataWithCategory = {
        ...samplePageData,
        category_id: categoryData.id
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

      if (pageError) throw pageError;

      // Now test deleting the category
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryData.id);

      if (deleteError) throw deleteError;

      toast.success("API test successful! Category created, page created, and category deleted.");
      setTestResponse(JSON.stringify({
        category: categoryData,
        page: pageData,
        deleteStatus: "Category successfully deleted"
      }, null, 2));
      
    } catch (error: any) {
      toast.error(error.message || "Failed to test API");
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