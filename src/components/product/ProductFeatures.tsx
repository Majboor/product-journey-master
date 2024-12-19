import { Camera, Shield, Timer } from 'lucide-react';

const features = [
  { icon: Camera, text: "1080p HD Quality" },
  { icon: Shield, text: "Motion Detection" },
  { icon: Timer, text: "Loop Recording" },
];

export const ProductFeatures = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">Key Features</h3>
      <div className="grid gap-4">
        {features.map((Feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Feature.icon className="w-5 h-5 text-primary" />
            <span className="text-gray-600">{Feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};