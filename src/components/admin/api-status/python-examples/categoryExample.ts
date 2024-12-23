import { SUPABASE_ANON_KEY } from "../constants";

export const getCategoryExample = (bearerToken: string) => `import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories"

# Current configuration:
# Anon Key: ${SUPABASE_ANON_KEY}
# Bearer Token: ${bearerToken}

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

category_data = {
    "name": "Modern Bistro",
    "slug": "modern-bistro",
    "description": "A modern fine dining experience"
}

response = requests.post(url, headers=headers, json=category_data)
print(response.json())`;