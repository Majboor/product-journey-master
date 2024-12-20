import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Truck, Package, Clock, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchOrderId, setSearchOrderId] = useState("");

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Order not found');
      return data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      navigate(`/order-tracking/${searchOrderId.trim()}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading order details...</div>;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load order details'}
          </AlertDescription>
        </Alert>
      );
    }

    const steps = [
      {
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        icon: CheckCircle,
        status: 'completed',
      },
      {
        title: 'Processing',
        description: 'Your order is being processed',
        icon: Package,
        status: order.shipping_status === 'processing' ? 'current' : 
               order.shipping_status === 'shipped' || order.shipping_status === 'out_for_delivery' || order.shipping_status === 'delivered' ? 'completed' : 'upcoming',
      },
      {
        title: 'Shipped',
        description: 'Your order has been shipped',
        icon: Truck,
        status: order.shipping_status === 'shipped' ? 'current' :
               order.shipping_status === 'out_for_delivery' || order.shipping_status === 'delivered' ? 'completed' : 'upcoming',
      },
      {
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        icon: Clock,
        status: order.shipping_status === 'out_for_delivery' ? 'current' :
               order.shipping_status === 'delivered' ? 'completed' : 'upcoming',
      },
    ];

    return (
      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative">
              {index !== steps.length - 1 && (
                <div
                  className={`absolute left-6 top-14 w-0.5 h-12 ${
                    step.status === 'completed' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-full p-3 ${
                    step.status === 'completed'
                      ? 'bg-primary text-white'
                      : step.status === 'current'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Order ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </form>
        </div>
        <h1 className="text-2xl font-bold mb-8">Order Status</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderTracking;