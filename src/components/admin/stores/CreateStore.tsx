import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateStoreForm {
  name: string;
  slug: string;
  description: string;
  template_type: 'single_product' | 'ecommerce';
}

export const CreateStore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateStoreForm>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      template_type: "single_product",
    },
  });

  const onSubmit = async (data: CreateStoreForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: data.name,
          slug: data.slug,
          description: data.description,
        }]);

      if (error) throw error;

      // Create initial page for the store
      const { error: pageError } = await supabase
        .from('pages')
        .insert([{
          slug: data.slug,
          category_id: (await supabase
            .from('categories')
            .select('id')
            .eq('slug', data.slug)
            .single()).data?.id,
          template_type: data.template_type,
          content: {
            brandName: data.name,
            hero: {
              title: "Welcome to " + data.name,
              description: "Your one-stop shop for quality products",
              image: "/placeholder.svg",
              price: 99.99
            },
            product: {
              images: ["/placeholder.svg"],
              details: {
                title: "Product Name",
                price: 99.99,
                description: "Product description goes here",
                specifications: ["Spec 1", "Spec 2"],
                buyNowLink: "#"
              },
              features: ["Feature 1", "Feature 2"]
            },
            features: [
              {
                icon: "Star",
                title: "Quality",
                description: "High-quality products"
              }
            ],
            reviews: [],
            footer: {
              contact: {
                email: "contact@example.com",
                phone: "+1234567890",
                address: "123 Street Name"
              },
              links: []
            }
          }
        }]);

      if (pageError) throw pageError;

      toast({
        title: "Success",
        description: "Store created successfully",
      });

      navigate("/admin/stores");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create store",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Store</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store URL Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used in the URL (e.g., /store-name)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single_product">Single Product</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose between a single product showcase or a full e-commerce store
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/stores")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Store"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};