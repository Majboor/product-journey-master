import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

export const CartButton = () => {
  const [cartTimer, setCartTimer] = useState(600);
  const location = useLocation();

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

  const trackButtonClick = async () => {
    try {
      await supabase.from('button_clicks').insert({
        page_slug: location.pathname,
        button_name: 'cart'
      });
    } catch (error) {
      console.error('Error tracking button click:', error);
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="icon" 
        className="relative"
        onClick={trackButtonClick}
      >
        <ShoppingCart className="h-5 w-5" />
        {cartTimer > 0 && (
          <span className="absolute -top-2 -right-2 text-[10px] text-gray-500/80">
            <Clock className="h-3 w-3 inline-block mr-0.5" />
            {formatTime(cartTimer)}
          </span>
        )}
      </Button>
    </div>
  );
};