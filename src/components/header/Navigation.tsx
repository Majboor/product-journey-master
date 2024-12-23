import { Link } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
}

export const Navigation = ({ isAuthenticated }: NavigationProps) => {
  return (
    <nav className="hidden md:flex space-x-8">
      <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
        About Us
      </Link>
      <Link to="/features" className="text-gray-600 hover:text-primary transition-colors">
        Features
      </Link>
      <Link to="/why-us" className="text-gray-600 hover:text-primary transition-colors">
        Why Us
      </Link>
      <Link to="/reviews" className="text-gray-600 hover:text-primary transition-colors">
        Reviews
      </Link>
      <Link to="/order-tracking" className="text-gray-600 hover:text-primary transition-colors">
        Order Status
      </Link>
    </nav>
  );
};