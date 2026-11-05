# Solingo — Tanıtım Sitesi

Solingo araç içi bambu peçete için tek sayfalık kurumsal tanıtım sitesi. Derleme adımı yoktur; saf HTML, CSS ve JavaScript.

- `public/index.html` — sayfa
- `public/assets/style.css` — stiller
- `public/assets/app.js` — koleksiyon filtresi, desen büyütme, özel üretim önizlemesi, iletişim formu (WhatsApp / e-posta)
- `public/assets/img/g/` — koleksiyon görselleri (800 px ve 1600 px)
- `public/assets/img/` — araç içi kullanım fotoğrafları

Desen listesi `public/assets/app.js` içindeki `DESIGNS` dizisindedir; özel üretimdeki renk seçenekleri `BODY` ve `INK` dizilerindedir.

## Yayın

Cloudflare Workers, `main` dalına yapılan her gönderimi otomatik yayınlar (`wrangler.toml`, `public/` klasörü).

## Yerelde çalıştırma

```sh
python3 -m http.server 8000 -d public
```
