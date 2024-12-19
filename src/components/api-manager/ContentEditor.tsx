import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { PageContent, validatePageContent } from "@/types/content";
import { Json } from "@/integrations/supabase/types";

export const defaultBurgerContent: PageContent = {
  brandName: "Burger Haven",
  hero: {
    title: "Gourmet Burgers Made Fresh",
    description: "Hand-crafted burgers using premium ingredients and secret family recipes",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    price: 14.99
  },
  product: {
    images: [
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828",
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9"
    ],
    details: {
      description: "Our signature burger features a perfectly seasoned patty, melted premium cheese, and fresh locally-sourced vegetables",
      specifications: [
        "100% Angus Beef",
        "Artisanal Buns",
        "House-made Sauces"
      ],
      buyNowLink: "https://example.com/buy-now"
    },
    features: [
      "Made to Order",
      "Local Ingredients",
      "Secret Recipe"
    ]
  },
  features: [
    {
      icon: "Utensils",
      title: "Fresh Ingredients",
      description: "We use only the freshest, locally-sourced ingredients"
    },
    {
      icon: "Clock",
      title: "Quick Service",
      description: "From grill to table in under 10 minutes"
    },
    {
      icon: "Award",
      title: "Award Winning",
      description: "Voted best burger in town 3 years running"
    },
    {
      icon: "Heart",
      title: "Made with Love",
      description: "Every burger crafted with care and attention"
    }
  ],
  reviews: [
    {
      name: "John Smith",
      rating: 5,
      comment: "Best burger I've ever had! The meat was perfectly cooked.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing flavors and great service. Will definitely be back!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    {
      name: "Mike Wilson",
      rating: 5,
      comment: "The quality of ingredients really shows. Worth every penny!",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    }
  ],
  footer: {
    contact: {
      email: "hello@burgerhaven.com",
      phone: "1-800-BURGERS",
      address: "123 Burger Street, Foodville, FD 12345"
    },
    links: [
      {
        title: "About Us",
        url: "#about"
      },
      {
        title: "Menu",
        url: "#menu"
      },
      {
        title: "Contact",
        url: "#contact"
      }
    ]
  }
};

export const ContentEditor = () => {
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(JSON.stringify(defaultBurgerContent, null, 2));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedContent = JSON.parse(content);
      
      // Validate the content structure
      if (!validatePageContent(parsedContent)) {
        throw new Error('Invalid content structure. Please ensure all required fields are present.');
      }
      
      // First check if the page already exists
      const { data: existingPage } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existingPage) {
        toast({
          title: "Error",
          description: "A page with this slug already exists. Please use a different slug.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // If no existing page, create a new one
      const { error } = await supabase
        .from('pages')
        .insert({ 
          slug,
          content: parsedContent as Json
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "New page has been created successfully",
      });

      setSlug("");
      setContent(JSON.stringify(defaultBurgerContent, null, 2));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Page Slug
          </label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g., menu"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Page Content (JSON)
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono min-h-[300px]"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSlug("");
              setContent(JSON.stringify(defaultBurgerContent, null, 2));
            }}
          >
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
