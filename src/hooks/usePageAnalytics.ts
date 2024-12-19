import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const usePageAnalytics = (pageSlug: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();

        const { error } = await supabase.from('analytics').insert({
          page_slug: pageSlug,
          ip_address: ip,
          user_agent: navigator.userAgent,
          location: locationData,
          session_id: crypto.randomUUID()
        });

        if (error) {
          console.error('Error tracking page visit:', error);
          toast({
            title: "Analytics Error",
            description: "Failed to track page visit",
            variant: "destructive",
          });
        } else {
          console.log('Page visit tracked:', pageSlug);
        }
      } catch (error) {
        console.error('Error tracking page visit:', error);
        toast({
          title: "Analytics Error",
          description: "Failed to track page visit",
          variant: "destructive",
        });
      }
    };

    if (pageSlug) {
      trackPageVisit();
    }
  }, [pageSlug]);
};