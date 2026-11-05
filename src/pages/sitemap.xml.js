import { SITE, DESIGNS, SERIES, img, seri } from "../data/site.js";

export function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const images = [
    ["/img/arac-signature.webp", "Araç bardaklığında Solingo peçete kutusu"],
    ["/img/arac-kullanim.webp", "Araç içinde Solingo kutusundan peçete alınırken"],
    ...DESIGNS.map(d => [img(d.id), `Solingo ${d.name} desenli araç içi peçete kutusu`]),
    ["/img/seri/renk-serisi.webp", "Solingo Renk Serisi geometrik desenli peçete kutuları"],
    ...SERIES.map(d => [seri(d.id), `${d.name} tasarım örneği, silindir peçete kutusu`])
  ].map(([p, t]) => `    <image:image><image:loc>${SITE.url}${p}</image:loc><image:title>${t}</image:title></image:image>`).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE.url}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images}
  </url>
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
