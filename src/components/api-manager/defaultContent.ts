import { PageContent } from "@/types/content";

export const defaultContent: PageContent = {
  brandName: "Supreme Crash Cams",
  colorScheme: {
    primary: "#2563eb",
    secondary: "#f0f9ff",
    accent: "#dbeafe"
  },
  hero: {
    title: "Experience Modern Dining",
    description: "Contemporary cuisine crafted with passion and innovation",
    image: "/placeholder.svg",
    price: 149.99
  },
  product: {
    images: ["/placeholder.svg"],
    details: {
      title: "Supreme Crash Cam Pro",
      price: 299.99,
      description: "Our signature products feature cutting-edge technology and superior quality",
      specifications: [
        "High Quality",
        "Modern Design",
        "Expert Support"
      ],
      buyNowLink: "https://example.com/buy"
    },
    features: [
      "Premium Materials",
      "Advanced Technology",
      "24/7 Support"
    ]
  },
  features: [
    {
      icon: "Shield",
      title: "Security",
      description: "Top-notch security features"
    },
    {
      icon: "Camera",
      title: "Quality",
      description: "Crystal clear footage"
    },
    {
      icon: "Lock",
      title: "Privacy",
      description: "Your data is protected"
    }
  ],
  reviews: [
    {
      name: "John Smith",
      rating: 5,
      comment: "Best dash cam I've ever used! The quality is amazing and customer support is top-notch.",
      image: "/placeholder.svg"
    },
    {
      name: "Sarah Johnson",
      rating: 4,
      comment: "Very impressed with the night vision capabilities. Installation was a breeze.",
      image: "/placeholder.svg"
    },
    {
      name: "Michael Brown",
      rating: 5,
      comment: "The motion detection feature has already saved me twice. Highly recommend!",
      image: "/placeholder.svg"
    }
  ],
  footer: {
    contact: {
      email: "contact@example.com",
      phone: "+1 234 567 890",
      address: "123 Main St"
    },
    links: [
      { title: "Home", url: "/" },
      { title: "About", url: "/sample-data/about" },
      { title: "Features", url: "/sample-data/features" }
    ]
  }
};