import { PageContent } from "@/types/content";

export const defaultContent: PageContent = {
  brandName: "Modern Bistro",
  colorScheme: {
    primary: "#2563eb",
    secondary: "#f0f9ff",
    accent: "#dbeafe"
  },
  hero: {
    title: "Experience Modern Dining",
    description: "Contemporary cuisine crafted with passion and innovation",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    price: 45.00
  },
  product: {
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1515669097368-22e68427d265",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"
    ],
    details: {
      description: "Our signature tasting menu features seasonal ingredients prepared with modern techniques, offering a unique dining experience that delights all senses",
      specifications: [
        "Seasonal Ingredients",
        "Modern Techniques",
        "Wine Pairing Available"
      ],
      buyNowLink: "https://example.com/reserve"
    },
    features: [
      "Farm to Table",
      "Award-winning Chef",
      "Intimate Atmosphere"
    ]
  },
  features: [
    {
      icon: "Leaf",
      title: "Seasonal Menu",
      description: "Menu changes with the seasons to ensure the freshest ingredients"
    },
    {
      icon: "Wine",
      title: "Expert Sommelier",
      description: "Curated wine selection to complement your meal"
    },
    {
      icon: "Star",
      title: "Michelin Rated",
      description: "Recognized for exceptional culinary excellence"
    },
    {
      icon: "Users",
      title: "Private Events",
      description: "Exclusive dining experiences for special occasions"
    }
  ],
  reviews: [
    {
      name: "Emily Chen",
      rating: 5,
      comment: "An extraordinary culinary journey. Every dish tells a story.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    {
      name: "James Wilson",
      rating: 5,
      comment: "Innovative flavors and impeccable presentation. A must-visit!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Sofia Rodriguez",
      rating: 5,
      comment: "The wine pairing elevated the entire experience. Phenomenal!",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    }
  ],
  footer: {
    contact: {
      email: "reservations@modernbistro.com",
      phone: "1-888-BISTRO1",
      address: "123 Culinary Avenue, Gourmet District, GD 12345"
    },
    links: [
      {
        title: "Menu",
        url: "#menu"
      },
      {
        title: "Reservations",
        url: "#reservations"
      },
      {
        title: "Private Events",
        url: "#events"
      }
    ]
  }
};
