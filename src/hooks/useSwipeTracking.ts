import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSwipeTracking = (pageSlug: string) => {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
        const direction = swipeDistance > 0 ? 'right' : 'left';
        
        try {
          await supabase.from('swipe_events').insert({
            page_slug: pageSlug,
            direction,
          });
          console.log(`Swipe ${direction} tracked on ${pageSlug}`);
        } catch (error) {
          console.error('Error tracking swipe:', error);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pageSlug]);
};