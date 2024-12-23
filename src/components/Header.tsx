import { useAuth } from "./auth/AuthProvider";
import { Navigation } from "./header/Navigation";
import { CartButton } from "./header/CartButton";
import { AuthButtons } from "./header/AuthButtons";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContent, validatePageContent } from "@/types/content";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  brandName?: string;
}

const Header = ({ brandName = "Supreme Crash Cams" }: HeaderProps) => {
  const { session } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const path = location.pathname.slice(1);
  const [categorySlug, slug] = path.split('/');
  const finalSlug = slug ? `${categorySlug}/${slug}` : categorySlug || '';

  // List of routes where we don't want to show the brand name
  const hideLogoRoutes = ['about', 'features', 'why-us', 'reviews', 'order-tracking'];

  // Fetch page content for the current route
  const { data: page, error } = useQuery({
    queryKey: ['page', finalSlug],
    queryFn: async () => {
      if (!finalSlug) {
        const { data, error } = await supabase
          .from('pages')
          .select('content')
          .eq('slug', '')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching root page:', error);
          toast({
            title: "Error",
            description: "Failed to load page content",
            variant: "destructive",
          });
          return null;
        }
        return data;
      }
      
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('slug', finalSlug)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching page:', error);
        toast({
          title: "Error",
          description: "Failed to load page content",
          variant: "destructive",
        });
        return null;
      }
      return data;
    },
    enabled: true // Always fetch, even for root page
  });

  // Safely cast and validate the content
  const content = page?.content as unknown;
  const validation = validatePageContent(content);
  
  // Only use content.brandName if validation passes and content exists
  const displayBrandName = validation.isValid && content ? (content as PageContent).brandName : brandName;

  useEffect(() => {
    // Show login dialog immediately for non-authenticated users on the main page
    if (!session && location.pathname === '/') {
      document.querySelector<HTMLButtonElement>('[data-trigger="login-dialog"]')?.click();
    }
  }, [session, location.pathname]);

  // Show validation errors in toast if any
  useEffect(() => {
    if (content && !validation.isValid) {
      validation.errors.forEach(error => {
        toast({
          title: "Content Validation Error",
          description: `${error.field}: ${error.message}`,
          variant: "destructive",
        });
      });
    }
  }, [content, toast]);

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