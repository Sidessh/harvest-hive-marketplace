
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-harvest-light border-t border-harvest-primary/20">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-harvest-dark">
              <span className="text-harvest-primary">Harvest</span>Hive
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Connecting local farmers with consumers for fresher, healthier food
              and stronger communities.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-harvest-primary/10 hover:bg-harvest-primary/20">
                <Facebook size={16} className="text-harvest-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-harvest-primary/10 hover:bg-harvest-primary/20">
                <Instagram size={16} className="text-harvest-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-harvest-primary/10 hover:bg-harvest-primary/20">
                <Twitter size={16} className="text-harvest-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-harvest-primary/10 hover:bg-harvest-primary/20">
                <Youtube size={16} className="text-harvest-primary" />
              </Button>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-harvest-dark">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-harvest-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-harvest-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-harvest-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-harvest-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-harvest-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-600 hover:text-harvest-primary">
                  Sell on HarvestHive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-harvest-dark">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-harvest-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">
                  123 Farm Lane, Fresh Fields, CA 94103, USA
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-harvest-primary flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-harvest-primary flex-shrink-0" />
                <span className="text-gray-600">support@harvesthive.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-harvest-dark">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to receive updates on new products and special promotions.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white border-harvest-primary/30 focus-visible:ring-harvest-primary"
              />
              <Button className="bg-harvest-primary hover:bg-harvest-dark w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-harvest-primary/10 mt-8 pt-4 text-center text-xs text-gray-500">
          <p>© 2025 HarvestHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
