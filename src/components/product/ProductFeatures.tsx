interface ProductFeaturesProps {
  features?: string[];
}

export const ProductFeatures = ({ features = [] }: ProductFeaturesProps) => {
  if (!features.length) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Key Features</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-primary/60 rounded-full mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};