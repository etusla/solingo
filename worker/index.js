// Solingo Worker: statik siteyi sunar, /api/desen ile yapay zekâ desen taslağı üretir.

const W = 640, H = 1280;          // kutu gövdesine uygun dikey oran
const seed = () => Math.floor(Math.random() * 1e9);

// FLUX.2 modelleri çok parçalı form verisi bekler
async function multipart(fields) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, String(v));
  const req = new Request("http://form", { method: "POST", body: form });
  return { multipart: { body: req.body, contentType: req.headers.get("content-type") } };
}

// Sırayla denenen görsel modelleri; ilki hata verirse sonraki kullanılır
const MODELS = [
  ["@cf/black-forest-labs/flux-2-klein-9b", p => multipart({ prompt: p, width: W, height: H, seed: seed() })],
  ["@cf/leonardo/lucid-origin", p => ({ prompt: p, width: W, height: H, guidance: 4.5, seed: seed() })],
  ["@cf/black-forest-labs/flux-1-schnell", p => ({ prompt: p, steps: 8, seed: seed() })],
  ["@cf/bytedance/stable-diffusion-xl-lightning", p => ({ prompt: p, width: 768, height: 1024 })]
];

// Türkçe tarifi görsel modelinin iyi anladığı ayrıntılı İngilizce bir sanat yönergesine çevirir
const WRITER = "@cf/meta/llama-3.1-8b-instruct-fast";
async function artDirection(env, user, colors) {
  try {
    const out = await env.AI.run(WRITER, {
      max_tokens: 160,
      temperature: 0.6,
      messages: [
        { role: "system", content: "You are a senior textile and packaging pattern designer. Turn the customer's request (often in Turkish) into ONE English prompt for an image model that creates a premium, seamless repeating surface pattern printed on a cylindrical tissue box. Describe motifs, composition, scale, rhythm, art style, line quality and an exact color palette. Keep it elegant and print-ready. Never include text, letters, logos, brands, people or a product mockup. Reply with the prompt only, under 70 words." },
        { role: "user", content: `Request: ${user}${colors ? `\nBrand colors to respect if they fit: ${colors}` : ""}` }
      ]
    });
    const t = String(out && (out.response ?? out.result?.response ?? "")).replace(/^["'\s]+|["'\s]+$/g, "");
    return t.length > 20 ? t.slice(0, 700) : null;
  } catch (e) {
    console.error("desen: tarif çevirisi başarısız", e && e.message);
    return null;
  }
}
const DAILY_LIMIT = 8;            // kişi (IP) başına günlük deneme
const MAX_PROMPT = 240;

// Uygunsuz ya da başka markaya ait içerik isteklerini baştan reddeder
const BLOCKED = /\b(nude|naked|sex|porn|çıplak|ciplak|seks|erotik|nazi|gore|kan(lı|li)?|silah|weapon|nike|adidas|puma|coca[- ]?cola|pepsi|disney|marvel|pokemon|louis vuitton|gucci|chanel|apple|samsung)\b/i;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });

function buildPrompt(direction) {
  return [
    "Seamless repeating surface pattern, flat front view, fills the entire frame edge to edge, for printing on a premium cylindrical tissue box.",
    direction,
    "High-end packaging design, crisp clean shapes, balanced spacing, harmonious colors, sharp details.",
    "No text, no letters, no words, no logos, no watermark, no product, no box, no mockup, no frame, no border, no people."
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

// Workers AI yanıtı modele göre farklı biçimlerde gelebilir: base64, data: adresi ya da görsel bağlantısı
async function toDataUri(out) {
  const v = out && (out.image ?? out.result?.image ?? out.images?.[0] ?? out.result?.images?.[0]);
  if (typeof v === "string") {
    if (v.startsWith("data:")) return v;
    if (/^https?:\/\//.test(v)) {
      const r = await fetch(v);
      if (!r.ok) return null;
      const buf = new Uint8Array(await r.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return `data:${r.headers.get("Content-Type") || "image/jpeg"};base64,${btoa(bin)}`;
    }
    return `data:image/jpeg;base64,${v}`;
  }
  if (out instanceof ReadableStream || out instanceof ArrayBuffer || out instanceof Uint8Array) {
    const buf = new Uint8Array(out instanceof ReadableStream ? await new Response(out).arrayBuffer() : out);
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return `data:image/png;base64,${btoa(bin)}`;
  }
  return null;
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

  if (!env.AI) return json({ error: "Yapay zekâ servisi bu sitede etkin değil.", code: "ai_binding" }, 503);
  const direction = (await artDirection(env, prompt, colors)) || `Design theme: ${prompt}.${colors ? ` Colors: ${colors}.` : ""}`;
  const full = buildPrompt(direction);
  let used_model = "";
  let image = null, lastErr = "";
  for (const [model, args] of MODELS) {
    try {
      const out = await env.AI.run(model, await args(full));
      image = await toDataUri(out);
      if (image) { used_model = model; break; }
      lastErr = `${model}: beklenmeyen yanıt (${out && typeof out === "object" ? Object.keys(out).join(",") : typeof out})`;
    } catch (e) {
      lastErr = `${model}: ${(e && (e.message || String(e))) || "bilinmeyen hata"}`;
    }
    console.error("desen:", lastErr);
  }
  if (!image) {
    return json({ error: "Desen şu anda oluşturulamadı. Biraz sonra tekrar deneyin.", code: "ai_run", detail: lastErr.slice(0, 220) }, 502);
  }

  if (env.LIMITS) await env.LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 26 });

  console.log("desen: üretildi", used_model);
  return json({ image, remaining: DAILY_LIMIT - used - 1, model: used_model });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/desen") return handleDesen(request, env);
    return env.ASSETS.fetch(request);
  }
};
