import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useSwipeTracking = () => {
  const location = useLocation();
  const pageSlug = location.pathname.substring(1) || 'index';
  const lastScrollPosition = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isScrolling = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  // Initialize session ID once at component mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = localStorage.getItem('session_id') || crypto.randomUUID();
      localStorage.setItem('session_id', sessionIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) return; // Don't track if session isn't initialized

    console.log('Initializing scroll and swipe tracking for page:', pageSlug);
    
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      if (!sessionIdRef.current) return;

      try {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const swipeDistanceX = touchEndX - touchStartX;
        const swipeDistanceY = touchEndY - touchStartY;
        
        // Determine if the swipe was primarily horizontal or vertical
        if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
          if (Math.abs(swipeDistanceX) > minSwipeDistance) {
            const direction = swipeDistanceX > 0 ? 'right' : 'left';
            console.log(`Tracking horizontal swipe ${direction} on page:`, pageSlug);
            
            const { error } = await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionIdRef.current,
              additional_data: {
                distance: Math.abs(swipeDistanceX),
                startX: touchStartX,
                startY: touchStartY,
                endX: touchEndX,
                endY: touchEndY
              }
            });

            if (error) {
              console.error('Error tracking swipe:', error);
            }
          }
        } else {
          if (Math.abs(swipeDistanceY) > minSwipeDistance) {
            const direction = swipeDistanceY > 0 ? 'down' : 'up';
            console.log(`Tracking vertical swipe ${direction} on page:`, pageSlug);
            
            const { error } = await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'swipe',
              session_id: sessionIdRef.current,
              additional_data: {
                distance: Math.abs(swipeDistanceY),
                startX: touchStartX,
                startY: touchStartY,
                endX: touchEndX,
                endY: touchEndY
              }
            });

            if (error) {
              console.error('Error tracking swipe:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error tracking swipe event:', error);
      }
    };

    const handleScroll = () => {
      if (!sessionIdRef.current) return;

      const currentPosition = window.scrollY;
      isScrolling.current = true;

      // Clear the timeout if it exists
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set a timeout to track the scroll event after scrolling stops
      scrollTimeout.current = setTimeout(async () => {
        if (!isScrolling.current || !sessionIdRef.current) return;

        const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
        const distance = Math.abs(currentPosition - lastScrollPosition.current);

        if (distance > 50) { // Only track significant scrolls
          console.log(`Tracking scroll ${direction} on page:`, pageSlug);
          
          try {
            const { error } = await supabase.from('swipe_events').insert({
              page_slug: pageSlug,
              direction,
              event_type: 'scroll',
              session_id: sessionIdRef.current,
              scroll_position: currentPosition,
              additional_data: {
                distance,
                previousPosition: lastScrollPosition.current
              }
            });

            if (error) {
              console.error('Error tracking scroll:', error);
            }
          } catch (error) {
            console.error('Error tracking scroll event:', error);
          }
        }

        lastScrollPosition.current = currentPosition;
        isScrolling.current = false;
      }, 150); // Wait for scrolling to stop
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [pageSlug, location]); // Removed sessionId from dependencies as we use ref now
};