
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

const categories: Category[] = [
  {
    id: "vegetables",
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Farm-fresh vegetables harvested at peak ripeness"
  },
  {
    id: "fruits",
    name: "Fruits",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Sweet and juicy fruits grown with care"
  },
  {
    id: "dairy",
    name: "Dairy",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "Fresh milk, cheese and yogurt from happy cows"
  }
];

const CategoryBanner = () => {
  return (
    <section className="py-12 bg-harvest-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-harvest-dark mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide selection of farm-fresh products organized by category to find exactly what you're looking for.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="relative group overflow-hidden rounded-xl shadow-md">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm mb-4 opacity-90">{category.description}</p>
                <Button asChild className="bg-white text-harvest-dark hover:bg-harvest-primary hover:text-white w-fit">
                  <Link to={`/category/${category.id}`}>
                    Explore {category.name}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="border-harvest-primary text-harvest-primary hover:bg-harvest-primary hover:text-white">
            <Link to="/categories">
              View All Categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
