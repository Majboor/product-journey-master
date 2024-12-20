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

type User = Database['public']['Views']['users']['Row'];

interface OrdersTableProps {
  users?: User[];
}

export const OrdersTable = ({ users }: OrdersTableProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

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

  const { data: orders, error: orderError } = useQuery({
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
    console.log('Currency changed to:', newCurrency);
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
    // For now, we'll just do a simple conversion
    // In a real app, you'd want to use real exchange rates
    const value = amount / 100; // Convert cents to base currency unit
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_id}</TableCell>
                <TableCell>{order.customer_email || 'N/A'}</TableCell>
                <TableCell>{formatAmount(order.amount, order.currency_code)}</TableCell>
                <TableCell>{order.payment_status}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};