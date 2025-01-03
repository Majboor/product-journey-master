import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPaymentIntent } from "@/services/ziina";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface HeroProps {
  title: string;
  description: string;
  image: string;
  price: number;
}

const Hero = ({ title, description, image, price }: HeroProps) => {
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
      if (price < 1) {
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

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleBuyNow}
              >
                Buy Now - ${price}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary/20 hover:border-primary/40 px-8 py-6 text-lg rounded-full"
                onClick={() => {
                  console.log('Learn more clicked');
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent rounded-2xl transform rotate-3"></div>
              <img
                src={image}
                alt="Hero"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;