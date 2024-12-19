import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const JokeDisplay = ({ userId }: { userId: string }) => {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNewJoke = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      // Save joke to database
      await supabase.from('jokes').insert([
        { joke_text: data.joke, user_id: userId }
      ]);

      setJoke(data.joke);
      toast({
        title: "New joke loaded!",
        description: "The joke has been saved to your collection.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch new joke. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadLatestJoke = async () => {
      const { data } = await supabase
        .from('jokes')
        .select('joke_text')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setJoke(data[0].joke_text);
      } else {
        fetchNewJoke();
      }
    };

    if (userId) {
      loadLatestJoke();
    }
  }, [userId]);

  return (
    <div className="bg-yellow-100/80 p-3 rounded-lg text-center relative">
      <div className="flex items-center justify-between gap-4">
        <p className="flex-1 text-primary">{joke || 'Loading joke...'}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchNewJoke}
          disabled={loading}
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};