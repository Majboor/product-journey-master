import { useState, useEffect } from "react";
import { Clock, Users, CheckCircle } from "lucide-react";
import { ProductCarousel } from "./product/ProductCarousel";
import { ProductDetails } from "./product/ProductDetails";
import { ProductFeatures } from "./product/ProductFeatures";
import { JokeDisplay } from "./jokes/JokeDisplay";
import { useAuth } from "./auth/AuthProvider";
import { ProductDetails as ProductDetailsType } from "@/types/content";
import { useToast } from "@/components/ui/use-toast";

interface ProductSectionProps {
  images?: string[];
  details?: ProductDetailsType;
  features?: string[];
}

const ProductSection = ({ images = [], details, features = [] }: ProductSectionProps) => {
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [stockCount, setStockCount] = useState(5);
  const [viewerCount, setViewerCount] = useState(245);
  const [recentPurchase, setRecentPurchase] = useState({ show: false, name: "", location: "" });
  const { session, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;

      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
      }
      if (newHours < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft(`${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Simulated Recent Purchase Effect
  useEffect(() => {
    const purchaseTimer = setInterval(() => {
      const names = ["Sarah", "John", "Emma", "Michael", "Lisa"];
      const locations = ["New York", "London", "Paris", "Tokyo", "Sydney"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      setRecentPurchase({ show: true, name: randomName, location: randomLocation });
      setTimeout(() => setRecentPurchase({ show: false, name: "", location: "" }), 3000);
    }, 15000);

    return () => clearInterval(purchaseTimer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!details) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Product details are missing or invalid. Please check your data and try again.",
    });
    
    return (
      <div className="py-16 bg-accent">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-600">Product details not available</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-accent relative overflow-hidden">
      {/* Subliminal Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E')", 
                    backgroundSize: "48px", 
                    backgroundRepeat: "repeat" }} />
      
      <div className="container px-4 mx-auto">
        {session && (
          <>
            {/* Joke Display */}
            <JokeDisplay userId={session.user.id} />
            
            {/* Flash Sale Banner */}
            <div className="mt-4 mb-8 bg-yellow-100/80 text-primary p-3 rounded-lg text-center animate-pulse">
              <span className="font-semibold opacity-90">🎉 Flash Sale Alert!</span>
              <span className="ml-2 text-sm opacity-80">Ends in {timeLeft}</span>
            </div>
          </>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <ProductCarousel images={images} />
            
            {/* Social Proof Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center text-sm text-primary/80">
                <Users className="w-4 h-4 mr-2" />
                <span>{viewerCount} people are viewing this item now</span>
              </div>
              {recentPurchase.show && (
                <div className="flex items-center justify-center text-sm text-green-600 animate-fade-in">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>{recentPurchase.name} from {recentPurchase.location} just purchased this!</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <ProductDetails {...details} />
            <ProductFeatures features={features} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
