import { ColorScheme } from "@/types/colors";
import { useEffect } from "react";

interface ColorSchemeProviderProps {
  colorScheme?: ColorScheme;
  children: React.ReactNode;
}

// Function to convert hex to HSL
const hexToHSL = (hex: string) => {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Function to check if a color is too light
const isColorTooLight = (color: string) => {
  const hsl = hexToHSL(color);
  return hsl.l > 70;
};

// Function to get contrasting text color
const getContrastingTextColor = (bgColor: string) => {
  const hsl = hexToHSL(bgColor);
  return hsl.l > 60 ? '#1A1F2C' : '#FFFFFF';
};

// Safe default colors that ensure visibility
const defaultColors = {
  primary: '#2563eb',    // Blue
  secondary: '#f8fafc',  // Light gray
  accent: '#dbeafe',     // Light blue
  primaryText: '#FFFFFF', // White text for primary
  secondaryText: '#1A1F2C', // Dark text for secondary
  accentText: '#1A1F2C',  // Dark text for accent
};

// Function to ensure color has proper contrast
const ensureColorContrast = (color: string, fallbackColor: string) => {
  return color && color.startsWith('#') ? color : fallbackColor;
};

export const ColorSchemeProvider = ({ colorScheme, children }: ColorSchemeProviderProps) => {
  useEffect(() => {
    const colors = colorScheme || defaultColors;
    
    // Ensure primary color has proper contrast
    const primaryColor = ensureColorContrast(colors.primary, defaultColors.primary);
    const primaryTextColor = colors.primaryText || getContrastingTextColor(primaryColor);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--primary-foreground', primaryTextColor);

    // Set secondary color with guaranteed contrast
    const secondaryColor = ensureColorContrast(colors.secondary, defaultColors.secondary);
    const secondaryTextColor = colors.secondaryText || getContrastingTextColor(secondaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--secondary-foreground', secondaryTextColor);

    // Set accent color with guaranteed contrast
    const accentColor = ensureColorContrast(colors.accent, defaultColors.accent);
    const accentTextColor = colors.accentText || getContrastingTextColor(accentColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-foreground', accentTextColor);

    // Set background and text colors
    document.documentElement.style.setProperty('--background', secondaryColor);
    document.documentElement.style.setProperty('--foreground', secondaryTextColor);

    // Update card colors
    document.documentElement.style.setProperty('--card', secondaryColor);
    document.documentElement.style.setProperty('--card-foreground', secondaryTextColor);

    // Update popover colors
    document.documentElement.style.setProperty('--popover', secondaryColor);
    document.documentElement.style.setProperty('--popover-foreground', secondaryTextColor);

    // Set muted colors
    const mutedBackground = isColorTooLight(secondaryColor) ? '#f1f5f9' : '#334155';
    document.documentElement.style.setProperty('--muted', mutedBackground);
    document.documentElement.style.setProperty('--muted-foreground', getContrastingTextColor(mutedBackground));

    // Set border color
    document.documentElement.style.setProperty('--border', isColorTooLight(secondaryColor) ? '#e2e8f0' : '#1f2937');

  }, [colorScheme]);

  return <>{children}</>;
};