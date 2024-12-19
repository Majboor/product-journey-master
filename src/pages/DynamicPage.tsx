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
import { PageContent } from "@/types/content";
import { ColorScheme } from "@/types/colors";

const DynamicPage = () => {
  const { categorySlug, slug } = useParams();
  const finalSlug = `${categorySlug}/${slug}`;
  
  usePageAnalytics(finalSlug);

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', categorySlug, slug],
    queryFn: async () => {
      console.log('Fetching page with slug:', finalSlug);
      
      const { data, error } = await supabase
        .from('pages')
        .select('*, categories(*)')
        .eq('slug', finalSlug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Page not found');
      }

      console.log('Fetched page:', data);
      return data;
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>
    );
  }

  const content = page.content as unknown as PageContent;
  const colorScheme = page.color_scheme as unknown as ColorScheme;

  return (
    <ColorSchemeProvider colorScheme={colorScheme}>
      <div className="min-h-screen">
        <Hero {...content.hero} />
        <ProductSection {...content.product} />
        <Features features={content.features} />
        <Reviews reviews={content.reviews} />
        <Footer {...content.footer} brandName={content.brandName} />
      </div>
    </ColorSchemeProvider>
  );
};

export default DynamicPage;