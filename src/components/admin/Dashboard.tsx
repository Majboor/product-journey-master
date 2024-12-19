import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analytics, LocationData } from "@/types/analytics";
import { Database } from "@/integrations/supabase/types";
import { StatsCards } from "./dashboard/StatsCards";
import { VisitsChart } from "./dashboard/VisitsChart";
import { LocationChart } from "./dashboard/LocationChart";
import { PageAnalytics } from "./dashboard/PageAnalytics";
import { RecentPages } from "./dashboard/RecentPages";

type AnalyticsResponse = Database['public']['Tables']['analytics']['Row'];

const isLocationData = (value: unknown): value is LocationData => {
  if (typeof value !== 'object' || value === null) return false;
  
  const location = value as Record<string, unknown>;
  return (
    typeof location.country_name === 'string' &&
    typeof location.city === 'string' &&
    typeof location.region === 'string' &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number'
  );
};

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
      
      return data?.map(item => ({
        ...item,
        location: isLocationData(item.location) ? item.location : null
      })) as Analytics[];
    }
  });

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

  const visitsByPage = analytics?.reduce((acc: Record<string, any>, curr) => {
    if (!acc[curr.page_slug]) {
      acc[curr.page_slug] = {
        total: 0,
        uniqueUsers: new Set(),
      };
    }
    acc[curr.page_slug].total += 1;
    if (curr.session_id) {
      acc[curr.page_slug].uniqueUsers.add(curr.session_id);
    }
    return acc;
  }, {});

  const pageAnalytics = Object.entries(visitsByPage || {}).map(([page, data]: [string, any]) => ({
    page,
    totalVisits: data.total,
    uniqueVisitors: data.uniqueUsers.size,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <StatsCards 
        pagesCount={pages?.length || 0}
        usersCount={users?.length || 0}
        visitsCount={analytics?.length || 0}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <VisitsChart data={chartData} />
        <LocationChart data={locationData} />
      </div>

      <PageAnalytics analytics={pageAnalytics} />
      <RecentPages pages={pages || []} />
    </div>
  );
};