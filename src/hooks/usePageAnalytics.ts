import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePageAnalytics = (pageSlug: string) => {
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();

        await supabase.from('analytics').insert({
          page_slug: pageSlug,
          ip_address: ip,
          user_agent: navigator.userAgent,
          location: locationData,
          session_id: crypto.randomUUID()
        });
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    };

    trackPageVisit();
  }, [pageSlug]);
};