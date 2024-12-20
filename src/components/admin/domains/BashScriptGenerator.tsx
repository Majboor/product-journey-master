import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BashScriptGenerator = () => {
  const [basePath, setBasePath] = useState("/var/www/sitemaps");
  const APP_URL = "https://7000d7ca-2533-4634-aaa0-707176140978.lovableproject.com";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHBpZml4Z3BveG9uZWRqeXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzEzODcsImV4cCI6MjA1MDIwNzM4N30.skZWTBt_a-Pj00805Vtbom78hGf3nU4z5NVRyVzuCbM";
  
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

# Function to check if sitemap exists and is valid XML
check_sitemap() {
    local url=$1
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$http_code" = "200" ]; then
        local content=$(curl -s "$url")
        if [[ $content == *"<?xml"* ]] && [[ $content == *"urlset"* ]]; then
            return 0
        fi
    fi
    return 1
}

# Function to download sitemap for a category
download_sitemap() {
    local category_slug=$1
    
    # Create category directory
    mkdir -p "$BASE_DIR/$category_slug"
    
    # Use the Lovable project URL directly
    local sitemap_url="${APP_URL}/$category_slug/sitemap.xml"
    
    echo "Attempting to download sitemap for $category_slug from $sitemap_url"
    
    if check_sitemap "$sitemap_url"; then
        curl -s "$sitemap_url" > "$BASE_DIR/$category_slug/sitemap.xml"
        if [ $? -eq 0 ]; then
            echo "✅ Successfully downloaded sitemap for $category_slug"
            return 0
        fi
    fi
    
    echo "❌ Failed to download valid sitemap for $category_slug"
    return 1
}

# Get all categories from database
categories=$(curl -s "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories" \\
  -H "apikey: ${SUPABASE_ANON_KEY}" \\
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}")

if [ -z "$categories" ] || [ "$categories" = "[]" ]; then
    echo "No categories found in the database"
    exit 1
fi

# Process each category
echo "$categories" | jq -c '.[]' | while read -r category; do
    slug=$(echo "$category" | jq -r '.slug')
    name=$(echo "$category" | jq -r '.name')
    
    echo "Processing category: $name"
    download_sitemap "$slug"
done

echo "✨ Sitemap download process completed!"`;
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