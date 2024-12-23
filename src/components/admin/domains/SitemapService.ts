import { supabase } from "@/integrations/supabase/client";

export const generateSitemapContent = (pages: any[], domain: string) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>https://${domain}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
};

export const generateSitemap = async (categoryId: string, domain: string) => {
  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('slug, updated_at')
    .eq('category_id', categoryId);

  if (pagesError) throw pagesError;
  if (!pages || pages.length === 0) {
    throw new Error("No pages found for this category");
  }

  const sitemap = generateSitemapContent(pages, domain);
  const { data: existingSitemap } = await supabase
    .from('sitemaps')
    .select()
    .eq('category_id', categoryId)
    .maybeSingle();

  if (existingSitemap) {
    const { error: sitemapError } = await supabase
      .from('sitemaps')
      .update({
        content: sitemap,
        last_generated: new Date().toISOString(),
      })
      .eq('category_id', categoryId);

    if (sitemapError) throw sitemapError;
  } else {
    const { error: sitemapError } = await supabase
      .from('sitemaps')
      .insert({
        category_id: categoryId,
        content: sitemap,
        last_generated: new Date().toISOString(),
      });

    if (sitemapError) throw sitemapError;
  }

  return sitemap;
};

export const downloadSitemap = async (categoryId: string) => {
  const { data: sitemap, error } = await supabase
    .from('sitemaps')
    .select('content')
    .eq('category_id', categoryId)
    .order('last_generated', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!sitemap?.content) {
    throw new Error("No sitemap found");
  }

  return sitemap.content;
};