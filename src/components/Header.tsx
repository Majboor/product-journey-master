import { useAuth } from "./auth/AuthProvider";
import { Navigation } from "./header/Navigation";
import { CartButton } from "./header/CartButton";
import { AuthButtons } from "./header/AuthButtons";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  brandName?: string;
}

const Header = ({ brandName = "Supreme Crash Cams" }: HeaderProps) => {
  const { session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show login dialog with discount offer after a delay
    if (!session && location.pathname === '/') {
      const timer = setTimeout(() => {
        document.querySelector<HTMLButtonElement>('[data-trigger="login-dialog"]')?.click();
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [session, location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary relative">
            {brandName}
            <span className="absolute -top-1 -right-12 text-xs text-primary/60">™</span>
          </div>
          
          <Navigation isAuthenticated={!!session} />
          
          <div className="flex items-center space-x-4">
            <AuthButtons session={session} />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;