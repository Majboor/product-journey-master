import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const categorySlug = url.pathname.split('/')[1]

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let query = supabaseClient.from('sitemaps').select('content');

    if (categorySlug) {
      // Get category ID if slug is provided
      const { data: category } = await supabaseClient
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (!category) {
        return new Response('Category not found', {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        })
      }

      query = query.eq('category_id', category.id);
    } else {
      query = query.is('category_id', null);
    }

    // Get sitemap content
    const { data: sitemap, error } = await query.single()

    if (error || !sitemap) {
      return new Response('Sitemap not found', {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    // Return sitemap XML with proper headers
    return new Response(sitemap.content, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal Server Error', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  }
})