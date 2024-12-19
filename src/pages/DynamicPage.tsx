import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { PageContent, isPageContent } from "@/types/content";

const DynamicPage = () => {
  const { slug } = useParams();

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['page', slug], // Ensure unique query key per slug
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      const content = data?.content;
      if (!isPageContent(content)) {
        throw new Error('Invalid page content structure');
      }
      
      return content;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  if (error || !pageData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">
      Page not found or error loading content
    </div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header brandName={pageData.brandName} />
      <main>
        <Hero 
          title={pageData.hero.title}
          description={pageData.hero.description}
          image={pageData.hero.image}
          price={pageData.hero.price}
        />
        <ProductSection 
          images={pageData.product.images}
          details={pageData.product.details}
          features={pageData.product.features}
        />
        <Features features={pageData.features} />
        <Reviews reviews={pageData.reviews} />
      </main>
      <Footer 
        brandName={pageData.brandName}
        contact={pageData.footer.contact}
        links={pageData.footer.links}
      />
    </div>
  );
};

export default DynamicPage;