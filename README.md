# Solingo — Tanıtım Sitesi

Solingo araç içi / bambu peçete koleksiyonu için tek sayfalık tanıtım sitesi. Derleme adımı yoktur; saf HTML, CSS ve JavaScript.

- `index.html` — sayfa
- `assets/style.css`, `assets/app.js` — stil ve etkileşim (koleksiyon filtresi, anlar, detay penceresi, seçki ve teklif formu)
- `assets/img/` — ürün görselleri (WebP)

Tasarım, seri ve "an" verileri `assets/app.js` içindeki `DESIGNS`, `SERIES` ve `MOMENTS` dizilerindedir. Teklif formunun gideceği e-posta adresi aynı dosyanın başındaki `CONFIG.email` alanından ayarlanır.

## Cloudflare Pages ile yayınlama

1. Cloudflare panelinde **Workers & Pages → Create → Pages → Connect to Git** seçin.
2. `etusla/solingo` deposunu ve `main` dalını seçin.
3. Framework preset: **None**, Build command: *boş*, Build output directory: `/`.
4. **Save and Deploy**. Her `main` push'unda site otomatik güncellenir.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000
```
