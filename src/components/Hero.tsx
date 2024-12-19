import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  description: string;
  image: string;
  price: number;
}

const Hero = ({ title, description, image, price }: HeroProps) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">{title}</h1>
            <p className="text-lg text-gray-600 mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  // Handle buy now click
                  console.log('Buy now clicked');
                }}
              >
                Buy Now - ${price}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  // Handle learn more click
                  console.log('Learn more clicked');
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src={image}
              alt="Hero"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;