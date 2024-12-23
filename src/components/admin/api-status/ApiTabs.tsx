import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { samplePageData, sampleCategoryData, colorSchemeExamples } from "./sampleData";
import { useAuth } from "@/components/auth/AuthProvider";
import { getPythonAuthExample, getPythonCategoryExample, getPythonPageExample } from "./pythonExamples";

interface ApiTabsProps {
  testResponse: string;
}

export const ApiTabs = ({ testResponse }: ApiTabsProps) => {
  const { session } = useAuth();
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM";
  const bearerToken = session?.access_token || SUPABASE_ANON_KEY;

  return (
    <>
      <TabsList>
        <TabsTrigger value="response">Sample Output</TabsTrigger>
        <TabsTrigger value="curl">cURL Examples</TabsTrigger>
        <TabsTrigger value="python">Python Examples</TabsTrigger>
        <TabsTrigger value="colors">Color Schemes</TabsTrigger>
        <TabsTrigger value="auth">Authentication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="response" className="space-y-4">
        <h3 className="font-semibold">Response:</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {testResponse || "Click 'Test API Now' to see the response"}
        </pre>
      </TabsContent>

      <TabsContent value="curl" className="space-y-4">
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-2">Create Category Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`curl -X POST 'https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories' \\
-H 'apikey: ${SUPABASE_ANON_KEY}' \\
-H 'Authorization: Bearer ${bearerToken}' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '${JSON.stringify(sampleCategoryData, null, 2)}'`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Create Page Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`curl -X POST 'https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages' \\
-H 'apikey: ${SUPABASE_ANON_KEY}' \\
-H 'Authorization: Bearer ${bearerToken}' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '${JSON.stringify(samplePageData, null, 2)}'`}
            </pre>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="python" className="space-y-4">
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-2">Authentication and JWT Refresh Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {getPythonAuthExample(bearerToken)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Create Category Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {getPythonCategoryExample(bearerToken)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Create Page Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {getPythonPageExample(bearerToken)}
            </pre>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="colors" className="space-y-4">
        <h3 className="font-semibold">Color Scheme Examples:</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {JSON.stringify(colorSchemeExamples, null, 2)}
        </pre>
      </TabsContent>

      <TabsContent value="auth" className="space-y-4">
        <h3 className="font-semibold">Authentication Notes:</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            JWT tokens expire for security reasons. Always implement token refresh logic in your applications.
            The Python example above shows how to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Handle initial authentication</li>
            <li>Store access and refresh tokens</li>
            <li>Automatically refresh expired tokens</li>
            <li>Retry failed requests with new tokens</li>
            <li>Create categories and pages with complete data</li>
          </ul>
        </div>
      </TabsContent>
    </>
  );
};