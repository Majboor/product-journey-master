import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const useButtonTracking = () => {
  const location = useLocation();
  // Format page slug to handle nested routes correctly, matching how page visits work
  const pageSlug = location.pathname.substring(1) || 'index';

  useEffect(() => {
    console.log('Initializing button tracking for page:', pageSlug); // Debug log

    const trackButtonClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      
      if (button) {
        try {
          const buttonName = button.getAttribute('data-button-name') || 
                            button.getAttribute('aria-label') || 
                            button.textContent?.trim() || 
                            'unnamed-button';

          console.log(`Attempting to track button click: ${buttonName} on page:`, pageSlug);

          const { error } = await supabase.from('button_clicks').insert({
            page_slug: pageSlug,
            button_name: buttonName,
            session_id: localStorage.getItem('session_id') || crypto.randomUUID()
          });
          
          if (error) {
            console.error('Error tracking button click:', error);
          } else {
            console.log(`Button click tracked successfully: ${buttonName} on ${pageSlug}`);
          }
        } catch (error) {
          console.error('Error tracking button click:', error);
        }
      }
    };

    document.addEventListener('click', trackButtonClick);
    return () => document.removeEventListener('click', trackButtonClick);
  }, [pageSlug]); // Re-initialize when page changes
};