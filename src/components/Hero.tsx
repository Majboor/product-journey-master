import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  description: string;
  image: string;
  price: number;
}

const Hero = ({ title, description, image, price }: HeroProps) => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  console.log('Buy now clicked');
                }}
              >
                Buy Now - ${price}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary/20 hover:border-primary/40 px-8 py-6 text-lg rounded-full"
                onClick={() => {
                  console.log('Learn more clicked');
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent rounded-2xl transform rotate-3"></div>
              <img
                src={image}
                alt="Hero"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;