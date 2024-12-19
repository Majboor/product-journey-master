import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePageAnalytics = (pageSlug: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      if (!pageSlug) {
        console.error('No page slug provided for analytics tracking');
        return;
      }

      try {
        // First try to get IP
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch IP address');
        }
        const { ip } = await response.json();
        
        // Then get location data
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location data');
        }
        const locationData = await locationResponse.json();

        // Insert analytics data
        const { error: insertError } = await supabase.from('analytics').insert({
          page_slug: pageSlug,
          ip_address: ip,
          user_agent: navigator.userAgent,
          location: locationData,
          session_id: crypto.randomUUID()
        });

        if (insertError) {
          console.error('Error inserting analytics:', insertError);
          toast({
            title: "Analytics Error",
            description: `Failed to track page visit: ${insertError.message}`,
            variant: "destructive",
          });
        } else {
          console.log('Page visit tracked successfully:', pageSlug);
        }
      } catch (error) {
        console.error('Error in analytics tracking:', error);
        toast({
          title: "Analytics Error",
          description: error instanceof Error ? error.message : "Failed to track page visit",
          variant: "destructive",
        });
      }
    };

    if (pageSlug) {
      trackPageVisit();
    }
  }, [pageSlug]);
};