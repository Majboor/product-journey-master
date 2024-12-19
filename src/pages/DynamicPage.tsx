import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { ColorSchemeProvider } from "@/components/ColorSchemeProvider";
import { PageContent } from "@/types/content";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { useEffect } from "react";

const DynamicPage = () => {
  const { slug = '' } = useParams();

  // Initialize analytics tracking
  usePageAnalytics(slug);

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <LoadingScreen />;
  if (!page) return <div>Page not found</div>;

  const content = page.content as unknown as PageContent;

  return (
    <ColorSchemeProvider colorScheme={content.colorScheme}>
      <div className="min-h-screen bg-background">
        <Header brandName={content.brandName} />
        <main>
          <Hero {...content.hero} />
          <ProductSection 
            images={content.product.images}
            details={content.product.details}
            features={content.product.features}
          />
          <Features features={content.features} />
          <Reviews reviews={content.reviews} />
        </main>
        <Footer
          brandName={content.brandName}
          contact={content.footer.contact}
          links={content.footer.links}
        />
      </div>
    </ColorSchemeProvider>
  );
};

export default DynamicPage;