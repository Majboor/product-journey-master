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

type User = Database['public']['Views']['users']['Row'];

interface OrdersTableProps {
  users?: User[];
}

export const OrdersTable = ({ users }: OrdersTableProps) => {
  const { data: orders, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data;
    }
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load orders. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100; // Convert cents to dollars
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  return (
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
  );
};