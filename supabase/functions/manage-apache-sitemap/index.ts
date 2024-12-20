import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { categoryId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get category info
    const { data: category, error: categoryError } = await supabaseClient
      .from('categories')
      .select('slug')
      .eq('id', categoryId)
      .single()

    if (categoryError) throw categoryError
    if (!category) throw new Error('Category not found')

    // Get sitemap content
    const { data: sitemap, error: sitemapError } = await supabaseClient
      .from('sitemaps')
      .select('content')
      .eq('category_id', categoryId)
      .order('last_generated', { ascending: false })
      .limit(1)
      .single()

    if (sitemapError) throw sitemapError
    if (!sitemap) throw new Error('Sitemap not found')

    // Upload sitemap to storage
    const filePath = `${category.slug}/sitemap.xml`
    const { error: uploadError } = await supabaseClient
      .storage
      .from('sitemaps')
      .upload(filePath, sitemap.content, {
        contentType: 'application/xml',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: publicUrl } = supabaseClient
      .storage
      .from('sitemaps')
      .getPublicUrl(filePath)

    return new Response(
      JSON.stringify({
        success: true,
        path: filePath,
        url: publicUrl.publicUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})