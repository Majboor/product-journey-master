export const samplePageData = {
  "slug": "sample-page",
  "content": {
    "brandName": "Sample Brand",
    "colorScheme": {
      "primary": "#2563eb",
      "secondary": "#f0f9ff",
      "accent": "#dbeafe"
    },
    "hero": {
      "title": "Welcome to Our Sample Page",
      "description": "This is a complete example of a valid page structure",
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "price": 99.99
    },
    "product": {
      "images": [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        "https://images.unsplash.com/photo-1515669097368-22e68427d265",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
      ],
      "details": {
        "description": "This is a detailed description of our sample product that showcases all the required fields",
        "specifications": [
          "Specification 1",
          "Specification 2",
          "Specification 3"
        ],
        "buyNowLink": "https://example.com/buy-now"
      },
      "features": [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ]
    },
    "features": [
      {
        "icon": "Star",
        "title": "Feature One",
        "description": "Description of feature one"
      },
      {
        "icon": "Heart",
        "title": "Feature Two",
        "description": "Description of feature two"
      },
      {
        "icon": "Shield",
        "title": "Feature Three",
        "description": "Description of feature three"
      },
      {
        "icon": "Zap",
        "title": "Feature Four",
        "description": "Description of feature four"
      }
    ],
    "reviews": [
      {
        "name": "John Doe",
        "rating": 5,
        "comment": "This is a sample review comment",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      {
        "name": "Jane Smith",
        "rating": 5,
        "comment": "Another sample review comment",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      }
    ],
    "footer": {
      "contact": {
        "email": "contact@example.com",
        "phone": "1-800-EXAMPLE",
        "address": "123 Sample Street, Example City, EX 12345"
      },
      "links": [
        {
          "title": "Home",
          "url": "#home"
        },
        {
          "title": "About",
          "url": "#about"
        },
        {
          "title": "Contact",
          "url": "#contact"
        }
      ]
    }
  }
};

export const colorSchemeExamples = {
  default: {
    primary: "#2563eb",    // Blue
    secondary: "#f8fafc",  // Light gray
    accent: "#dbeafe"      // Light blue
  },
  dark: {
    primary: "#1A1F2C",    // Dark blue
    secondary: "#f8fafc",  // Light gray
    accent: "#6E59A5"      // Purple
  },
  purple: {
    primary: "#6E59A5",    // Dark purple
    secondary: "#f8fafc",  // Light gray
    accent: "#9b87f5"      // Light purple
  },
  vivid: {
    primary: "#8B5CF6",    // Bright purple
    secondary: "#f8fafc",  // Light gray
    accent: "#F97316"      // Orange
  },
  ocean: {
    primary: "#0EA5E9",    // Ocean blue
    secondary: "#f8fafc",  // Light gray
    accent: "#1EAEDB"      // Bright blue
  }
};