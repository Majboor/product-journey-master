import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "No order ID found",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [orderId, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order ID is: {orderId}
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate(`/order-tracking/${orderId}`)}
              className="w-full"
            >
              Track Order
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;