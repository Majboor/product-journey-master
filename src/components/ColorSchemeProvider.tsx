import { ColorScheme } from "@/types/colors";
import { useEffect } from "react";

interface ColorSchemeProviderProps {
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

export const ColorSchemeProvider = ({ colorScheme, children }: ColorSchemeProviderProps) => {
  useEffect(() => {
    if (colorScheme) {
      document.documentElement.style.setProperty('--primary-color', colorScheme.primary);
      document.documentElement.style.setProperty('--secondary-color', colorScheme.secondary);
      document.documentElement.style.setProperty('--accent-color', colorScheme.accent);
      
      // Set contrasting foreground colors
      document.documentElement.style.setProperty('--primary-foreground', '#FFFFFF');
      document.documentElement.style.setProperty('--secondary-foreground', '#1e40af');
      document.documentElement.style.setProperty('--accent-foreground', '#1e40af');
    }
  }, [colorScheme]);

  return <>{children}</>;
};