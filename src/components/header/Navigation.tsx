import { Link } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
}

export const Navigation = ({ isAuthenticated }: NavigationProps) => {
  return (
    <nav className="hidden md:flex space-x-8">
      <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
      <a href="#why-us" className="text-gray-600 hover:text-primary transition-colors">Why Us</a>
      <a href="#reviews" className="text-gray-600 hover:text-primary transition-colors">Reviews</a>
      {isAuthenticated && (
        <Link to="/api-manager" className="text-gray-600 hover:text-primary transition-colors">
          API Manager
        </Link>
      )}
    </nav>
  );
};