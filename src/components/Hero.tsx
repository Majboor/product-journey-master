import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface HeroProps {
  title: string;
  description: string;
  image: string;
  price: number;
}

const Hero = ({ title, description, image, price }: HeroProps) => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
      {/* Subliminal Security Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E")`,
             backgroundSize: "48px",
             backgroundRepeat: "repeat"
           }} 
      />

      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-primary/80 text-sm mb-4">
              <Shield className="w-4 h-4" />
              <span>Trusted by 50,000+ Drivers</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Safety on Every Journey
              <span className="block text-lg md:text-xl text-primary/60 mt-2">
                Peace of mind starts here
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Professional-grade dash cam with 1080p HD quality and 170° wide-angle view.
              <span className="block text-sm text-primary/60 mt-2">
                Designed for those who value protection
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Buy Now - $299
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="group relative"
              >
                Learn More
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary/20 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 animate-fade-in relative">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
              alt="Supreme Crash Cam"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
