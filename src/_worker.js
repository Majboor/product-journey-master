export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API requests differently if needed
      if (url.pathname.startsWith('/api/')) {
        // Add API handling logic here if needed
        return new Response('API endpoint', { status: 200 });
      }

      // Serve static assets from Cloudflare's CDN
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
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};