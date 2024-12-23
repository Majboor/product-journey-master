import { SUPABASE_ANON_KEY } from "../constants";

export const getAuthClientExample = (bearerToken: string) => `import requests
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

# Usage example:
client = SupabaseClient(
    url="https://tylpifixgpoxonedjyzo.supabase.co",
    anon_key="${SUPABASE_ANON_KEY}"  # Using the actual anon key
)

# Current bearer token for reference:
# Bearer Token: ${bearerToken}

try:
    # Sign in
    auth_data = client.sign_in("your-email@example.com", "your-password")
    print("Signed in successfully with token:", auth_data.get("access_token"))
    
    # Refresh token example
    refreshed_data = client.refresh_session()
    print("Token refreshed successfully:", refreshed_data.get("access_token"))
    
except Exception as e:
    print(f"Error: {str(e)}")`;