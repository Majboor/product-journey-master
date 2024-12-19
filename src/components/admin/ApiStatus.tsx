import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ApiStatus = () => {
  const [testResponse, setTestResponse] = useState("");

  const testApi = async () => {
    try {
      const slug = "toyland-express"; // Define the slug we'll use
      
      // First check if the slug exists
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPage) {
        toast.error("A page with this slug already exists. Please use a different slug.");
        setTestResponse(JSON.stringify({
          error: "Duplicate slug",
          message: "A page with this slug already exists"
        }, null, 2));
        return;
      }

      const { data, error } = await supabase
        .from('pages')
        .insert({
          slug,
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
                buyNowLink: "#" // Added missing required field
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
        .select();

      if (error) throw error;

      toast.success("API test successful! Page created.");
      setTestResponse(JSON.stringify(data, null, 2));
      
    } catch (error: any) {
      toast.error(error.message || "Failed to test API");
      setTestResponse(JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">API Status</h2>
          <p className="text-muted-foreground">
            Test the API endpoints and view sample responses.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={testApi}>
              Test API Now
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="response">
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
-H 'apikey: YOUR_ANON_KEY' \\
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
-H 'Content-Type: application/json' \\
-H 'Prefer: return=representation' \\
-d '{"slug":"toyland-express","content":{"brandName":"Toyland Express",...}}'`}
            </pre>
          </TabsContent>

          <TabsContent value="python" className="space-y-4">
            <h3 className="font-semibold">Python Example:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
{`import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages"

headers = {
    "apikey": "YOUR_ANON_KEY",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

data = {
    "slug": "toyland-express",
    "content": {
        "brandName": "Toyland Express",
        ...
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
