import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';

export const useSwipeTracking = () => {
  const location = useLocation();
  // Format page slug to match how page visits work - handle nested routes
  const pageSlug = location.pathname.substring(1) || 'index';
  const lastScrollPosition = useRef(0);
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing interaction tracking for page:', pageSlug);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;
      
      // Determine if it's a horizontal or vertical swipe
      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (Math.abs(swipeDistanceX) > 50) { // Horizontal swipe
          const direction = swipeDistanceX > 0 ? 'right' : 'left';
          try {
            console.log(`Tracking swipe ${direction} on page:`, pageSlug);
            const { error } = await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionId
            });

            if (error) {
              console.error('Error tracking swipe:', error);
            } else {
              console.log(`Swipe ${direction} tracked successfully`);
            }
          } catch (error) {
            console.error('Error tracking swipe:', error);
          }
        }
      } else {
        if (Math.abs(swipeDistanceY) > 50) { // Vertical swipe
          const direction = swipeDistanceY > 0 ? 'down' : 'up';
          try {
            console.log(`Tracking vertical swipe ${direction} on page:`, pageSlug);
            const { error } = await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionId
            });

            if (error) {
              console.error('Error tracking vertical swipe:', error);
            } else {
              console.log(`Vertical swipe ${direction} tracked successfully`);
            }
          } catch (error) {
            console.error('Error tracking vertical swipe:', error);
          }
        }
      }
    };

    const handleScroll = debounce(async () => {
      const currentPosition = window.scrollY;
      const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
      const scrollPercentage = (currentPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      try {
        console.log(`Tracking scroll ${direction} on page:`, pageSlug);
        const { error } = await supabase.from('swipe_events').insert({
          page_slug: pageSlug,
          direction,
          event_type: 'scroll',
          scroll_position: Math.round(scrollPercentage),
          session_id: sessionId,
          additional_data: {
            pixelPosition: currentPosition,
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
          }
        });

        if (error) {
          console.error('Error tracking scroll:', error);
        } else {
          console.log(`Scroll ${direction} tracked successfully`);
          lastScrollPosition.current = currentPosition;
        }
      } catch (error) {
        console.error('Error tracking scroll:', error);
      }
    }, 500); // Reduced debounce time for more responsive tracking

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel any pending debounced calls
    };
  }, [pageSlug]); // Re-initialize tracking when page changes
};