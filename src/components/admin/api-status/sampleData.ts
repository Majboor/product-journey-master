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
      "description": "Where tradition meets innovation",
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "price": 150.00
    },
    "product": {
      "images": [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        "https://images.unsplash.com/photo-1515669097368-22e68427d265",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
      ],
      "details": {
        "description": "Immerse yourself in an extraordinary culinary journey where each dish tells a story of passion and creativity",
        "specifications": [
          "Michelin-Starred Chef",
          "Seasonal Ingredients",
          "Wine Pairing Available"
        ],
        "buyNowLink": "https://example.com/reserve"
      },
      "features": [
        "Farm to Table",
        "Private Dining",
        "Sommelier Service"
      ]
    },
    "features": [
      {
        "icon": "UtensilsCrossed",
        "title": "Culinary Excellence",
        "description": "Award-winning chefs crafting unforgettable experiences"
      },
      {
        "icon": "Wine",
        "title": "Curated Wine Selection",
        "description": "Expert sommeliers to guide your wine journey"
      },
      {
        "icon": "Star",
        "title": "Michelin Starred",
        "description": "Recognized for exceptional culinary artistry"
      },
      {
        "icon": "Users",
        "title": "Private Events",
        "description": "Bespoke dining experiences for special occasions"
      }
    ],
    "reviews": [
      {
        "name": "James Wilson",
        "rating": 5,
        "comment": "An extraordinary culinary journey that exceeded all expectations",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      {
        "name": "Sofia Rodriguez",
        "rating": 5,
        "comment": "The wine pairing elevated the entire experience. Simply phenomenal!",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      }
    ],
    "footer": {
      "contact": {
        "email": "reservations@modernbistro.com",
        "phone": "1-888-BISTRO1",
        "address": "123 Culinary Avenue, Gourmet District, GD 12345"
      },
      "links": [
        {
          "title": "Menu",
          "url": "#menu"
        },
        {
          "title": "Reservations",
          "url": "#reservations"
        },
        {
          "title": "Private Events",
          "url": "#events"
        }
      ]
    }
  }
};

export const sampleCategoryData = {
  "name": "Sample Data",
  "slug": "sample-data",
  "description": "Sample pages for demonstration purposes"
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
