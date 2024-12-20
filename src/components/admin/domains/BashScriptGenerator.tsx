import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BashScriptGenerator = () => {
  const [basePath, setBasePath] = useState("/var/www/sitemaps");
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const generateBashScript = () => {
    if (!categories) return "";
    
    return `#!/bin/bash

# Base directory for sitemaps
BASE_DIR="${basePath}"

# Create base directory if it doesn't exist
mkdir -p "$BASE_DIR"

# Function to download sitemap for a category
download_sitemap() {
    local category_slug=$1
    local domain=$2
    
    # Create category directory
    mkdir -p "$BASE_DIR/$category_slug"
    
    # Download sitemap
    echo "Downloading sitemap for $category_slug..."
    curl -s "https://$domain/$category_slug/sitemap.xml" > "$BASE_DIR/$category_slug/sitemap.xml"
    
    if [ $? -eq 0 ]; then
        echo "Successfully downloaded sitemap for $category_slug"
    else
        echo "Failed to download sitemap for $category_slug"
    fi
}

# Download sitemaps for all categories
${categories.map(category => {
  const domainMapping = `# Get domain for ${category.name}
domain=$(curl -s "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/domain_mappings?category_id=eq.${category.id}&select=domain" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM")

if [ -n "$domain" ]; then
    download_sitemap "${category.slug}" "$domain"
else
    echo "No domain mapping found for ${category.name}"
fi`
  return domainMapping;
}).join('\n\n')}

echo "All sitemaps have been downloaded!"`;
  };

  const copyBashScript = () => {
    const script = generateBashScript();
    navigator.clipboard.writeText(script);
    toast.success("Bash script copied to clipboard!");
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Generate Sitemap Download Script</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Base Path for Sitemaps
            </label>
            <Input
              value={basePath}
              onChange={(e) => setBasePath(e.target.value)}
              placeholder="Enter base path (e.g., /var/www/sitemaps)"
            />
          </div>
          <Button onClick={copyBashScript}>
            Copy Bash Script
          </Button>
        </div>
        <div className="bg-muted p-4 rounded-md">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {generateBashScript()}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};