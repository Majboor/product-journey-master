import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserView = Database['public']['Views']['users']['Row'];

export const Users = () => {
  const { toast } = useToast();
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as UserView[];
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <a 
          href="https://supabase.com/dashboard/project/tylpifixgpoxonedjyzo/auth/users" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          Manage in Supabase <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                {user.email}
              </CardTitle>
              <Button
                variant="destructive"
                size="icon"
                disabled
                title="User management is only available in Supabase dashboard"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Created: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};