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
        { role: "system", content: "You are a senior textile and surface pattern designer. Turn the customer's request (often in Turkish) into ONE English prompt for an image model that creates a flat, seamless repeating pattern swatch, like a scanned sheet of premium wallpaper or gift wrap seen straight on. Describe only the motifs, their scale, spacing and rhythm, the art style, line quality and an exact color palette including the background color. Never mention any object, container, box, can, cylinder, packaging, product, room, scene, table, text, letters, logos, brands or people. Reply with the prompt only, under 60 words." },
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
    "Flat seamless repeating pattern swatch, 2D print design scanned straight on, the pattern covers 100% of the image edge to edge with no background around it.",
    direction,
    "Premium wallpaper and gift wrap quality, crisp clean shapes, balanced spacing, harmonious colors, sharp details, even lighting, no shadows.",
    "Not a photo of an object. No 3D, no perspective, no cylinder, no can, no box, no packaging, no mockup, no product, no table, no frame, no border, no text, no letters, no logo, no watermark, no people."
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

// ---------- teklif formu ----------
const TO = "i.yldz2106@gmail.com";        // teklifler bu adrese gider (Email Routing'de doğrulanmış olmalı)
const FROM = "teklif@solingo.com.tr";
const clean = (v, n) => String(v ?? "").replace(/\r/g, "").trim().slice(0, n);

export async function handleTeklif(request, env) {
  if (request.method !== "POST") return json({ error: "Yalnızca POST isteği kabul edilir." }, 405);
  let v;
  try { v = await request.json(); } catch { return json({ error: "Geçersiz istek." }, 400); }
  if (v.website) return json({ ok: true });                        // bot tuzağı
  const t = {
    ad: clean(v.ad, 120), firma: clean(v.firma, 160), tel: clean(v.tel, 40),
    eposta: clean(v.eposta, 160), mesaj: clean(v.mesaj, 4000)
  };
  if (!t.ad || !t.firma || !t.mesaj) return json({ error: "Lütfen adınızı, firmanızı ve mesajınızı yazın." }, 400);
  if (!t.tel && !t.eposta) return json({ error: "Size ulaşabilmemiz için telefon ya da e-posta yazın." }, 400);
  if (t.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.eposta)) return json({ error: "E-posta adresini kontrol edin." }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "yerel";
  if (env.FORM_LIMIT) {
    const { success } = await env.FORM_LIMIT.limit({ key: ip });
    if (!success) return json({ error: "Çok fazla deneme yaptınız. Bir dakika sonra tekrar deneyin." }, 429);
  }

  const at = new Date().toISOString();
  const id = `teklif:${at}:${crypto.randomUUID().slice(0, 8)}`;
  const record = { ...t, at, ip, ua: clean(request.headers.get("User-Agent"), 200) };

  // Her talep önce kaydedilir; e-posta gönderimi başarısız olsa da kaybolmaz
  let saved = false;
  if (env.LIMITS) { await env.LIMITS.put(id, JSON.stringify(record)); saved = true; }

  let mailed = false;
  if (env.MAIL) {
    const lines = [
      `Ad Soyad: ${t.ad}`, `Firma: ${t.firma}`, `Telefon: ${t.tel || "-"}`, `E-posta: ${t.eposta || "-"}`,
      "", t.mesaj, "", `Gönderim: ${at}`
    ];
    try {
      await env.MAIL.send({
        to: TO,
        from: { email: FROM, name: "Solingo Web Sitesi" },
        ...(t.eposta ? { replyTo: t.eposta } : {}),
        subject: `Yeni teklif talebi — ${t.firma}`,
        text: lines.join("\n")
      });
      mailed = true;
    } catch (e) {
      console.error("teklif: e-posta gönderilemedi", e && e.message);
    }
  }
  console.log("teklif:", id, { saved, mailed });
  if (!saved && !mailed) return json({ error: "Talebiniz şu anda kaydedilemedi. Lütfen bizi telefonla arayın." }, 503);
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Tek adres: www ve http istekleri kalıcı olarak https://solingo.com.tr adresine yönlenir
    if (url.hostname === "www.solingo.com.tr" || (url.protocol === "http:" && url.hostname === "solingo.com.tr")) {
      url.hostname = "solingo.com.tr"; url.protocol = "https:"; url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/api/desen") return handleDesen(request, env);
    if (url.pathname === "/api/teklif") return handleTeklif(request, env);
    return env.ASSETS.fetch(request);
  }
};
