import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { validatePageContent, isPageContent, PageContent } from "@/types/content";
import { ErrorPage } from "@/components/ErrorPage";
import { useButtonTracking } from "@/hooks/useButtonTracking";
import { useSwipeTracking } from "@/hooks/useSwipeTracking";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

const DynamicPage = () => {
  const location = useLocation();
  const slug = location.pathname.substring(1);

  // Initialize tracking
  useButtonTracking();
  useSwipeTracking();

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['page-content', slug],
    queryFn: async () => {
      console.log('Fetching page content for slug:', slug);
      
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug || '')  // Use empty string for root page
        .maybeSingle();
      
      if (error) throw error;
      console.log('Fetched page content:', data);
      return data;
    }
  });

  useEffect(() => {
    if (pageData?.content) {
      const validation = validatePageContent(pageData.content);
      console.log('Content validation:', validation);
    }
  }, [pageData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <ErrorPage 
        title="Error Loading Page"
        description="There was an error loading the page content. Please try again later."
      />
    );
  }

  if (!pageData) {
    return (
      <ErrorPage 
        title="Page Not Found"
        description="The requested page could not be found."
      />
    );
  }

  if (!isPageContent(pageData.content)) {
    return (
      <ErrorPage 
        title="Invalid Page Content"
        description="The page content structure is invalid."
        errors={validatePageContent(pageData.content).errors}
      />
    );
  }

  const content: PageContent = pageData.content;
  console.log('Display brand name:', content.brandName);

  return (
    <div className="min-h-screen">
      <Hero {...content.hero} />
      <ProductSection {...content.product} />
      <Features features={content.features} />
      <Reviews reviews={content.reviews} />
      <Footer {...content.footer} brandName={content.brandName} />
    </div>
  );
};

export default DynamicPage;