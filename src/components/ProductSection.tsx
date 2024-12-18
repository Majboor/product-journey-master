import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Shield, Camera, Timer } from "lucide-react";

const ProductSection = () => {
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
    <section className="py-16 bg-accent">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Carousel Section */}
          <div className="flex-1">
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Product Details Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">Supreme Crash Cam</h2>
              <p className="text-xl font-semibold text-primary">$299.00</p>
              <p className="text-gray-600">
                Professional-grade dash cam with superior night vision and advanced
                safety features. Perfect for both personal and commercial use.
              </p>
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
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingCart className="mr-2" />
                Add to Cart - $299
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>✓ Free shipping</p>
              <p>✓ 30-day money-back guarantee</p>
              <p>✓ 2-year warranty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;