import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { defaultContent } from "@/components/api-manager/defaultContent";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  // Use defaultContent for the index page
  const pageContent = defaultContent;

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
        <Reviews reviews={pageContent.reviews} />
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