import { ColorScheme } from "@/types/colors";
import { useEffect } from "react";

interface ColorSchemeProviderProps {
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

// Function to check if a color is too light
const isColorTooLight = (color: string) => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7; // If luminance is too high, color is too light
};

// Function to get contrasting color
const getContrastingColor = (color: string) => {
  return isColorTooLight(color) ? '#1A1F2C' : '#FFFFFF';
};

// Default colors with good contrast
const defaultColors = {
  primary: '#2563eb',    // Blue
  secondary: '#f8fafc',  // Light gray
  accent: '#dbeafe',     // Light blue
};

export const ColorSchemeProvider = ({ colorScheme, children }: ColorSchemeProviderProps) => {
  useEffect(() => {
    const colors = colorScheme || defaultColors;
    
    // Set primary color with contrast check
    const primaryColor = colors.primary;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty(
      '--primary-foreground',
      getContrastingColor(primaryColor)
    );

    // Set secondary color with contrast check
    const secondaryColor = colors.secondary;
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty(
      '--secondary-foreground',
      getContrastingColor(secondaryColor)
    );

    // Set accent color with contrast check
    const accentColor = colors.accent;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty(
      '--accent-foreground',
      getContrastingColor(accentColor)
    );

    // Set background and text colors with guaranteed contrast
    document.documentElement.style.setProperty('--background', secondaryColor);
    document.documentElement.style.setProperty(
      '--foreground',
      isColorTooLight(secondaryColor) ? '#1A1F2C' : '#FFFFFF'
    );

    // Update other theme colors for consistency
    document.documentElement.style.setProperty('--card', secondaryColor);
    document.documentElement.style.setProperty(
      '--card-foreground',
      getContrastingColor(secondaryColor)
    );

    document.documentElement.style.setProperty('--popover', secondaryColor);
    document.documentElement.style.setProperty(
      '--popover-foreground',
      getContrastingColor(secondaryColor)
    );

    // Set muted colors
    const mutedBackground = isColorTooLight(secondaryColor) 
      ? '#f1f5f9'  // Light gray
      : '#334155'; // Dark gray
    document.documentElement.style.setProperty('--muted', mutedBackground);
    document.documentElement.style.setProperty(
      '--muted-foreground',
      getContrastingColor(mutedBackground)
    );
  }, [colorScheme]);

  return <>{children}</>;
};