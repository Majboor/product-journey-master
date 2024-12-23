import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';

export const useSwipeTracking = () => {
  const location = useLocation();
  // Format page slug to match how page visits work
  const pageSlug = location.pathname.substring(1) || 'index';
  const lastScrollPosition = useRef(0);
  const sessionId = localStorage.getItem('session_id') || crypto.randomUUID();

  useEffect(() => {
    console.log('Initializing interaction tracking for page:', pageSlug);

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > 50) {
        const direction = swipeDistance > 0 ? 'right' : 'left';
        
        try {
          console.log(`Attempting to track swipe ${direction} on page:`, pageSlug);
          const { error } = await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction,
            event_type: 'swipe',
            session_id: sessionId
          });

          if (error) {
            console.error('Error inserting swipe event:', error);
          } else {
            console.log(`Swipe ${direction} tracked successfully on page:`, pageSlug);
          }
        } catch (error) {
          console.error('Error tracking swipe:', error);
        }
      }
    };

    const handleScroll = debounce(async () => {
      const currentPosition = window.scrollY;
      const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
      const scrollPercentage = (currentPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      try {
        console.log(`Attempting to track scroll ${direction} on page:`, pageSlug);
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
          console.error('Error inserting scroll event:', error);
        } else {
          console.log(`Scroll ${direction} tracked successfully on page:`, pageSlug);
          lastScrollPosition.current = currentPosition;
        }
      } catch (error) {
        console.error('Error tracking scroll:', error);
      }
    }, 1000);

    let lastMouseTrackTime = 0;
    const handleMouseMove = async (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseTrackTime > 5000) { // Track every 5 seconds
        lastMouseTrackTime = now;
        try {
          console.log('Attempting to track mouse movement on page:', pageSlug);
          const { error } = await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction: e.movementX > 0 ? 'right' : 'left',
            event_type: 'mouse_movement',
            session_id: sessionId,
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
            console.log('Mouse movement tracked successfully on page:', pageSlug);
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
  }, [pageSlug]); // Re-initialize tracking when page changes
};