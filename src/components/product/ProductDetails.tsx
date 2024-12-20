import { ProductDetails as ProductDetailsType } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const ProductDetails = ({ title, description, specifications }: ProductDetailsType) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specifications.map((spec, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="justify-start py-2 px-3 text-sm font-medium"
            >
              <Check className="mr-2 h-4 w-4 text-primary" />
              {spec}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};