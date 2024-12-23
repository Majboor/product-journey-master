import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';

export const useSwipeTracking = () => {
  const location = useLocation();
  // Remove leading slash and handle empty path as 'index'
  const pageSlug = location.pathname.replace(/^\//, '') || 'index';
  const lastScrollPosition = useRef(0);

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
          const { error } = await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction,
            event_type: 'swipe'
          });

          if (error) {
            console.error('Error inserting swipe event:', error);
          } else {
            console.log(`Swipe ${direction} tracked on page: ${pageSlug}`);
          }
        } catch (error) {
          console.error('Error tracking swipe:', error);
        }
      }
    };

    // Track scrolls (debounced to avoid too many events)
    const handleScroll = debounce(async () => {
      const currentPosition = window.scrollY;
      const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
      const scrollPercentage = (currentPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      try {
        const { error } = await supabase.from('swipe_events').insert({
          page_slug: pageSlug,
          direction,
          event_type: 'scroll',
          scroll_position: Math.round(scrollPercentage),
          additional_data: {
            pixelPosition: currentPosition,
            viewportHeight: window.innerHeight,
            documentHeight: document.documentElement.scrollHeight
          }
        });

        if (error) {
          console.error('Error inserting scroll event:', error);
        } else {
          console.log(`Scroll ${direction} tracked on page: ${pageSlug}`);
          lastScrollPosition.current = currentPosition;
        }
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
          const { error } = await supabase.from('swipe_events').insert({
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

          if (error) {
            console.error('Error inserting mouse movement:', error);
          } else {
            console.log(`Mouse movement tracked on page: ${pageSlug}`);
          }
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
  }, [pageSlug]); // Re-run effect when page changes
};