import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';

export const useSwipeTracking = () => {
  const location = useLocation();
  const pageSlug = location.pathname.substring(1) || 'index';
  const lastScrollPosition = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing scroll and swipe tracking for page:', pageSlug);

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
      
      const minSwipeDistance = 50;
      
      try {
        if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
          if (Math.abs(swipeDistanceX) > minSwipeDistance) {
            const direction = swipeDistanceX > 0 ? 'right' : 'left';
            console.log(`Tracking horizontal swipe ${direction} on page:`, pageSlug);
            
            await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionId,
              additional_data: {
                distanceX: swipeDistanceX,
                distanceY: swipeDistanceY,
                startX: touchStartX,
                startY: touchStartY,
                endX: touchEndX,
                endY: touchEndY
              }
            });
          }
        } else {
          if (Math.abs(swipeDistanceY) > minSwipeDistance) {
            const direction = swipeDistanceY > 0 ? 'down' : 'up';
            console.log(`Tracking vertical swipe ${direction} on page:`, pageSlug);
            
            await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionId,
              additional_data: {
                distanceX: swipeDistanceX,
                distanceY: swipeDistanceY,
                startX: touchStartX,
                startY: touchStartY,
                endX: touchEndX,
                endY: touchEndY
              }
            });
          }
        }
      } catch (error) {
        console.error('Error tracking swipe:', error);
      }
    };

    const trackScroll = async () => {
      const currentPosition = window.scrollY;
      const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
      const scrollPercentage = (currentPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set new timeout
      scrollTimeout.current = setTimeout(async () => {
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
              documentHeight: document.documentElement.scrollHeight,
              timestamp: new Date().toISOString()
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
      }, 150); // Reduced timeout for more responsive tracking
    };

    // Add event listeners with capture phase
    document.addEventListener('touchstart', handleTouchStart, true);
    document.addEventListener('touchend', handleTouchEnd, true);
    document.addEventListener('scroll', trackScroll, true);

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart, true);
      document.removeEventListener('touchend', handleTouchEnd, true);
      document.removeEventListener('scroll', trackScroll, true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [pageSlug]); // Re-initialize tracking when page changes
};