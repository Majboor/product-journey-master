export const sampleCategoryData = {
  "name": "Sample Data",
  "slug": "sample-data"
};

export const samplePageData = {
  "slug": "sample-data/modern-bistro",
  "category_id": null, // Will be set dynamically
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
      "price": 150.00,
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
        "price": 150.00,
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
};

export const colorSchemeExamples = {
  default: {
    primary: "#2563eb",    // Blue
    secondary: "#f8fafc",  // Light gray
    accent: "#dbeafe",     // Light blue
    primaryText: "#FFFFFF", // White text for primary
    secondaryText: "#1A1F2C", // Dark text for secondary
    accentText: "#1A1F2C"  // Dark text for accent
  },
  dark: {
    primary: "#1A1F2C",    // Dark blue
    secondary: "#f8fafc",  // Light gray
    accent: "#6E59A5",     // Purple
    primaryText: "#FFFFFF",
    secondaryText: "#1A1F2C",
    accentText: "#FFFFFF"
  },
  premium: {
    primary: "#8B0000",    // Deep Red
    secondary: "#F5F5F5",  // Light Gray
    accent: "#FFD700",     // Gold
    primaryText: "#FFFFFF", // White text for primary
    secondaryText: "#1A1F2C", // Dark text for secondary
    accentText: "#1A1F2C"  // Dark text for accent
  },
  ocean: {
    primary: "#0EA5E9",    // Ocean blue
    secondary: "#f8fafc",  // Light gray
    accent: "#1EAEDB",     // Bright blue
    primaryText: "#FFFFFF",
    secondaryText: "#1A1F2C",
    accentText: "#FFFFFF"
  }
};
