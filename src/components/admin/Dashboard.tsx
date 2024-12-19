import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Analytics, LocationData } from "@/types/analytics";
import { Database } from "@/integrations/supabase/types";
import { StatsCards } from "./dashboard/StatsCards";
import { VisitsChart } from "./dashboard/VisitsChart";
import { LocationChart } from "./dashboard/LocationChart";
import { PageAnalytics } from "./dashboard/PageAnalytics";
import { RecentPages } from "./dashboard/RecentPages";
import { SignInAnalytics } from "./dashboard/SignInAnalytics";
import { ButtonClicksAnalytics } from "./dashboard/ButtonClicksAnalytics";
import { SwipeAnalytics } from "./dashboard/SwipeAnalytics";

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

  const { data: analytics } = useQuery({
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

  const { data: signInAttempts } = useQuery({
    queryKey: ['signin-attempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signin_attempts')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: buttonClicks } = useQuery({
    queryKey: ['button-clicks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('button_clicks')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: swipeEvents } = useQuery({
    queryKey: ['swipe-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('swipe_events')
        .select('*');
      if (error) throw error;
      return data;
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

  const signInData = signInAttempts?.reduce((acc: Record<string, number>, curr) => {
    acc[curr.page_slug] = (acc[curr.page_slug] || 0) + 1;
    return acc;
  }, {});

  const signInChartData = Object.entries(signInData || {}).map(([page, attempts]) => ({
    page,
    attempts
  }));

  const buttonClicksData = buttonClicks?.reduce((acc: Array<{ page: string; button: string; clicks: number }>, curr) => {
    const existingEntry = acc.find(entry => entry.page === curr.page_slug && entry.button === curr.button_name);
    if (existingEntry) {
      existingEntry.clicks += 1;
    } else {
      acc.push({ page: curr.page_slug, button: curr.button_name, clicks: 1 });
    }
    return acc;
  }, []) || [];

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

  const swipeData = Object.entries(
    (swipeEvents || []).reduce((acc: Record<string, { left: number; right: number }>, curr) => {
      if (!acc[curr.page_slug]) {
        acc[curr.page_slug] = { left: 0, right: 0 };
      }
      acc[curr.page_slug][curr.direction as 'left' | 'right'] += 1;
      return acc;
    }, {})
  ).map(([page, data]) => ({
    page,
    ...data,
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

      <div className="grid gap-4 md:grid-cols-2">
        <SignInAnalytics data={signInChartData || []} />
        <ButtonClicksAnalytics data={buttonClicksData} />
      </div>

      <SwipeAnalytics data={swipeData} />
      <PageAnalytics analytics={pageAnalytics} />
      <RecentPages pages={pages || []} />
    </div>
  );
};
