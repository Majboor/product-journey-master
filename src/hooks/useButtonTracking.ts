import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useButtonTracking = () => {
  const location = useLocation();
  const pageSlug = location.pathname.substring(1) || 'index';
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing click tracking for page:', pageSlug);

    const trackClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (!button) return; // Only track button clicks
      
      try {
        // Get button details
        const buttonName = button.getAttribute('data-button-name') || 
                          button.getAttribute('aria-label') || 
                          button.getAttribute('title') ||
                          button.textContent?.trim() || 
                          'unnamed-button';

        console.log(`Tracking click on "${buttonName}" on page:`, pageSlug);

        const { error } = await supabase.from('button_clicks').insert({
          page_slug: pageSlug,
          button_name: buttonName,
          session_id: sessionId
        });
        
        if (error) {
          console.error('Error tracking click:', error);
          toast({
            title: "Error tracking click",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log(`Click tracked successfully: ${buttonName}`);
        }
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };

    document.addEventListener('click', trackClick, true);
    return () => document.removeEventListener('click', trackClick, true);
  }, [pageSlug]); // Re-initialize when page changes
};