# Solingo — Tanıtım Sitesi

Solingo araç içi / bambu peçete koleksiyonu için tek sayfalık tanıtım sitesi. Derleme adımı yoktur; saf HTML, CSS ve JavaScript.

- `index.html` — sayfa
- `assets/style.css`, `assets/app.js` — stil ve etkileşim (koleksiyon filtresi, anlar, detay penceresi, seçki ve teklif formu)
- `assets/img/` — ürün görselleri (WebP)

Tasarım, seri ve "an" verileri `assets/app.js` içindeki `DESIGNS`, `SERIES` ve `MOMENTS` dizilerindedir. Teklif formunun gideceği e-posta adresi aynı dosyanın başındaki `CONFIG.email` alanından ayarlanır.

## Cloudflare ile yayınlama

Depoda `wrangler.toml` hazır; ek ayar gerekmez.

1. Cloudflare panelinde **Workers & Pages → Create → Import a repository** seçin.
2. `etusla/solingo` deposunu seçip varsayılan ayarlarla **Deploy** edin.
3. Site `solingo.<hesap>.workers.dev` adresinde yayına girer; her `main` push'unda otomatik güncellenir.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000
```
