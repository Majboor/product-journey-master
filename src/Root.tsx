import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

export const Root = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Outlet />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};