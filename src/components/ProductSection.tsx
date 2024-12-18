import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Shield, Camera, Timer, Users, Clock, Star, CheckCircle, Award } from "lucide-react";
import { useState, useEffect } from "react";

const ProductSection = () => {
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [stockCount, setStockCount] = useState(5);
  const [viewerCount, setViewerCount] = useState(245);
  const [recentPurchase, setRecentPurchase] = useState({ show: false, name: "", location: "" });

  // Countdown Timer Effect
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

  const images = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  ];

  const features = [
    { icon: Camera, text: "1080p HD Quality" },
    { icon: Shield, text: "Motion Detection" },
    { icon: Timer, text: "Loop Recording" },
  ];

  return (
    <section className="py-16 bg-accent relative overflow-hidden">
      {/* Subliminal Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E')", 
                    backgroundSize: "48px", 
                    backgroundRepeat: "repeat" }} />
      
      <div className="container px-4 mx-auto">
        {/* Flash Sale Banner with Subtle Animation */}
        <div className="mb-8 bg-yellow-100/80 text-primary p-3 rounded-lg text-center animate-pulse">
          <span className="font-semibold opacity-90">🎉 Flash Sale Alert!</span>
          <span className="ml-2 text-sm opacity-80">Ends in {timeLeft}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Carousel Section */}
          <div className="flex-1">
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1 relative">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      {/* Low Stock Indicator */}
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500/30 transition-all duration-1000"
                          style={{ width: `${(stockCount / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            {/* Social Proof Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center text-sm text-primary/80">
                <Users className="w-4 h-4 mr-2" />
                <span>{viewerCount} people are viewing this item now</span>
              </div>
              {/* Recent Purchase Notification */}
              {recentPurchase.show && (
                <div className="flex items-center justify-center text-sm text-green-600 animate-fade-in">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>{recentPurchase.name} from {recentPurchase.location} just purchased this!</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-primary">Supreme Crash Cam</h2>
                <span className="bg-secondary/80 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                  Limited Edition
                </span>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-primary/80">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Top-Rated Dash Cam of 2024</span>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold text-primary">$299.00</p>
                <span className="text-red-500/90 text-sm font-medium animate-pulse">
                  Only {stockCount} units left in stock!
                </span>
              </div>

              {/* Rating Section */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-primary/80">(2,450+ Reviews)</span>
              </div>

              <p className="text-gray-600">
                Professional-grade dash cam with superior night vision and advanced
                safety features. Perfect for both personal and commercial use.
              </p>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 text-sm text-primary/80 bg-secondary/50 p-2 rounded-md">
                <Clock className="w-4 h-4" />
                <span>Special offer ends in: {timeLeft}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Key Features</h3>
              <div className="grid gap-4">
                {features.map((Feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-gray-600">{Feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <ShoppingCart className="mr-2" />
                Add to Cart Now - Limited Time Offer
              </Button>
              <p className="text-center text-sm text-primary/70 mt-2">
                Trusted by thousands of drivers worldwide
              </p>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Free shipping
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 30-day money-back guarantee
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 2-year warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;