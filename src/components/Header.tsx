import { ShoppingCart, Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [cartTimer, setCartTimer] = useState(600); // 10 minutes in seconds
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCartTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary relative">
            Supreme Crash Cams
            <span className="absolute -top-1 -right-12 text-xs text-primary/60">™</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#why-us" className="text-gray-600 hover:text-primary transition-colors">Why Us</a>
            <a href="#reviews" className="text-gray-600 hover:text-primary transition-colors">Reviews</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="default" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In / Register
                </Button>
              </Link>
            )}
            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartTimer > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] text-gray-500/80">
                    <Clock className="h-3 w-3 inline-block mr-0.5" />
                    {formatTime(cartTimer)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;