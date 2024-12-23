export const getCategoryExample = (bearerToken: string) => `import requests
import json
from typing import Dict, Any

def create_category(url: str, anon_key: str, access_token: str, name: str, slug: str, description: str) -> Dict[str, Any]:
    """Create a new category with the given parameters."""
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "name": name,
        "slug": slug,
        "description": description
    }
    
    try:
        response = requests.post(f"{url}/rest/v1/categories", headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to create category: {str(e)}")`;