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
import { PageContent, isPageContent, validatePageContent } from "@/types/content";
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
          return null;
        }
        
        // Validate the content structure
        const content = data?.content;
        if (content) {
          const validation = validatePageContent(content);
          console.log('Content validation:', validation);
          
          if (!validation.isValid) {
            console.error('Invalid page content structure:', validation.errors);
            return null;
          }
          
          if (isPageContent(content)) {
            console.log('Valid page content found');
            return content;
          }
        }
        
        console.warn('Invalid or missing page content, returning null');
        return null;
      } catch (error) {
        console.error('Error in query:', error);
        return null;
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

  // Show error page if there's an error or no valid content
  if (pageError || !pageContent) {
    return (
      <ErrorPage 
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has invalid content."
      />
    );
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