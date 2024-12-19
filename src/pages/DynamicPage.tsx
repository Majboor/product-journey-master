import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { ColorSchemeProvider } from "@/components/ColorSchemeProvider";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const DynamicPage = () => {
  const { categorySlug, slug } = useParams();
  const finalSlug = slug || '';
  
  usePageAnalytics(finalSlug);

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', categorySlug, finalSlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) {
        throw new Error('Category not found');
      }

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('category_id', category.id)
        .eq('slug', finalSlug)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <ColorSchemeProvider colorScheme={page.color_scheme}>
      <div className="min-h-screen">
        <Hero content={page.content} />
        <ProductSection content={page.content} />
        <Features content={page.content} />
        <Reviews content={page.content} />
        <Footer content={page.content} />
      </div>
    </ColorSchemeProvider>
  );
};

export default DynamicPage;