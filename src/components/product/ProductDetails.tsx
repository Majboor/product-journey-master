import { ShoppingCart, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const ProductDetails = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-primary">Supreme Crash Cam</h2>
          <span className="bg-secondary/80 text-primary text-xs font-semibold px-2 py-1 rounded-full">
            Limited Edition
          </span>
        </div>

        <div className="flex items-center gap-2 text-primary/80">
          <Award className="w-5 h-5" />
          <span className="text-sm font-medium">Top-Rated Dash Cam of 2024</span>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-primary">$299.00</p>
        </div>

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
  );
};