import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { defaultBurgerContent } from "@/components/api-manager/ContentEditor";

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

  return (
    <div className="min-h-screen bg-white">
      <Header brandName={defaultBurgerContent.brandName} />
      <main>
        <Hero 
          title={defaultBurgerContent.hero.title}
          description={defaultBurgerContent.hero.description}
          image={defaultBurgerContent.hero.image}
          price={defaultBurgerContent.hero.price}
        />
        <ProductSection 
          images={defaultBurgerContent.product.images}
          details={defaultBurgerContent.product.details}
          features={defaultBurgerContent.product.features}
        />
        <Features features={defaultBurgerContent.features} />
        <Reviews reviews={defaultBurgerContent.reviews} />
      </main>
      <Footer 
        brandName={defaultBurgerContent.brandName}
        contact={defaultBurgerContent.footer.contact}
        links={defaultBurgerContent.footer.links}
      />
    </div>
  );
};

export default Index;