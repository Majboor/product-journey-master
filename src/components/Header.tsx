import { useAuth } from "./auth/AuthProvider";
import { Navigation } from "./header/Navigation";
import { CartButton } from "./header/CartButton";
import { AuthButtons } from "./header/AuthButtons";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContent, validatePageContent } from "@/types/content";

interface HeaderProps {
  brandName?: string;
}

const Header = ({ brandName = "Supreme Crash Cams" }: HeaderProps) => {
  const { session } = useAuth();
  const location = useLocation();
  const path = location.pathname.slice(1);
  const [categorySlug, slug] = path.split('/');
  const finalSlug = slug ? `${categorySlug}/${slug}` : '';

  // List of routes where we don't want to show the brand name
  const hideLogoRoutes = ['about', 'features', 'why-us', 'reviews', 'general'];

  // Fetch page content for the current route
  const { data: page } = useQuery({
    queryKey: ['page', finalSlug],
    queryFn: async () => {
      if (!finalSlug) return null;
      
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', finalSlug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!finalSlug
  });

  // Safely cast and validate the content
  const content = page?.content as unknown;
  const isValidContent = validatePageContent(content);
  const displayBrandName = isValidContent ? (content as PageContent).brandName : brandName;

  useEffect(() => {
    // Show login dialog immediately for non-authenticated users on the main page
    if (!session && location.pathname === '/') {
      document.querySelector<HTMLButtonElement>('[data-trigger="login-dialog"]')?.click();
    }
  }, [session, location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold text-primary relative">
            {!hideLogoRoutes.includes(path) && (
              <>
                {displayBrandName}
                <span className="absolute -top-1 -right-12 text-xs text-primary/60">™</span>
              </>
            )}
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