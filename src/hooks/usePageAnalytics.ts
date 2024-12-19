import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePageAnalytics = (pageSlug: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      // Convert undefined or null to empty string to match root page
      const normalizedSlug = pageSlug || '';

      try {
        // Initialize default values
        let ipAddress = null;
        let locationData = null;

        // Try to get IP, but continue if it fails
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          if (response.ok) {
            const { ip } = await response.json();
            ipAddress = ip;

            try {
              const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
              if (locationResponse.ok) {
                locationData = await locationResponse.json();
              }
            } catch (locationError) {
              console.warn('Could not fetch location data:', locationError);
            }
          }
        } catch (ipError) {
          console.warn('Could not fetch IP address:', ipError);
        }

        // Insert analytics data with whatever information we have
        const { error: insertError } = await supabase.from('analytics').insert({
          page_slug: normalizedSlug,
          ip_address: ipAddress,
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
          console.log('Page visit tracked successfully:', normalizedSlug);
        }
      } catch (error) {
        console.error('Error in analytics tracking:', error);
        if (error instanceof Error && error.message.includes('supabase')) {
          toast({
            title: "Analytics Error",
            description: "Failed to save page visit data",
            variant: "destructive",
          });
        }
      }
    };

    trackPageVisit();
  }, [pageSlug]);
};