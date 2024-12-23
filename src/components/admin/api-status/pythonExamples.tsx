import { SUPABASE_ANON_KEY } from "./constants";

export const getPythonAuthExample = (bearerToken: string) => `import requests
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class SupabaseClient:
    def __init__(self, url: str, anon_key: str):
        self.url = url
        self.anon_key = anon_key
        self.access_token = None
        self.refresh_token = None

    def sign_in(self, email: str, password: str) -> Dict[str, Any]:
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

    def refresh_session(self) -> Dict[str, Any]:
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

    def create_category(self, name: str, slug: str, description: Optional[str] = None) -> Dict[str, Any]:
        """Create a new category with the given parameters."""
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

    def create_page(self, page_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new page with complete JSON data."""
        if not self.access_token:
            raise Exception("Not authenticated")
            
        url = f"{self.url}/rest/v1/pages"
        headers = {
            "apikey": self.anon_key,
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        try:
            response = requests.post(url, headers=headers, json=page_data)
            if response.status_code == 401:  # Token expired
                self.refresh_session()
                # Retry with new token
                headers["Authorization"] = f"Bearer {self.access_token}"
                response = requests.post(url, headers=headers, json=page_data)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to create page: {str(e)}")

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
        name="Modern Bistro",
        slug="modern-bistro"
    )
    print("Category created:", category)
    
    # Create a page with complete data
    page_data = {
        "slug": "modern-bistro/main",
        "category_id": category["id"],  # Use the ID from the created category
        "content": {
            "brandName": "Modern Bistro",
            "colorScheme": {
                "primary": "#8B0000",
                "secondary": "#F5F5F5",
                "accent": "#FFD700",
                "primaryText": "#FFFFFF",
                "secondaryText": "#1A1F2C",
                "accentText": "#1A1F2C"
            },
            # ... Add all the content fields as needed
        }
    }
    
    page = client.create_page(page_data)
    print("Page created:", page)
    
except Exception as e:
    print(f"Error: {str(e)}")`;

export const getPythonCategoryExample = (bearerToken: string) => `import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/categories"

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

category_data = {
    "name": "Sample Category",
    "slug": "sample-category",
    "description": "This is a sample category"
}

response = requests.post(url, headers=headers, json=category_data)
print(response.json())`;

export const getPythonPageExample = (bearerToken: string) => `import requests
import json

url = "https://tylpifixgpoxonedjyzo.supabase.co/rest/v1/pages"

headers = {
    "apikey": "${SUPABASE_ANON_KEY}",
    "Authorization": "Bearer ${bearerToken}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

page_data = {
    "slug": "sample-data/modern-bistro",
    "category_id": "CATEGORY_ID",  # Replace with actual category ID
    "content": {
        "brandName": "Modern Bistro",
        "colorScheme": {
            "primary": "#8B0000",
            "secondary": "#F5F5F5",
            "accent": "#FFD700",
            "primaryText": "#FFFFFF",
            "secondaryText": "#1A1F2C",
            "accentText": "#1A1F2C"
        },
        "hero": {
            "title": "Experience Modern Fine Dining",
            "description": "Where tradition meets innovation in the heart of the city",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "price": 150,
            "subtitle": "Award-Winning Restaurant",
            "buttonText": "Reserve Now",
            "backgroundOverlay": "rgba(0, 0, 0, 0.4)"
        },
        # ... Add all other content sections
    }
}

response = requests.post(url, headers=headers, json=page_data)
print(response.json())`;