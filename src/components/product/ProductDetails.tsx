import { ProductDetails as ProductDetailsType } from "@/types/content";

export const ProductDetails = ({ description, specifications }: ProductDetailsType) => {
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
    </div>
  );
};