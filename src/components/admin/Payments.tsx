import { ApiConfig } from "./payments/ApiConfig";
import { OrdersTable } from "./payments/OrdersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Payments = () => {
  // Fetch users from the public users view instead of admin API
  const { data: users, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data;
    }
  });

  if (usersError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load user data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <ApiConfig />
      <OrdersTable users={users} />
    </div>
  );
};