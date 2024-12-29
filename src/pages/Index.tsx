import { useState, useEffect } from "react";
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
import { initializeDefaultPages } from "@/utils/initializeDefaultPages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContent, isPageContent } from "@/types/content";
import { ErrorPage } from "@/components/ErrorPage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize tracking hooks
  useSwipeTracking();
  useButtonTracking();
  
  const { data: pageContent, error: pageError } = useQuery({
    queryKey: ['rootPage'],
    queryFn: async () => {
      try {
        console.log('Fetching root page content');
        const { data, error } = await supabase
          .from('pages')
          .select('content')
          .eq('slug', '')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching page content:', error);
          toast({
            title: "Error",
            description: "Failed to load page content",
            variant: "destructive",
          });
          return defaultContent;
        }
        
        // Use the type guard to validate the content
        const content = data?.content;
        if (content && isPageContent(content)) {
          console.log('Valid page content found');
          return content;
        }
        
        console.warn('Invalid page content structure, using default content');
        return defaultContent;
      } catch (error) {
        console.error('Error in query:', error);
        return defaultContent;
      }
    },
    retry: 1
  });

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDefaultPages();
        // Simulate loading time for demonstration
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error initializing pages:', error);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (pageError) {
    return (
      <ErrorPage 
        title="Error Loading Page"
        description="There was an error loading the page content. Please try again later."
      />
    );
  }

  const content = pageContent || defaultContent;

  return (
    <div className="min-h-screen bg-white">
      <Header brandName={content.brandName} />
      <main>
        <Hero 
          title={content.hero.title}
          description={content.hero.description}
          image={content.hero.image}
          price={content.hero.price}
        />
        <ProductSection 
          images={content.product.images}
          details={content.product.details}
          features={content.product.features}
        />
        <Features features={content.features} />
        <Reviews reviews={content.reviews || []} />
      </main>
      <Footer 
        brandName={content.brandName}
        contact={content.footer.contact}
        links={content.footer.links}
      />
    </div>
  );
};

export default Index;