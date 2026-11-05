# Solingo — Tanıtım Sitesi

Solingo araç içi bambu peçete için tek sayfalık kurumsal site. [Astro](https://astro.build) ile statik olarak derlenir; tarayıcıya yalnızca küçük bir etkileşim betiği gider.

- `src/data/site.js` — tüm içerik verisi (desenler, renkler, boylar, SSS, firma bilgileri)
- `src/pages/index.astro` — sayfa ve yapılandırılmış veri (JSON-LD: Organization, Product, FAQPage)
- `src/pages/sitemap.xml.js`, `src/pages/llms.txt.js` — site haritası ve yapay zekâ özeti, veriden üretilir
- `src/layouts/Base.astro` — meta etiketleri, Open Graph, yazı tipleri
- `src/scripts/app.js` — koleksiyon filtresi, desen büyütme, özel üretim önizlemesi, iletişim formu
- `src/styles/global.css` — stiller
- `public/` — görseller, `robots.txt`, `_headers`

## Geliştirme

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne derler
```

## Yayın

Cloudflare Workers Builds, `main` dalına yapılan her gönderimde `wrangler.toml` içindeki derleme komutunu çalıştırır ve `dist/` klasörünü yayınlar.

## Yapay zekâ desen taslağı

`worker/index.js` içindeki `/api/desen` uç noktası, Cloudflare Workers AI ile desen taslağı üretir. Kişi başı dakikada 3, günde 8 deneme sınırı vardır (`wrangler.toml`: `LIMITER`, `LIMITS`).

Bot koruması için Cloudflare Turnstile önerilir:
1. Cloudflare panelinde **Turnstile → Add widget** ile `solingo.com.tr` için bir widget oluşturun.
2. Site anahtarını `src/data/site.js` içindeki `TURNSTILE_SITE_KEY` alanına yazın.
3. Gizli anahtarı Worker'a `TURNSTILE_SECRET` adlı **Secret** olarak ekleyin (solingo → Settings → Variables and Secrets).
