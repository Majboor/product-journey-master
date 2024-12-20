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
    const { categoryId, localPath } = await req.json()
    console.log('Received request:', { categoryId, localPath })
    
    if (!categoryId || !localPath) {
      throw new Error('Missing required parameters: categoryId or localPath')
    }

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

    if (categoryError) {
      console.error('Category error:', categoryError)
      throw new Error(`Failed to fetch category: ${categoryError.message}`)
    }
    if (!category) {
      throw new Error('Category not found')
    }

    console.log('Found category:', category)

    // Get sitemap content
    const { data: sitemap, error: sitemapError } = await supabaseClient
      .from('sitemaps')
      .select('content')
      .eq('category_id', categoryId)
      .order('last_generated', { ascending: false })
      .limit(1)
      .single()

    if (sitemapError) {
      console.error('Sitemap error:', sitemapError)
      throw new Error(`Failed to fetch sitemap: ${sitemapError.message}`)
    }
    if (!sitemap) {
      throw new Error('Sitemap not found')
    }

    console.log('Found sitemap')

    // Create directory if it doesn't exist
    const fullPath = `${localPath}/${category.slug}`
    try {
      await Deno.mkdir(fullPath, { recursive: true })
      console.log('Created directory:', fullPath)
    } catch (error) {
      console.error('Error creating directory:', error)
      throw new Error(`Failed to create directory: ${error.message}`)
    }

    // Write sitemap file
    const filePath = `${fullPath}/sitemap.xml`
    try {
      await Deno.writeTextFile(filePath, sitemap.content)
      console.log('Wrote sitemap to:', filePath)
    } catch (error) {
      console.error('Error writing file:', error)
      throw new Error(`Failed to write file: ${error.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        path: filePath,
        message: `Sitemap saved successfully at ${filePath}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in save-sitemap-locally:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unknown error occurred',
        success: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})