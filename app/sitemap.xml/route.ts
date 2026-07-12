import { SITEMAP_IDS } from "@/lib/sitemap/entries";
import { SITE_URL } from "@/lib/seo/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const lastmod = new Date().toISOString();
  const entries = SITEMAP_IDS.map(
    (id) =>
      `  <sitemap>\n    <loc>${escapeXml(`${SITE_URL}/sitemap/${id}.xml`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
