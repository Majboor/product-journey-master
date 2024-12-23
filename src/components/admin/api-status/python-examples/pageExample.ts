export const getPageExample = (bearerToken: string) => `import requests
import json
from typing import Dict, Any

def create_page(url: str, anon_key: str, access_token: str, page_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new page with complete JSON data."""
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Complete page data structure
    complete_page_data = {
        "slug": page_data["slug"],
        "category_id": page_data["category_id"],
        "content": {
            "brandName": page_data["content"]["brandName"],
            "colorScheme": {
                "primary": page_data["content"]["colorScheme"]["primary"],
                "secondary": page_data["content"]["colorScheme"]["secondary"],
                "accent": page_data["content"]["colorScheme"]["accent"],
                "primaryText": page_data["content"]["colorScheme"]["primaryText"],
                "secondaryText": page_data["content"]["colorScheme"]["secondaryText"],
                "accentText": page_data["content"]["colorScheme"]["accentText"]
            },
            "hero": {
                "title": page_data["content"]["hero"]["title"],
                "description": page_data["content"]["hero"]["description"],
                "image": page_data["content"]["hero"]["image"],
                "price": page_data["content"]["hero"]["price"],
                "subtitle": page_data["content"]["hero"]["subtitle"],
                "buttonText": page_data["content"]["hero"]["buttonText"],
                "backgroundOverlay": page_data["content"]["hero"]["backgroundOverlay"]
            },
            "product": {
                "images": page_data["content"]["product"]["images"],
                "details": {
                    "title": page_data["content"]["product"]["details"]["title"],
                    "price": page_data["content"]["product"]["details"]["price"],
                    "description": page_data["content"]["product"]["details"]["description"],
                    "specifications": page_data["content"]["product"]["details"]["specifications"],
                    "buyNowLink": page_data["content"]["product"]["details"]["buyNowLink"],
                    "availability": page_data["content"]["product"]["details"]["availability"],
                    "duration": page_data["content"]["product"]["details"]["duration"],
                    "cancellationPolicy": page_data["content"]["product"]["details"]["cancellationPolicy"],
                    "additionalInfo": page_data["content"]["product"]["details"]["additionalInfo"]
                },
                "features": page_data["content"]["product"]["features"]
            },
            "features": page_data["content"]["features"],
            "reviews": page_data["content"]["reviews"],
            "footer": page_data["content"]["footer"]
        }
    }
    
    try:
        response = requests.post(f"{url}/rest/v1/pages", headers=headers, json=complete_page_data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to create page: {str(e)}")

# Example usage:
if __name__ == "__main__":
    # Initialize client
    client = SupabaseClient(
        url="https://tylpifixgpoxonedjyzo.supabase.co",
        anon_key="your-anon-key"
    )
    
    # Sign in
    auth_data = client.sign_in("your-email@example.com", "your-password")
    
    # Create a category
    category = create_category(
        url=client.url,
        anon_key=client.anon_key,
        access_token=client.access_token,
        name="Modern Bistro",
        slug="modern-bistro",
        description="A modern fine dining experience"
    )
    
    # Create a page with the new category ID
    page_data = {
        "slug": "modern-bistro/main",
        "category_id": category["id"],
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
            "product": {
                "images": [
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
                    "https://images.unsplash.com/photo-1515669097368-22e68427d265",
                    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
                ],
                "details": {
                    "title": "Fine Dining Experience",
                    "price": 150,
                    "description": "Immerse yourself in an extraordinary culinary journey where each dish tells a story of passion and creativity",
                    "specifications": [
                        "Michelin-Starred Chef",
                        "Seasonal Ingredients",
                        "Wine Pairing Available",
                        "Private Dining Rooms",
                        "Vegan Options Available"
                    ],
                    "buyNowLink": "https://example.com/reserve",
                    "availability": "Limited Seats Available",
                    "duration": "2.5 hours",
                    "cancellationPolicy": "Free cancellation up to 24 hours before",
                    "additionalInfo": {
                        "dresscode": "Smart Casual",
                        "parking": "Valet Available",
                        "accessibility": "Wheelchair Accessible"
                    }
                },
                "features": [
                    "Farm to Table",
                    "Private Dining",
                    "Sommelier Service",
                    "Tasting Menu",
                    "À La Carte Options"
                ]
            },
            "features": [
                {
                    "icon": "UtensilsCrossed",
                    "title": "Culinary Excellence",
                    "description": "Award-winning chefs crafting unforgettable experiences",
                    "details": "Our team of internationally recognized chefs brings decades of experience"
                },
                {
                    "icon": "Wine",
                    "title": "Curated Wine Selection",
                    "description": "Expert sommeliers to guide your wine journey",
                    "details": "Over 300 carefully selected wines from around the world"
                },
                {
                    "icon": "Star",
                    "title": "Michelin Starred",
                    "description": "Recognized for exceptional culinary artistry",
                    "details": "Maintaining our stars for over 5 consecutive years"
                },
                {
                    "icon": "Users",
                    "title": "Private Events",
                    "description": "Bespoke dining experiences for special occasions",
                    "details": "Customizable spaces for 10 to 100 guests"
                }
            ],
            "reviews": [
                {
                    "name": "James Wilson",
                    "rating": 5,
                    "comment": "An extraordinary culinary journey that exceeded all expectations",
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                    "date": "2024-01-15",
                    "verified": true,
                    "location": "New York, NY",
                    "details": "The wine pairing was exceptional"
                },
                {
                    "name": "Sofia Rodriguez",
                    "rating": 5,
                    "comment": "The wine pairing elevated the entire experience. Simply phenomenal!",
                    "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                    "date": "2024-01-10",
                    "verified": true,
                    "location": "Miami, FL",
                    "details": "Perfect for our anniversary celebration"
                }
            ],
            "footer": {
                "contact": {
                    "email": "reservations@modernbistro.com",
                    "phone": "1-888-BISTRO1",
                    "address": "123 Culinary Avenue, Gourmet District, GD 12345",
                    "socialMedia": {
                        "instagram": "@modernbistro",
                        "facebook": "ModernBistroOfficial",
                        "twitter": "@ModernBistro"
                    },
                    "hours": {
                        "monday": "17:00 - 23:00",
                        "tuesday": "17:00 - 23:00",
                        "wednesday": "17:00 - 23:00",
                        "thursday": "17:00 - 23:00",
                        "friday": "17:00 - 00:00",
                        "saturday": "17:00 - 00:00",
                        "sunday": "17:00 - 22:00"
                    }
                },
                "links": [
                    {
                        "title": "Menu",
                        "url": "#menu",
                        "description": "View our current seasonal menu"
                    },
                    {
                        "title": "Reservations",
                        "url": "#reservations",
                        "description": "Book your dining experience"
                    },
                    {
                        "title": "Private Events",
                        "url": "#events",
                        "description": "Plan your special occasion"
                    },
                    {
                        "title": "Gift Cards",
                        "url": "#gift-cards",
                        "description": "Give the gift of fine dining"
                    }
                ],
                "newsletter": {
                    "title": "Stay Updated",
                    "description": "Subscribe to our newsletter for special events and seasonal menus"
                },
                "policies": {
                    "privacy": "/privacy",
                    "terms": "/terms",
                    "accessibility": "/accessibility"
                }
            }
        }
    }
    
    page = create_page(
        url=client.url,
        anon_key=client.anon_key,
        access_token=client.access_token,
        page_data=page_data
    )
    print("Page created successfully:", page)`;