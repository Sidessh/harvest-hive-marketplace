
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Award, ArrowRight } from "lucide-react";

interface Farmer {
  id: number;
  name: string;
  location: string;
  image: string;
  bio: string;
  specialty: string;
  yearsActive: number;
}

const featuredFarmer: Farmer = {
  id: 101,
  name: "Green Valley Farm",
  location: "San Francisco, CA",
  image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  bio: "Green Valley Farm has been family-owned for three generations. We specialize in heirloom vegetables grown using traditional organic methods that preserve the soil and environment.",
  specialty: "Organic Heirloom Vegetables",
  yearsActive: 35
};

const FarmerSpotlight = () => {
  return (
    <section className="py-12 bg-white border-t border-b border-harvest-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10 mt-8 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-harvest-dark mb-2">
              Farmer Spotlight
            </h2>
            <div className="flex items-center mb-6">
              <Award size={20} className="text-harvest-primary mr-2" />
              <span className="text-gray-600 italic">Featured Producer</span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              {featuredFarmer.name}
            </h3>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{featuredFarmer.location}</span>
              <span className="mx-2">•</span>
              <span>{featuredFarmer.yearsActive} years of farming</span>
            </div>
            <p className="text-gray-600 mb-4">
              {featuredFarmer.bio}
            </p>
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Specialty</div>
              <div className="text-harvest-primary font-medium">{featuredFarmer.specialty}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-harvest-primary hover:bg-harvest-dark">
                <Link to={`/farmer/${featuredFarmer.id}`}>
                  Visit Farm Store
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white">
                <Link to="/farmers">
                  Meet More Farmers
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -left-4 -bottom-4 w-full h-full rounded-2xl bg-harvest-secondary/20"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={featuredFarmer.image}
                  alt={featuredFarmer.name}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmerSpotlight;
