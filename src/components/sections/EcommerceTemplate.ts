import { PageContent } from "@/types/content";

export const ecommerceTemplate: PageContent = {
  brandName: "",
  hero: {
    title: "Welcome to Our Store",
    description: "Discover our amazing collection of products",
    image: "/placeholder.svg",
    price: 0
  },
  product: {
    images: ["/placeholder.svg"],
    details: {
      title: "Featured Product",
      price: 99.99,
      description: "Our featured product description",
      specifications: ["Quality Materials", "Fast Shipping", "24/7 Support"],
      buyNowLink: "#"
    },
    features: ["Premium Quality", "Fast Delivery", "Money-back Guarantee"]
  },
  features: [
    {
      icon: "ShoppingBag",
      title: "Wide Selection",
      description: "Browse through our extensive collection"
    },
    {
      icon: "Truck",
      title: "Fast Shipping",
      description: "Get your items delivered quickly"
    },
    {
      icon: "Shield",
      title: "Secure Shopping",
      description: "Shop with confidence"
    }
  ],
  reviews: [
    {
      name: "John Doe",
      rating: 5,
      comment: "Great products and service!",
      image: "/placeholder.svg"
    }
  ],
  footer: {
    contact: {
      email: "contact@example.com",
      phone: "+1234567890",
      address: "123 Store Street"
    },
    links: [
      {
        title: "About Us",
        url: "/about"
      },
      {
        title: "Contact",
        url: "/contact"
      },
      {
        title: "Terms & Conditions",
        url: "/terms"
      }
    ]
  }
};