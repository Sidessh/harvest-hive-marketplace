
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-harvest-light py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 text-harvest-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <path d="M13 2H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
              <path d="M13 2v9h9" />
              <path d="M22 16h-5a2 2 0 0 0-2 2v-8" />
              <path d="M18 18v.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-harvest-dark">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! We can't find the page you're looking for.
          </p>
          <div className="space-y-4">
            <Button asChild className="bg-harvest-primary hover:bg-harvest-dark w-full">
              <Link to="/">
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-harvest-primary text-harvest-primary hover:bg-harvest-primary/10 w-full">
              <Link to="/shop">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
