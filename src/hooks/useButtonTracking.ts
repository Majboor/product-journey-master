import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const useButtonTracking = () => {
  const location = useLocation();
  const pageSlug = location.pathname.substring(1) || 'index';
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing click tracking for page:', pageSlug);

    const trackClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      try {
        // Get element details
        const elementName = target.getAttribute('data-button-name') || 
                          target.getAttribute('aria-label') || 
                          target.getAttribute('title') ||
                          target.textContent?.trim() || 
                          target.tagName.toLowerCase();

        const elementType = target.tagName.toLowerCase();
        const elementClasses = Array.from(target.classList).join(' ');
        
        console.log(`Tracking click on "${elementName}" (${elementType}) on page:`, pageSlug);

        const { error } = await supabase.from('button_clicks').insert({
          page_slug: pageSlug,
          button_name: elementName,
          session_id: sessionId,
          additional_data: {
            elementType,
            elementClasses,
            x: e.clientX,
            y: e.clientY,
            timestamp: new Date().toISOString()
          }
        });
        
        if (error) {
          console.error('Error tracking click:', error);
        } else {
          console.log(`Click tracked successfully: ${elementName}`);
        }
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };

    document.addEventListener('click', trackClick, true);
    return () => document.removeEventListener('click', trackClick, true);
  }, [pageSlug]); // Re-initialize when page changes
};