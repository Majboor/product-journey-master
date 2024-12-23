import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { samplePageData, sampleCategoryData, colorSchemeExamples } from "./sampleData";
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
            <h3 className="font-semibold mb-2">Delete Category Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`curl -X DELETE 'https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories?id=eq.[CATEGORY_ID]' \\
-H 'apikey: ${SUPABASE_ANON_KEY}' \\
-H 'Authorization: Bearer ${bearerToken}' \\
-H 'Content-Type: application/json'`}
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
{`import requests
import json
from datetime import datetime, timezone

class SupabaseClient:
    def __init__(self, url, anon_key):
        self.url = url
        self.anon_key = anon_key
        self.access_token = None
        self.refresh_token = None

    def sign_in(self, email, password):
        auth_url = f"{self.url}/auth/v1/token?grant_type=password"
        headers = {
            "apikey": self.anon_key,
            "Content-Type": "application/json"
        }
        data = {
            "email": email,
            "password": password
        }
        
        response = requests.post(auth_url, headers=headers, json=data)
        if response.status_code == 200:
            auth_data = response.json()
            self.access_token = auth_data.get("access_token")
            self.refresh_token = auth_data.get("refresh_token")
            return auth_data
        else:
            raise Exception(f"Authentication failed: {response.text}")

    def refresh_session(self):
        if not self.refresh_token:
            raise Exception("No refresh token available")
            
        refresh_url = f"{self.url}/auth/v1/token?grant_type=refresh_token"
        headers = {
            "apikey": self.anon_key,
            "Content-Type": "application/json"
        }
        data = {
            "refresh_token": self.refresh_token
        }
        
        response = requests.post(refresh_url, headers=headers, json=data)
        if response.status_code == 200:
            auth_data = response.json()
            self.access_token = auth_data.get("access_token")
            self.refresh_token = auth_data.get("refresh_token")
            return auth_data
        else:
            raise Exception(f"Token refresh failed: {response.text}")

    def create_category(self, name, slug, description=None):
        if not self.access_token:
            raise Exception("Not authenticated")
            
        url = f"{self.url}/rest/v1/categories"
        headers = {
            "apikey": self.anon_key,
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        data = {
            "name": name,
            "slug": slug,
            "description": description or f"Category for {name}"
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 401:  # Token expired
                self.refresh_session()
                # Retry with new token
                headers["Authorization"] = f"Bearer {self.access_token}"
                response = requests.post(url, headers=headers, json=data)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to create category: {str(e)}")

# Usage example:
client = SupabaseClient(
    url="https://tylpifixgpoxonedjyzo.supabase.co",
    anon_key="${SUPABASE_ANON_KEY}"
)

try:
    # Sign in
    auth_data = client.sign_in("your-email@example.com", "your-password")
    print("Signed in successfully")
    
    # Create a category
    category = client.create_category(
        name="Sample Category",
        slug="sample-category"
    )
    print("Category created:", category)
    
except Exception as e:
    print(f"Error: {str(e)}")`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Create Category Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories"

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

category_data = ${JSON.stringify(sampleCategoryData, null, 2)}

response = requests.post(url, headers=headers, json=category_data)
print(response.json())`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Delete Category Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`import requests

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories"
category_id = "CATEGORY_ID"  # Replace with actual category ID

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json"
}

response = requests.delete(f"{url}?id=eq.{category_id}", headers=headers)
print("Category deleted" if response.status_code == 204 else "Error deleting category")`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Create Page Example:</h3>
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

page_data = ${JSON.stringify(samplePageData, null, 2)}

response = requests.post(url, headers=headers, json=page_data)
print(response.json())`}
            </pre>
          </div>
        </div>
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
          </ul>
        </div>
      </TabsContent>
    </>
  );
};
