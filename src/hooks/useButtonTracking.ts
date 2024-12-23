import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const useButtonTracking = () => {
  const location = useLocation();
  // Format page slug to handle nested routes correctly, matching how page visits work
  const pageSlug = location.pathname.substring(1) || 'index';
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing button tracking for page:', pageSlug);

    const trackButtonClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Track any clickable elements (buttons, links, or elements with click handlers)
      const clickableElement = target.closest('button, a, [onclick], [role="button"]');
      
      if (clickableElement) {
        try {
          const elementName = clickableElement.getAttribute('data-button-name') || 
                            clickableElement.getAttribute('aria-label') || 
                            clickableElement.getAttribute('title') ||
                            clickableElement.textContent?.trim() || 
                            clickableElement.tagName.toLowerCase();

          console.log(`Tracking click on "${elementName}" on page:`, pageSlug);

          const { error } = await supabase.from('button_clicks').insert({
            page_slug: pageSlug,
            button_name: elementName,
            session_id: sessionId
          });
          
          if (error) {
            console.error('Error tracking click:', error);
          } else {
            console.log(`Click tracked successfully: ${elementName}`);
          }
        } catch (error) {
          console.error('Error tracking click:', error);
        }
      }
    };

    document.addEventListener('click', trackButtonClick);
    return () => document.removeEventListener('click', trackButtonClick);
  }, [pageSlug]); // Re-initialize when page changes
};