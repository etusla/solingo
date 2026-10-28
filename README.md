# Solingo — Tanıtım Sitesi

Solingo araç içi / bambu peçete koleksiyonu için tek sayfalık tanıtım sitesi. Derleme adımı yoktur; saf HTML, CSS ve JavaScript.

- `public/index.html` — sayfa
- `public/assets/style.css`, `public/assets/app.js` — stil ve desen galerisi
- `public/assets/img/` — ürün görselleri; `cut/` arka planı temizlenmiş kutular

Desen listesi `public/assets/app.js` içindeki `DESIGNS` dizisindedir; kullanım sahneleri `public/index.html` içinde SVG olarak çizilidir.

## Cloudflare ile yayınlama

Depoda `wrangler.toml` hazır; ek ayar gerekmez.

1. Cloudflare panelinde **Workers & Pages → Create → Import a repository** seçin.
2. `etusla/solingo` deposunu seçip varsayılan ayarlarla **Deploy** edin.
3. Site `solingo.<hesap>.workers.dev` adresinde yayına girer; her `main` push'unda otomatik güncellenir.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000 -d public
```
