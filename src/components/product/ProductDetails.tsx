import { ProductDetails as ProductDetailsType } from "@/types/content";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const ProductDetails = ({ description, specifications, buyNowLink }: ProductDetailsType) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-3">Specifications</h3>
        <ul className="space-y-2">
          {specifications.map((spec, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-primary/60 rounded-full mr-2" />
              {spec}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => window.location.href = buyNowLink}
          className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </div>
    </div>
  );
};