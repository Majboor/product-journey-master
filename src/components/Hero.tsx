import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Safety on Every Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional-grade dash cam with 1080p HD quality and 170° wide-angle view.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Buy Now - $299
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
              alt="Supreme Crash Cam"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;