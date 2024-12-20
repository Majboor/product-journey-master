import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPaymentIntent } from "@/services/ziina";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProductActionsProps {
  price: number;
  title: string;
}

export const ProductActions = ({ price, title }: ProductActionsProps) => {
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: testMode } = useQuery({
    queryKey: ['ziina-test-mode'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ZIINA_TEST_MODE')
        .maybeSingle();
      
      if (error) throw error;
      return data?.value === 'true';
    },
  });

  const handleBuyNow = async () => {
    try {
      if (!price || price < 1) {
        toast({
          title: "Invalid Price",
          description: "Product price must be at least 1 USD",
          variant: "destructive",
        });
        return;
      }

      const orderId = `ORD-${Math.random().toString(36).substr(2, 9)}`;
      const amountInCents = Math.round(price * 100);
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          order_id: orderId,
          amount: amountInCents,
          currency_code: 'USD',
          customer_email: session?.user?.email,
          customer_name: session?.user?.user_metadata?.full_name,
        });

      if (orderError) throw orderError;

      const paymentIntent = await createPaymentIntent({
        amount: amountInCents,
        message: `Payment for ${title}`,
        successUrl: `${window.location.origin}/payment/success?order_id=${orderId}`,
        cancelUrl: `${window.location.origin}/payment/failed`,
        test: testMode ?? true
      });

      await supabase
        .from('orders')
        .update({ payment_intent_id: paymentIntent.id })
        .eq('order_id', orderId);

      window.location.href = paymentIntent.redirect_url;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format the price to ensure it's displayed with 2 decimal places
  const formattedPrice = price ? price.toFixed(2) : '0.00';

  return (
    <Button 
      size="lg" 
      className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={handleBuyNow}
    >
      Buy Now - ${formattedPrice}
    </Button>
  );
};