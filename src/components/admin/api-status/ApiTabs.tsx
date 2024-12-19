import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { samplePageData, colorSchemeExamples } from "./sampleData";
import { useAuth } from "@/components/auth/AuthProvider";

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
        <TabsTrigger value="curl">cURL Example</TabsTrigger>
        <TabsTrigger value="python">Python Example</TabsTrigger>
        <TabsTrigger value="colors">Color Schemes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="response" className="space-y-4">
        <h3 className="font-semibold">Response:</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {testResponse || "Click 'Test API Now' to see the response"}
        </pre>
      </TabsContent>

      <TabsContent value="curl" className="space-y-4">
        <h3 className="font-semibold">cURL Example:</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`curl -X POST 'https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages' \\
-H 'apikey: ${SUPABASE_ANON_KEY}' \\
-H 'Authorization: Bearer ${bearerToken}' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '${JSON.stringify(samplePageData, null, 2)}'`}
        </pre>
      </TabsContent>

      <TabsContent value="python" className="space-y-4">
        <h3 className="font-semibold">Python Example:</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages"

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = ${JSON.stringify(samplePageData, null, 2)}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
        </pre>
      </TabsContent>

      <TabsContent value="colors" className="space-y-4">
        <h3 className="font-semibold">Color Scheme Examples:</h3>
        <div className="grid gap-4">
          {Object.entries(colorSchemeExamples).map(([name, scheme]) => (
            <div key={name} className="space-y-2">
              <h4 className="font-medium capitalize">{name}</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify({ colorScheme: scheme }, null, 2)}
              </pre>
              <div 
                className="h-8 rounded flex items-center px-4"
                style={{
                  backgroundColor: scheme.secondary,
                  border: `2px solid ${scheme.primary}`,
                  color: scheme.primary
                }}
              >
                Preview
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </>
  );
};