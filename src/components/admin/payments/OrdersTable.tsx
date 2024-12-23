import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { OrderStatusSelect } from "./OrderStatusSelect";

type User = Database['public']['Views']['users']['Row'];

interface OrdersTableProps {
  users?: User[];
}

export const OrdersTable = ({ users }: OrdersTableProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: currencies, error: currencyError } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true)
        .order('code');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: orders, error: orderError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    toast({
      title: "Currency Updated",
      description: `Payment currency changed to ${newCurrency}`,
    });
  };

  const handleStatusChange = () => {
    refetch();
  };

  if (orderError || currencyError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const formatAmount = (amount: number, fromCurrency: string) => {
    const value = amount / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency
    }).format(value);
  };

  const filteredOrders = orders?.filter(order => 
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies?.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.name} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Shipping Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{order.customer_email || 'N/A'}</TableCell>
                <TableCell>{formatAmount(order.amount, order.currency_code)}</TableCell>
                <TableCell>{order.payment_status}</TableCell>
                <TableCell>
                  <OrderStatusSelect
                    orderId={order.order_id}
                    initialStatus={order.shipping_status}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};