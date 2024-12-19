import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const defaultBurgerContent = {
  title: "Juicy Burgers & More",
  description: "Handcrafted burgers made with premium ingredients",
  color_scheme: {
    primary: "#FF4D4D",
    secondary: "#FFF3E0",
    accent: "#2C3E50"
  },
  images: [
    {
      id: "hero_image",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      alt: "Signature burger with melted cheese"
    },
    {
      id: "chef_special",
      url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
      alt: "Chef preparing a gourmet burger"
    }
  ],
  menu_items: [
    {
      id: "classic",
      name: "Classic Cheeseburger",
      description: "100% Angus beef, aged cheddar, lettuce, tomato, special sauce",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9"
    },
    {
      id: "spicy",
      name: "Spicy Jalapeño Burger",
      description: "Pepper jack cheese, fresh jalapeños, chipotle mayo",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828"
    }
  ],
  sections: [
    {
      id: "about",
      heading: "Our Story",
      body: "Founded in 2024, we're passionate about creating the perfect burger. Using locally sourced ingredients and freshly baked buns, each burger is crafted to perfection."
    },
    {
      id: "special_offers",
      heading: "Weekly Specials",
      body: "Every Tuesday: Buy one burger, get fries free! Student discount available with valid ID."
    }
  ],
  faq: [
    {
      question: "Are your burgers made fresh daily?",
      answer: "Yes! We grind our premium beef every morning and hand-form each patty."
    },
    {
      question: "Do you offer vegetarian options?",
      answer: "Absolutely! We have plant-based patties available for any burger on our menu."
    }
  ]
};

export const ContentEditor = () => {
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(JSON.stringify(defaultBurgerContent, null, 2));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contentObj = JSON.parse(content);
      
      const { error } = await supabase
        .from('pages')
        .upsert({ 
          slug,
          content: contentObj
        }, { 
          onConflict: 'slug' 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page content has been updated successfully",
      });

      setSlug("");
      setContent(JSON.stringify(defaultBurgerContent, null, 2));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update page content",
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