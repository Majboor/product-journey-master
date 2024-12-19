import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { PageContent } from "@/types/content";

const DynamicPage = () => {
  const { slug } = useParams();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data?.content as PageContent;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pageData) {
    return <div>Page not found</div>;
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