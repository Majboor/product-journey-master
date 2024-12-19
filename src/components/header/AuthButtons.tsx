import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "../auth/LoginForm";

interface AuthButtonsProps {
  session: any;
}

export const AuthButtons = ({ session }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSignInClick = async () => {
    try {
      await supabase.from('signin_attempts').insert({
        page_slug: location.pathname,
        session_id: session?.user?.id || null
      });
    } catch (error) {
      console.error('Error tracking signin attempt:', error);
    }
    setShowLoginDialog(true);
  };

  const handleSignOut = async () => {
    try {
      await supabase.from('button_clicks').insert({
        page_slug: location.pathname,
        button_name: 'sign_out',
        session_id: session?.user?.id
      });
      
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (session) {
    return (
      <>
        <div className="text-sm text-primary">
          Welcome back! Enjoy 10% off all items
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </>
    );
  }

  return (
    <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={handleSignInClick}
          data-trigger="login-dialog"
        >
          <LogIn className="h-4 w-4" />
          Sign In / Register
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get 10% Off Today!</DialogTitle>
          <DialogDescription>
            Sign in or create an account to get an instant 10% discount on all items
          </DialogDescription>
        </DialogHeader>
        <LoginForm onClose={() => setShowLoginDialog(false)} />
      </DialogContent>
    </Dialog>
  );
};