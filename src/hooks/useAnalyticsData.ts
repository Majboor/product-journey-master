import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LocationData } from "@/types/analytics";

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

export const useAnalyticsData = () => {
  const { data: pages } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('pages').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data;
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
      }));
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

  return {
    pages,
    users,
    analytics,
    signInAttempts,
    buttonClicks,
    swipeEvents
  };
};