import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { categoryId, apachePath } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get category info
    const { data: category, error: categoryError } = await supabaseClient
      .from('categories')
      .select('slug')
      .eq('id', categoryId)
      .single()

    if (categoryError) throw categoryError

    // Get sitemap content
    const { data: sitemap, error: sitemapError } = await supabaseClient
      .from('sitemaps')
      .select('content')
      .eq('category_id', categoryId)
      .order('last_generated', { ascending: false })
      .limit(1)
      .single()

    if (sitemapError) throw sitemapError

    // Create category directory
    const categoryPath = `${apachePath}/${category.slug}`
    await Deno.mkdir(categoryPath, { recursive: true })

    // Write sitemap file
    const sitemapPath = `${categoryPath}/sitemap.xml`
    await Deno.writeTextFile(sitemapPath, sitemap.content)

    return new Response(
      JSON.stringify({
        success: true,
        path: sitemapPath,
        url: `/${category.slug}/sitemap.xml`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})