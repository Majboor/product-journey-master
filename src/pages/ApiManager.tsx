import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEditor } from "@/components/api-manager/ContentEditor";
import { ExistingPages } from "@/components/api-manager/ExistingPages";
import { Documentation } from "@/components/api-manager/Documentation";

const ApiManager = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!session) {
    navigate("/login");
    return null;
  }

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
              <ContentEditor />
            </TabsContent>

            <TabsContent value="pages">
              <ExistingPages 
                onLoadPage={(slug, content) => {
                  // Switch to editor tab and load the page content
                  const tabsList = document.querySelector('[value="editor"]') as HTMLButtonElement;
                  if (tabsList) {
                    tabsList.click();
                  }
                  
                  // Find the form inputs and update their values
                  const slugInput = document.querySelector('#slug') as HTMLInputElement;
                  const contentTextarea = document.querySelector('#content') as HTMLTextAreaElement;
                  
                  if (slugInput && contentTextarea) {
                    slugInput.value = slug;
                    contentTextarea.value = JSON.stringify(content, null, 2);
                  }
                }} 
              />
            </TabsContent>
          </Tabs>

          <Documentation />
        </div>
      </main>
    </div>
  );
};

export default ApiManager;