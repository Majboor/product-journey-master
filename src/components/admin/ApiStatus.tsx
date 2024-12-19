import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const ApiStatus = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [testResponse, setTestResponse] = useState<string>("");
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM";
  const accessToken = session?.access_token || '[Login to get your access token]';

  const testApi = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          slug: 'toyland-express',
          content: {
            brandName: "Toyland Express",
            hero: {
              title: "Unleash the Joy of Play",
              description: "Discover a world of fun and creativity with our premium selection of toys for all ages.",
              image: "https://images.unsplash.com/photo-1589988344375-8b8998d6a799",
              price: 19.99
            },
            product: {
              images: [
                "https://images.unsplash.com/photo-1591015437125-22e180c50c7b",
                "https://images.unsplash.com/photo-1582719478144-b53fdfbb41ac",
                "https://images.unsplash.com/photo-1595250927207-3c9cd2f41c8a"
              ],
              details: {
                description: "Our toys are designed to spark imagination, creativity, and endless fun for kids of all ages.",
                specifications: [
                  "Non-toxic Materials",
                  "Durable and Safe",
                  "Suitable for Ages 3+"
                ],
                buyNowLink: "#buy-now"
              },
              features: [
                "Educational and Entertaining",
                "Eco-Friendly Materials",
                "Wide Variety for All Interests"
              ]
            },
            features: [
              {
                icon: "Toy",
                title: "High Quality",
                description: "Toys crafted with precision and care to ensure durability and safety."
              },
              {
                icon: "Star",
                title: "Top-Rated",
                description: "Loved by parents and kids alike for their creativity and fun."
              },
              {
                icon: "Gift",
                title: "Perfect Gifts",
                description: "Find the perfect toy for any occasion, from birthdays to holidays."
              },
              {
                icon: "Leaf",
                title: "Eco-Friendly",
                description: "Made with sustainable materials to protect our planet."
              }
            ],
            reviews: [
              {
                name: "Amy Johnson",
                rating: 5,
                comment: "My kids love their new toys! Great quality and lots of fun.",
                image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91"
              },
              {
                name: "David Brown",
                rating: 5,
                comment: "The educational toys are fantastic. My son has learned so much!",
                image: "https://images.unsplash.com/photo-1599075340066-9db531192e82"
              },
              {
                name: "Sophia Martinez",
                rating: 5,
                comment: "The best toy store! Fast shipping and amazing selection.",
                image: "https://images.unsplash.com/photo-1529279254180-1bfc3c5c7563"
              }
            ],
            footer: {
              contact: {
                email: "support@toylandexpress.com",
                phone: "1-800-TOYLAND",
                address: "789 Fun Street, Playville, PL 98765"
              },
              links: [
                {
                  title: "About Us",
                  url: "#about"
                },
                {
                  title: "Toys",
                  url: "#toys"
                },
                {
                  title: "Contact",
                  url: "#contact"
                }
              ]
            }
          }
        })
        .select()
        .single();

      if (error) throw error;
      
      setTestResponse(JSON.stringify(data, null, 2));
      toast({
        title: "API Test Successful",
        description: "Check the Sample Output tab to see the response",
      });
    } catch (error: any) {
      toast({
        title: "API Test Failed",
        description: error.message,
        variant: "destructive",
      });
      setTestResponse(JSON.stringify(error, null, 2));
    }
  };

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
            <div className="flex items-center justify-between">
              <span>Project URL</span>
              <span>https://tylpifixgpoxonedjyzo.supabase.co</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Anon Key:</h3>
            <pre className="bg-secondary p-2 rounded-lg overflow-x-auto text-sm">
              {anonKey}
            </pre>
          </div>
          <div>
            <h3 className="font-medium mb-2">Access Token:</h3>
            <pre className="bg-secondary p-2 rounded-lg overflow-x-auto text-sm">
              {accessToken}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={testApi}>Test API Now</Button>
          </div>
          
          <Tabs defaultValue="curl">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="output">Sample Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curl" className="mt-4">
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                {`curl -X POST https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages \\
-H "apikey: ${anonKey}" \\
-H "Authorization: Bearer ${accessToken}" \\
-H "Content-Type: application/json" \\
-H "Prefer: return=representation" \\
-d '{"slug":"toyland-express","content":{"brandName":"Toyland Express","hero":{"title":"Unleash the Joy of Play","description":"Discover a world of fun and creativity with our premium selection of toys for all ages.","image":"https://images.unsplash.com/photo-1589988344375-8b8998d6a799","price":19.99}}}'`}
              </pre>
            </TabsContent>
            
            <TabsContent value="python" className="mt-4">
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                {`import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages"

headers = {
    "apikey": "${anonKey}",
    "Authorization": "Bearer ${accessToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = {
    "slug": "toyland-express",
    "content": {
        "brandName": "Toyland Express",
        "hero": {
            "title": "Unleash the Joy of Play",
            "description": "Discover a world of fun and creativity with our premium selection of toys for all ages.",
            "image": "https://images.unsplash.com/photo-1589988344375-8b8998d6a799",
            "price": 19.99
        }
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
              </pre>
            </TabsContent>

            <TabsContent value="output" className="mt-4">
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                {testResponse || `// Click "Test API Now" to see live output
// Sample successful response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "toyland-express",
  "content": {
    "brandName": "Toyland Express",
    "hero": {
      "title": "Unleash the Joy of Play",
      "description": "Discover a world of fun and creativity with our premium selection of toys for all ages.",
      "image": "https://images.unsplash.com/photo-1589988344375-8b8998d6a799",
      "price": 19.99
    }
  },
  "created_at": "2024-03-20T12:00:00.000Z",
  "updated_at": "2024-03-20T12:00:00.000Z"
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};