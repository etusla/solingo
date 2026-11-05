// Solingo Worker: statik siteyi sunar, /api/desen ile yapay zekâ desen taslağı üretir.

const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const DAILY_LIMIT = 8;            // kişi (IP) başına günlük deneme
const MAX_PROMPT = 240;

// Uygunsuz ya da başka markaya ait içerik isteklerini baştan reddeder
const BLOCKED = /\b(nude|naked|sex|porn|çıplak|ciplak|seks|erotik|nazi|gore|kan(lı|li)?|silah|weapon|nike|adidas|puma|coca[- ]?cola|pepsi|disney|marvel|pokemon|louis vuitton|gucci|chanel|apple|samsung)\b/i;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });

function buildPrompt(user, colors) {
  const palette = colors ? ` Preferred colors: ${colors}.` : "";
  return [
    "Seamless repeating surface pattern for printing on a cylindrical paper tissue box label.",
    "Flat 2D illustration, edge to edge, rich detail, elegant and premium, print ready style.",
    "No text, no letters, no words, no numbers, no logos, no watermark, no product, no mockup, no frame.",
    `Design theme: ${user}.${palette}`
  ].join(" ");
}

async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // anahtar tanımlı değilse doğrulama atlanır
  if (!token) return false;
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const d = await r.json().catch(() => ({}));
  return d.success === true;
}

export async function handleDesen(request, env) {
  if (request.method !== "POST") return json({ error: "Yalnızca POST isteği kabul edilir." }, 405);

  let input;
  try { input = await request.json(); } catch { return json({ error: "Geçersiz istek." }, 400); }
  const prompt = String(input.prompt || "").replace(/\s+/g, " ").trim();
  const colors = String(input.colors || "").slice(0, 80);
  if (prompt.length < 3) return json({ error: "Lütfen istediğiniz deseni birkaç kelimeyle anlatın." }, 400);
  if (prompt.length > MAX_PROMPT) return json({ error: `Tarif en fazla ${MAX_PROMPT} karakter olabilir.` }, 400);
  if (BLOCKED.test(prompt)) return json({ error: "Bu tarif kullanılamıyor. Başka markalara ait ya da uygunsuz içerik üretilmez." }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "yerel";

  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) return json({ error: "Çok hızlı denediniz. Bir dakika sonra tekrar deneyin." }, 429);
  }

  const day = new Date().toISOString().slice(0, 10);
  const key = `desen:${day}:${ip}`;
  const used = env.LIMITS ? Number(await env.LIMITS.get(key)) || 0 : 0;
  if (used >= DAILY_LIMIT) return json({ error: `Günlük ${DAILY_LIMIT} deneme hakkınız doldu. Yarın tekrar deneyebilir ya da bize yazabilirsiniz.` }, 429);

  if (!(await verifyTurnstile(env, input.token, ip))) return json({ error: "Güvenlik doğrulaması tamamlanamadı. Sayfayı yenileyip tekrar deneyin." }, 403);

  let result;
  try {
    result = await env.AI.run(MODEL, { prompt: buildPrompt(prompt, colors), steps: 6, seed: Math.floor(Math.random() * 1e9) });
  } catch (e) {
    return json({ error: "Desen şu anda oluşturulamadı. Biraz sonra tekrar deneyin." }, 502);
  }
  if (!result || !result.image) return json({ error: "Desen oluşturulamadı. Tarifi değiştirip tekrar deneyin." }, 502);

  if (env.LIMITS) await env.LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });

  return json({ image: `data:image/jpeg;base64,${result.image}`, remaining: DAILY_LIMIT - used - 1 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/desen") return handleDesen(request, env);
    return env.ASSETS.fetch(request);
  }
};
