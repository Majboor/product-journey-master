export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const hostname = request.headers.get('host');
      
      // Create Supabase client for the worker
      const supabaseUrl = env.SUPABASE_URL;
      const supabaseKey = env.SUPABASE_ANON_KEY;
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Check if this is a custom domain
      const { data: domainMapping } = await supabase
        .from('domain_mappings')
        .select('category_id, domain')
        .eq('domain', hostname)
        .maybeSingle();

      if (domainMapping) {
        // Get all pages for this category
        const { data: pages } = await supabase
          .from('pages')
          .select('slug, content')
          .eq('category_id', domainMapping.category_id);

        // Find matching page for the path
        const path = url.pathname.slice(1); // Remove leading slash
        const page = pages?.find(p => p.slug === path);
        
        if (page) {
          // Serve the page content
          return new Response(JSON.stringify(page.content), {
            headers: {
              'Content-Type': 'application/json',
              'X-Content-Type-Options': 'nosniff',
              'X-Frame-Options': 'DENY',
              'X-XSS-Protection': '1; mode=block'
            }
          });
        }
      }

      // If no custom domain match, serve static assets from Cloudflare's CDN
      const response = await env.ASSETS.fetch(request);
      
      // Add security headers
      const headers = new Headers(response.headers);
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};