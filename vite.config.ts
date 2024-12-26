import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Allows IPv6 and IPv4
    port: 8080, // Default port
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(), // Enable only in development
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Ensure build output goes to 'dist'
    sourcemap: true, // Helps debug production errors
    emptyOutDir: true, // Clears 'dist' folder before building
  },
  define: {
    "process.env": process.env, // Ensures Cloudflare picks up environment variables
  },
  optimizeDeps: {
    include: ["react", "react-dom"], // Ensure these are pre-bundled
  },
}));
