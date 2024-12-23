import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ORDER_STATUSES = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

interface OrderStatusSelectProps {
  orderId: string;
  initialStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export const OrderStatusSelect = ({
  orderId,
  initialStatus,
  onStatusChange,
}: OrderStatusSelectProps) => {
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          shipping_status: newStatus,
          shipping_updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (error) throw error;

      setStatus(newStatus);
      onStatusChange(newStatus);
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};