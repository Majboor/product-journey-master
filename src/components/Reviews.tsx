import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Perfect – peace of mind guaranteed! The video quality is exceptional.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Worth every penny. Installation was a breeze and it works flawlessly.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    name: "Emily Williams",
    rating: 5,
    comment: "Basic, useful, and practical. Exactly what I needed for my daily commute.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-20">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;