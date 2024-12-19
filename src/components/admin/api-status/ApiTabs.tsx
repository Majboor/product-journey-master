import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { samplePageData } from "./sampleData";

interface ApiTabsProps {
  testResponse: string;
}

export const ApiTabs = ({ testResponse }: ApiTabsProps) => {
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM";

  return (
    <>
      <TabsList>
        <TabsTrigger value="response">Sample Output</TabsTrigger>
        <TabsTrigger value="curl">cURL Example</TabsTrigger>
        <TabsTrigger value="python">Python Example</TabsTrigger>
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
-H 'Authorization: Bearer ${SUPABASE_ANON_KEY}' \\
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
    "Authorization": "Bearer ${SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = ${JSON.stringify(samplePageData, null, 2)}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
        </pre>
      </TabsContent>
    </>
  );
};