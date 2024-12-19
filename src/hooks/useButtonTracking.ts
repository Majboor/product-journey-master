import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const useButtonTracking = () => {
  const location = useLocation();
  const pageSlug = location.pathname.replace('/', '') || 'index';

  useEffect(() => {
    const trackButtonClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        try {
          const buttonName = button.getAttribute('data-button-name') || 
                            button.getAttribute('aria-label') || 
                            button.textContent?.trim() || 
                            'unnamed-button';

          await supabase.from('button_clicks').insert({
            page_slug: pageSlug,
            button_name: buttonName,
            session_id: crypto.randomUUID()
          });
          
          console.log(`Button click tracked: ${buttonName} on ${pageSlug}`);
        } catch (error) {
          console.error('Error tracking button click:', error);
        }
      }
    };

    document.addEventListener('click', trackButtonClick);
    return () => document.removeEventListener('click', trackButtonClick);
  }, [pageSlug]);
};