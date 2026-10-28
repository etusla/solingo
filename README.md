# Solingo — Tanıtım Sitesi

Solingo araç içi / bambu peçete koleksiyonu için tek sayfalık tanıtım sitesi. Derleme adımı yoktur; saf HTML, CSS ve JavaScript.

- `public/index.html` — sayfa
- `public/assets/can3d.js` — 3D kutu sahnesi (three.js): desen dokuları, geçişler, uçuşan yapraklar
- `public/assets/app.js` — kaydırma sahneleri, galeri, iletişim formu (WhatsApp / e-posta)
- `public/assets/style.css` — stiller
- `public/assets/tex/` — 3D kutuya sarılan desen dokuları
- `public/assets/img/g/` — galeri görselleri (800 px ve 1600 px)

Desen listesi `public/assets/app.js` içindeki `DESIGNS`, kullanım anları `MOMENTS` dizisindedir.

## Cloudflare ile yayınlama

Depoda `wrangler.toml` hazır; ek ayar gerekmez.

1. Cloudflare panelinde **Workers & Pages → Create → Import a repository** seçin.
2. `etusla/solingo` deposunu seçip varsayılan ayarlarla **Deploy** edin.
3. Site `solingo.<hesap>.workers.dev` adresinde yayına girer; her `main` push'unda otomatik güncellenir.

## Yerelde çalıştırma

```sh
python3 -m http.server 8000 -d public
```
