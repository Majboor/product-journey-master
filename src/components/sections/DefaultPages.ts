import { PageContent } from "@/types/content";

export const defaultPages: Record<string, PageContent> = {
  "about": {
    brandName: "Supreme Crash Cams",
    colorScheme: {
      primary: "#2563eb",
      secondary: "#f0f9ff",
      accent: "#dbeafe"
    },
    hero: {
      title: "About Us",
      description: "Learn about our journey and mission",
      image: "/placeholder.svg",
      price: 0
    },
    product: {
      images: ["/placeholder.svg"],
      details: {
        description: "Our story",
        specifications: ["Founded in 2024", "Global Presence", "24/7 Support"],
        buyNowLink: "#contact"
      },
      features: ["Quality Service", "Expert Team", "Innovation"]
    },
    features: [
      {
        icon: "Star",
        title: "Excellence",
        description: "Committed to delivering the best"
      },
      {
        icon: "Users",
        title: "Team",
        description: "Expert professionals at your service"
      },
      {
        icon: "Shield",
        title: "Trust",
        description: "Building lasting relationships"
      }
    ],
    reviews: [],
    footer: {
      contact: {
        email: "contact@example.com",
        phone: "+1 234 567 890",
        address: "123 Main St"
      },
      links: [
        { title: "Home", url: "/" },
        { title: "Contact", url: "#contact" }
      ]
    }
  },
  "features": {
    brandName: "Supreme Crash Cams",
    colorScheme: {
      primary: "#2563eb",
      secondary: "#f0f9ff",
      accent: "#dbeafe"
    },
    hero: {
      title: "Our Features",
      description: "Discover what makes us unique",
      image: "/placeholder.svg",
      price: 0
    },
    product: {
      images: ["/placeholder.svg"],
      details: {
        description: "Feature overview",
        specifications: ["Advanced Technology", "Easy Integration", "Reliable Performance"],
        buyNowLink: "#contact"
      },
      features: ["24/7 Support", "Cloud Storage", "Real-time Analytics"]
    },
    features: [
      {
        icon: "Zap",
        title: "Fast",
        description: "Lightning quick performance"
      },
      {
        icon: "Shield",
        title: "Secure",
        description: "Enterprise-grade security"
      },
      {
        icon: "Settings",
        title: "Customizable",
        description: "Tailored to your needs"
      }
    ],
    reviews: [],
    footer: {
      contact: {
        email: "contact@example.com",
        phone: "+1 234 567 890",
        address: "123 Main St"
      },
      links: [
        { title: "Home", url: "/" },
        { title: "Contact", url: "#contact" }
      ]
    }
  }
};