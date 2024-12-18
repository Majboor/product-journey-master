import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary">Supreme Crash Cams</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary">Features</a>
            <a href="#why-us" className="text-gray-600 hover:text-primary">Why Us</a>
            <a href="#reviews" className="text-gray-600 hover:text-primary">Reviews</a>
          </nav>
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;