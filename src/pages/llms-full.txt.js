import { SITE } from "../data/site.js";
import { PAGES } from "../data/pages.js";
import { GET as summary } from "./llms.txt.js";

// Yapay zekâ asistanları için tüm sayfaların düz metni (llms-full.txt)
export async function GET() {
  const head = await summary().text();
  const pages = PAGES.map(p => [
    `# ${p.h1.join(" ")}`, `Kaynak: ${SITE.url}/${p.slug}`, "", p.lead, "",
    ...p.sections.flatMap(([h, ps]) => [`## ${h}`, ...ps, ""]),
    "## Sıkça sorulan sorular", ...p.faq.flatMap(([q, a]) => [`### ${q}`, a, ""])
  ].join("\n")).join("\n---\n\n");
  return new Response(`${head}\n---\n\n${pages}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
