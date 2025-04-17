
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Menu, 
  User, 
  Heart, 
  Bell, 
  Search,
  ChevronDown,
  X
} from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Meat & Eggs",
    "Honey & Preserves",
    "Herbs & Spices",
    "Specialty Items"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Will implement search functionality in a future update
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-harvest-primary text-white py-1 px-4">
        <div className="container mx-auto flex justify-center md:justify-between items-center">
          <p className="text-xs md:text-sm font-medium">
            Supporting local farmers since 2025
          </p>
          <div className="hidden md:flex space-x-4 text-xs">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/help" className="hover:underline">Help & FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="font-montserrat font-bold text-2xl text-harvest-dark">
              <span className="text-harvest-primary">Harvest</span>Hive
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-10">
            <form onSubmit={handleSearch} className="w-full flex">
              <Input
                type="text"
                placeholder="Search for fresh produce..."
                className="w-full rounded-r-none border-r-0 focus-visible:ring-harvest-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="rounded-l-none bg-harvest-primary hover:bg-harvest-dark"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/wishlist">
                    <Heart size={20} className="text-harvest-dark" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/notifications">
                    <Bell size={20} className="text-harvest-dark" />
                  </Link>
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" asChild>
              <Link to="/account">
                <User size={20} className="text-harvest-dark" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart size={20} className="text-harvest-dark" />
                <span className="absolute -top-1 -right-1 bg-harvest-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4">
                      <form onSubmit={handleSearch} className="flex">
                        <Input
                          type="text"
                          placeholder="Search products..."
                          className="rounded-r-none border-r-0"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button 
                          type="submit" 
                          className="rounded-l-none bg-harvest-primary hover:bg-harvest-dark"
                        >
                          <Search size={18} />
                        </Button>
                      </form>
                    </div>
                    <nav className="flex flex-col space-y-1">
                      <div className="font-medium text-lg px-2 py-3">Categories</div>
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/category/${category.toLowerCase().replace(/ & /g, '-')}`}
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          {category}
                        </Link>
                      ))}
                      <div className="border-t my-2 pt-2">
                        <Link
                          to="/wishlist"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          <Heart size={18} className="mr-2" /> Wishlist
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          <Bell size={18} className="mr-2" /> Notifications
                        </Link>
                        <Link
                          to="/account"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          <User size={18} className="mr-2" /> My Account
                        </Link>
                      </div>
                      <div className="border-t my-2 pt-2">
                        <Link
                          to="/about"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          About Us
                        </Link>
                        <Link
                          to="/contact"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          Contact
                        </Link>
                        <Link
                          to="/help"
                          className="flex items-center px-2 py-3 hover:bg-harvest-light rounded-md"
                        >
                          Help & FAQ
                        </Link>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Category Menu - Desktop */}
        {!isMobile && (
          <nav className="hidden md:flex items-center justify-center mt-3 space-x-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(/ & /g, '-')}`}
                className="text-sm font-medium hover:text-harvest-primary transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>
        )}

        {/* Search Bar - Mobile */}
        {isMobile && (
          <form onSubmit={handleSearch} className="flex mt-3">
            <Input
              type="text"
              placeholder="Search for fresh produce..."
              className="w-full rounded-r-none border-r-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-harvest-primary hover:bg-harvest-dark"
            >
              <Search size={18} />
            </Button>
          </form>
        )}
      </div>
    </header>
  );
};

export default Navbar;
