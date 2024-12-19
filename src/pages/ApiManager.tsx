import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "@/components/api-manager/ContentEditor";
import { ExistingPages } from "@/components/api-manager/ExistingPages";
import { Documentation } from "@/components/api-manager/Documentation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const ApiManager = () => {
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');

  // Fetch page content if editing
  const { data: pageContent } = useQuery({
    queryKey: ['page-content', editSlug],
    queryFn: async () => {
      if (!editSlug) return null;
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', editSlug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!editSlug
  });

  useEffect(() => {
    if (pageContent) {
      // Find the form inputs and update their values
      const slugInput = document.querySelector('#slug') as HTMLInputElement;
      const contentTextarea = document.querySelector('#content') as HTMLTextAreaElement;
      
      if (slugInput && contentTextarea) {
        slugInput.value = pageContent.slug;
        contentTextarea.value = JSON.stringify(pageContent.content, null, 2);
      }
    }
  }, [pageContent]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {editSlug ? `Editing Page: ${editSlug}` : 'API Content Manager'}
          </h1>
          
          <Tabs defaultValue={editSlug ? "editor" : "pages"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Content Editor</TabsTrigger>
              <TabsTrigger value="pages">Existing Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <ContentEditor initialData={pageContent} />
            </TabsContent>

            <TabsContent value="pages">
              <ExistingPages onLoadPage={(slug, content) => {
                window.location.href = `/admin/api-manager?edit=${slug}`;
              }} />
            </TabsContent>
          </Tabs>

          <Documentation />
        </div>
      </main>
    </div>
  );
};

export default ApiManager;