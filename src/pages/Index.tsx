import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { defaultContent } from "@/components/api-manager/defaultContent";
import { useSwipeTracking } from "@/hooks/useSwipeTracking";
import { useButtonTracking } from "@/hooks/useButtonTracking";
import { useState, useEffect } from "react";
import { initializeDefaultPages } from "@/utils/initializeDefaultPages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContent, isPageContent } from "@/types/content";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: pageContent = defaultContent } = useQuery({
    queryKey: ['rootPage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', '')
        .single();
      
      if (error) {
        console.error('Error fetching page content:', error);
        return defaultContent;
      }
      
      // Use the type guard to validate the content
      const content = data?.content;
      if (content && isPageContent(content)) {
        return content;
      }
      
      console.warn('Invalid page content structure, using default content');
      return defaultContent;
    }
  });

  useSwipeTracking();
  useButtonTracking();

  useEffect(() => {
    const init = async () => {
      await initializeDefaultPages();
      // Simulate loading time for demonstration
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    };

    init();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header brandName={pageContent.brandName} />
      <main>
        <Hero 
          title={pageContent.hero.title}
          description={pageContent.hero.description}
          image={pageContent.hero.image}
          price={pageContent.hero.price}
        />
        <ProductSection 
          images={pageContent.product.images}
          details={pageContent.product.details}
          features={pageContent.product.features}
        />
        <Features features={pageContent.features} />
        <Reviews reviews={pageContent.reviews || []} />
      </main>
      <Footer 
        brandName={pageContent.brandName}
        contact={pageContent.footer.contact}
        links={pageContent.footer.links}
      />
    </div>
  );
};

export default Index;