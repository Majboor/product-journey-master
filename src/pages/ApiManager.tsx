import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const ApiManager = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing pages
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, content')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Redirect if not authenticated
  if (!session) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate JSON
      const contentObj = JSON.parse(content);
      
      const { error } = await supabase
        .from('pages')
        .upsert({ 
          slug,
          content: contentObj
        }, { 
          onConflict: 'slug' 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page content has been updated successfully",
      });

      // Clear form
      setSlug("");
      setContent("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update page content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPage = (selectedSlug: string, pageContent: any) => {
    setSlug(selectedSlug);
    setContent(JSON.stringify(pageContent, null, 2));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">API Content Manager</h1>
          
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Content Editor</TabsTrigger>
              <TabsTrigger value="pages">Existing Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium mb-2">
                      Page Slug
                    </label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., about-us"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-2">
                      Page Content (JSON)
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`{
  "title": "Page Title",
  "description": "Page description",
  "color_scheme": "light",
  "images": [
    {
      "id": "hero_image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "sections": [
    {
      "id": "intro",
      "heading": "Introduction",
      "body": "Welcome to our page"
    }
  ]
}`}
                      className="font-mono min-h-[300px]"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSlug("");
                        setContent("");
                      }}
                    >
                      Clear
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Content"}
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="pages">
              <Card className="p-6">
                <div className="space-y-4">
                  {pagesLoading ? (
                    <p>Loading pages...</p>
                  ) : pages?.length === 0 ? (
                    <p>No pages found. Create your first page in the Content Editor tab.</p>
                  ) : (
                    <div className="grid gap-4">
                      {pages?.map((page) => (
                        <div key={page.slug} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">/{page.slug}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadPage(page.slug, page.content)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Documentation</h2>
            <div className="space-y-4 text-sm">
              <p>
                Use this interface to manage dynamic page content. The content should be valid JSON with the following structure:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>title</strong>: String - The main title of the page</li>
                <li><strong>description</strong>: String - A brief description</li>
                <li><strong>color_scheme</strong>: String - Theme of the page (e.g., "light", "dark")</li>
                <li><strong>images</strong>: Array of image objects with id and url</li>
                <li><strong>sections</strong>: Array of content sections with id, heading, and body</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiManager;