import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Payment Failed</h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;