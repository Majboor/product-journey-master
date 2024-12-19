import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Analytics } from "@/types/analytics";

export const Dashboard = () => {
  const { data: pages } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return users;
    }
  });

  const { data: analytics } = useQuery<Analytics[]>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Process analytics data for visualization
  const pageVisits = analytics?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.page_slug] = (acc[curr.page_slug] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(pageVisits || {}).map(([page, visits]) => ({
    page,
    visits
  }));

  const locations = analytics?.reduce((acc: Record<string, number>, curr) => {
    const country = curr.location?.country_name || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const locationData = Object.entries(locations || {}).map(([country, visits]) => ({
    country,
    visits
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  visits: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="visits" fill="var(--color-visits)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visits by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  visits: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="visits" fill="var(--color-visits)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pages?.slice(0, 5).map((page) => (
              <div key={page.id} className="flex items-center justify-between">
                <span>{page.slug}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(page.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};