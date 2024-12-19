import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ApiStatus = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Status & Documentation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Database Connection</span>
              <span className="text-green-500">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API Version</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curl" className="mt-4">
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                {`curl -X POST https://[YOUR-PROJECT].supabase.co/rest/v1/pages \\
-H "apikey: [YOUR-ANON-KEY]" \\
-H "Authorization: Bearer [YOUR-ACCESS-TOKEN]" \\
-H "Content-Type: application/json" \\
-H "Prefer: return=minimal" \\
-d '{"slug":"example","content":{"title":"Example Page"}}'`}
              </pre>
            </TabsContent>
            
            <TabsContent value="python" className="mt-4">
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                {`import requests
import json

url = "https://[YOUR-PROJECT].supabase.co/rest/v1/pages"

headers = {
    "apikey": "[YOUR-ANON-KEY]",
    "Authorization": "Bearer [YOUR-ACCESS-TOKEN]",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

data = {
    "slug": "example",
    "content": {
        "title": "Example Page"
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.status_code)`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};