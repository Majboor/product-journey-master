import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { validatePageContent } from "@/types/content";
import { defaultContent } from "./defaultContent";
import { ContentForm } from "./ContentForm";
import { Json } from "@/integrations/supabase/types";

export const ContentEditor = () => {
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(JSON.stringify(defaultContent, null, 2));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedContent = JSON.parse(content);
      
      if (!validatePageContent(parsedContent)) {
        throw new Error('Invalid content structure. Please ensure all required fields are present.');
      }
      
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPage) {
        toast({
          title: "Error",
          description: "A page with this slug already exists. Please use a different slug.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('pages')
        .insert({ 
          slug,
          content: parsedContent as unknown as Json
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "New page has been created successfully",
      });

      handleReset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSlug("");
    setContent(JSON.stringify(defaultContent, null, 2));
  };

  return (
    <Card className="p-6">
      <ContentForm
        slug={slug}
        content={content}
        loading={loading}
        onSlugChange={setSlug}
        onContentChange={setContent}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};