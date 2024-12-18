import { Shield, Camera, Lock, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Stand Strong Against Insurance Fraud",
    description: "Protect yourself with irrefutable video evidence in case of accidents.",
  },
  {
    icon: Camera,
    title: "Crystal Clear Evidence",
    description: "1080p HD recording ensures every detail is captured perfectly.",
  },
  {
    icon: Lock,
    title: "Prevent Theft",
    description: "Motion detection automatically records any suspicious activity.",
  },
  {
    icon: AlertTriangle,
    title: "Avoid Tickets",
    description: "Stay aware of speed limits and traffic signals with audio alerts.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose Supreme Crash Cam?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;