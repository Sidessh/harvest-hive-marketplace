
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  text: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    text: "I've been shopping at Harvest Hive for months now, and the quality of produce is consistently exceptional. The tomatoes actually taste like tomatoes! Plus, I love knowing exactly which farm my food comes from.",
    rating: 5,
    location: "Oakland, CA"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "As a chef, I need the freshest ingredients. Harvest Hive connects me directly with local farmers for the highest quality produce. The difference in taste is remarkable, and my customers can tell!",
    rating: 5,
    location: "San Francisco, CA"
  },
  {
    id: 3,
    name: "Emily Chen",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    text: "What I appreciate most is the transparency. I can see who grew my food and how it was produced. The seasonal recommendations have also introduced my family to new vegetables we now love!",
    rating: 4,
    location: "Palo Alto, CA"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-harvest-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-harvest-dark mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from the people who have made Harvest Hive part of their healthy lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-xl p-6 shadow-md border border-harvest-primary/10"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-harvest-dark">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
