import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Payments = () => {
  const [apiKey, setApiKey] = useState("");
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: ziinaKey } = useQuery({
    queryKey: ['ziina-key'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ZIINA_API_KEY')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const updateApiKey = async () => {
    try {
      const { error } = await supabase
        .from('secrets')
        .upsert({ 
          name: 'ZIINA_API_KEY',
          value: apiKey 
        });

      if (error) throw error;

      toast.success("Ziina API key updated successfully");
      setApiKey("");
    } catch (error) {
      toast.error("Failed to update Ziina API key");
    }
  };

  const totalAmount = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
  const formattedTotal = (totalAmount / 100).toFixed(2); // Convert fils to AED

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ziina API Configuration</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={ziinaKey?.value ? "••••••••" : "Enter Ziina API key"}
            />
          </div>
          <Button onClick={updateApiKey} disabled={!apiKey}>
            Update API Key
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Orders</h2>
          <div className="text-lg font-semibold">
            Total Revenue: {formattedTotal} AED
          </div>
        </div>

        {isLoading ? (
          <div>Loading orders...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount (AED)</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Shipping Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{(order.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>{order.customer_name || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.payment_status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : order.payment_status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      order.shipping_status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.shipping_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};