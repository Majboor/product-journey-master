import { Shield, Camera, Lock, AlertTriangle } from "lucide-react";
import { Feature } from "@/types/content";

interface FeaturesProps {
  features: Feature[];
}

const Features = ({ features }: FeaturesProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return Shield;
      case "Camera":
        return Camera;
      case "Lock":
        return Lock;
      case "AlertTriangle":
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon);
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <IconComponent className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;