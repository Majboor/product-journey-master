import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';

export const useSwipeTracking = (pageSlug: string) => {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    // Track swipes
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > 50) {
        const direction = swipeDistance > 0 ? 'right' : 'left';
        
        try {
          await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction,
            event_type: 'swipe'
          });
          console.log(`Swipe ${direction} tracked on ${pageSlug}`);
        } catch (error) {
          console.error('Error tracking swipe:', error);
        }
      }
    };

    // Track scrolls (debounced to avoid too many events)
    const handleScroll = debounce(async () => {
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      try {
        await supabase.from('swipe_events').insert({
          page_slug: pageSlug,
          direction: scrollPosition > (window.lastScrollPosition || 0) ? 'down' : 'up',
          event_type: 'scroll',
          scroll_position: Math.round(scrollPercentage),
          additional_data: {
            pixelPosition: scrollPosition,
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
          }
        });
        window.lastScrollPosition = scrollPosition;
      } catch (error) {
        console.error('Error tracking scroll:', error);
      }
    }, 1000);

    // Track mouse movements (sampling to avoid too many events)
    let lastMouseTrackTime = 0;
    const handleMouseMove = async (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseTrackTime > 5000) { // Track every 5 seconds
        lastMouseTrackTime = now;
        try {
          await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction: e.movementX > 0 ? 'right' : 'left',
            event_type: 'mouse_movement',
            additional_data: {
              x: e.clientX,
              y: e.clientY,
              movementX: e.movementX,
              movementY: e.movementY
            }
          });
        } catch (error) {
          console.error('Error tracking mouse movement:', error);
        }
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      handleScroll.cancel(); // Cancel any pending debounced calls
    };
  }, [pageSlug]);
};