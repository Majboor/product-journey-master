import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { validatePageContent } from "@/types/content";
import { defaultContent } from "./defaultContent";
import { ContentFormFields } from "./ContentFormFields";
import { Json } from "@/integrations/supabase/types";

interface ContentEditorProps {
  initialData?: {
    slug: string;
    content: Json;
    category_id?: string;
  } | null;
}

export const ContentEditor = ({ initialData }: ContentEditorProps) => {
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState(JSON.stringify(defaultContent, null, 2));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSlug(initialData.slug);
      setCategoryId(initialData.category_id || "");
      setContent(JSON.stringify(initialData.content, null, 2));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedContent = JSON.parse(content);
      
      if (!validatePageContent(parsedContent)) {
        throw new Error('Invalid content structure. Please ensure all required fields are present.');
      }

      if (!categoryId) {
        throw new Error('Please select a category');
      }

      // Always treat empty slug as an update operation
      if (slug === '') {
        const { error } = await supabase
          .from('pages')
          .update({ 
            content: parsedContent as unknown as Json,
            category_id: categoryId
          })
          .eq('slug', '');

        if (error) throw error;

        toast({
          title: "Success",
          description: "Root page has been updated successfully",
        });
      } else if (initialData) {
        const { error } = await supabase
          .from('pages')
          .update({ 
            content: parsedContent as unknown as Json,
            category_id: categoryId
          })
          .eq('slug', slug);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Page has been updated successfully",
        });
      } else {
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
            content: parsedContent as unknown as Json,
            category_id: categoryId
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "New page has been created successfully",
        });

        handleReset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!initialData) {
      setSlug("");
      setCategoryId("");
      setContent(JSON.stringify(defaultContent, null, 2));
    }
  };

  return (
    <Card className="p-6">
      <ContentFormFields
        slug={slug}
        content={content}
        categoryId={categoryId}
        loading={loading}
        onSlugChange={setSlug}
        onContentChange={setContent}
        onCategoryChange={setCategoryId}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isEditing={!!initialData}
      />
    </Card>
  );
};