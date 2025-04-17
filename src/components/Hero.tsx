
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-harvest-light pt-6 pb-16 md:py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#4CAF50" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left column - Text content */}
          <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-10 md:mb-0 order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-harvest-dark mb-4 leading-tight">
              Fresh from the <span className="text-harvest-primary">Farm</span> to Your Table
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Discover locally grown produce, dairy, and artisanal goods from farmers in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-harvest-primary hover:bg-harvest-dark text-white rounded-full">
                <Link to="/shop">
                  Shop Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-harvest-primary text-harvest-primary hover:bg-harvest-primary/10 rounded-full">
                <Link to="/farmers">
                  Meet Our Farmers
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative">
              <div className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl bg-harvest-primary/20"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80"
                  alt="Fresh farm produce"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md border border-harvest-primary/10">
            <div className="w-12 h-12 bg-harvest-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <svg className="w-6 h-6 text-harvest-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center md:text-left mb-2">Quality Assurance</h3>
            <p className="text-gray-600 text-center md:text-left">All products are verified fresh and meet our rigorous quality standards.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-harvest-primary/10">
            <div className="w-12 h-12 bg-harvest-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <svg className="w-6 h-6 text-harvest-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center md:text-left mb-2">Sustainable Practices</h3>
            <p className="text-gray-600 text-center md:text-left">Supporting farmers who prioritize sustainable and ethical farming methods.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-harvest-primary/10">
            <div className="w-12 h-12 bg-harvest-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <svg className="w-6 h-6 text-harvest-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center md:text-left mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-center md:text-left">Farm-fresh products delivered straight to your doorstep within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
