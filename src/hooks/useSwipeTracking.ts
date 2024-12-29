import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSwipeTracking = () => {
  const { toast } = useToast();
  const location = useLocation();
  const pageSlug = location.pathname.substring(1) || 'index';
  const lastScrollPosition = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const isScrolling = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = localStorage.getItem('session_id') || crypto.randomUUID();
      localStorage.setItem('session_id', sessionIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) return;

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

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;
      
      if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (Math.abs(swipeDistanceX) > minSwipeDistance) {
          const direction = swipeDistanceX > 0 ? 'right' : 'left';
          console.log(`Tracking horizontal swipe ${direction} on page:`, pageSlug);
          
          const { error } = await supabase
            .from('swipe_events')
            .insert({
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
            toast({
              variant: "destructive",
              title: "Error tracking swipe event",
              description: error.message
            });
          }
        }
      } else {
        if (Math.abs(swipeDistanceY) > minSwipeDistance) {
          const direction = swipeDistanceY > 0 ? 'down' : 'up';
          console.log(`Tracking vertical swipe ${direction} on page:`, pageSlug);
          
          const { error } = await supabase
            .from('swipe_events')
            .insert({
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
            toast({
              variant: "destructive",
              title: "Error tracking swipe event",
              description: error.message
            });
          }
        }
      }
    };

    const handleScroll = () => {
      if (!sessionIdRef.current) return;

      const currentPosition = window.scrollY;
      isScrolling.current = true;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(async () => {
        if (!isScrolling.current || !sessionIdRef.current) return;

        const direction = currentPosition > lastScrollPosition.current ? 'down' : 'up';
        const distance = Math.abs(currentPosition - lastScrollPosition.current);

        if (distance > 50) {
          console.log(`Tracking scroll ${direction} on page:`, pageSlug);
          
          const { error } = await supabase
            .from('swipe_events')
            .insert({
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
            toast({
              variant: "destructive",
              title: "Error tracking scroll event",
              description: error.message
            });
          }
        }

        lastScrollPosition.current = currentPosition;
        isScrolling.current = false;
      }, 150);
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
  }, [pageSlug, toast]);
};