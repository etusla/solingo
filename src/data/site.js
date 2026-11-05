// Sitenin tek veri kaynağı: sayfa, yapılandırılmış veri (JSON-LD), llms.txt ve tarayıcı betiği buradan okur.

export const SITE = {
  url: "https://solingo.com.tr",
  name: "Solingo",
  title: "Solingo — Araç İçi Bambu Peçete | Markanıza Özel Üretim",
  description:
    "Solingo araç içi peçete: bardaklığa tam oturan silindir kutuda %100 bambu, 3 katlı, 50 yapraklı peçete. 21 desen, dilediğiniz renkte ve logonuzla siparişe özel üretim.",
  phone: "+90 532 701 21 00",
  phoneHref: "+905327012100",
  whatsapp: "905327012100",
  email: "info@solingo.com.tr"
};

export const COMPANY = {
  legalName: "Boyraz Grup Sağlık Danışmanlık Hizmetleri San. Tic. Ltd. Şti.",
  shortName: "Boyraz Grup",
  street: "Anadolu Mah. Ankarayolu Cad. Tercih Petrol No:71",
  district: "Yıldırım",
  city: "Bursa",
  country: "TR"
};

// Cloudflare Turnstile site anahtarı (herkese açık). Boşsa bot doğrulaması gösterilmez.
export const TURNSTILE_SITE_KEY = "";

export const GROUPS = { duz: "Signature", cicek: "Çiçek", geo: "Geometrik" };

export const DESIGNS = [
  { id: "signature",       name: "Signature Lacivert", g: "duz" },
  { id: "signature-bordo", name: "Signature Bordo",    g: "duz" },
  { id: "siyah-bakir",     name: "Siyah Bakır",        g: "duz" },
  { id: "lacivert-altin",  name: "Lacivert Altın",     g: "duz" },
  { id: "karbon",          name: "Karbon",             g: "duz" },
  { id: "bordo",           name: "Bordo",              g: "duz" },
  { id: "tropik",          name: "Tropik",             g: "cicek" },
  { id: "aycicegi",        name: "Ayçiçeği",           g: "cicek" },
  { id: "gelincik",        name: "Gelincik",           g: "cicek" },
  { id: "kir-cicekleri",   name: "Kır Çiçekleri",      g: "cicek" },
  { id: "suluboya",        name: "Suluboya",           g: "cicek" },
  { id: "pastel-bahce",    name: "Pastel Bahçe",       g: "cicek" },
  { id: "mozaik",          name: "Mozaik",             g: "cicek" },
  { id: "retro",           name: "Retro",              g: "cicek" },
  { id: "geometrik-mint",  name: "Mint Geometri",      g: "geo" },
  { id: "geometrik-sari",  name: "Sarı Geometri",      g: "geo" },
  { id: "pembe-ucgen",     name: "Pembe Üçgen",        g: "geo" },
  { id: "terrazzo",        name: "Terrazzo",           g: "geo" },
  { id: "lavanta",         name: "Lavanta",            g: "geo" },
  { id: "kiremit",         name: "Kiremit Zikzak",     g: "geo" },
  { id: "lila-dalga",      name: "Lila Dalga",         g: "geo" }
];

// Özel üretim önizlemesinde kutuya sarılabilen hazır desenler
export const STYLES = [
  ["duz", "Düz renk"], ["tropik", "Tropik"], ["aycicegi", "Ayçiçeği"], ["gelincik", "Gelincik"],
  ["kir-cicekleri", "Kır Çiçekleri"], ["suluboya", "Suluboya"], ["pastel-bahce", "Pastel Bahçe"],
  ["mozaik", "Mozaik"], ["retro", "Retro"], ["geometrik-mint", "Mint Geometri"], ["geometrik-sari", "Sarı Geometri"],
  ["pembe-ucgen", "Pembe Üçgen"], ["terrazzo", "Terrazzo"], ["lavanta", "Lavanta"], ["kiremit", "Kiremit Zikzak"], ["lila-dalga", "Lila Dalga"]
];

export const BODY = [
  ["Lacivert", "#1d2547"], ["Bordo", "#5e1d29"], ["Siyah", "#1b1b1e"], ["Antrasit", "#3b4049"],
  ["Orman Yeşili", "#1f4436"], ["Gri Mavi", "#8ea8aa"], ["Kum", "#c8b597"], ["Krem", "#efe8d8"]
];

export const INK = [["Altın", "#d2bc86"], ["Gümüş", "#c9ccd3"], ["Beyaz", "#ffffff"], ["Siyah", "#1b1b1e"]];

// Kutu ölçüleri (yükseklik ve çap, cm)
export const SIZES = [
  { h: 14, d: 8.3 }, { h: 14.5, d: 6.8 }, { h: 16, d: 6.8 }, { h: 18, d: 6.8 }
];
export const DEFAULT_SIZE = 2;

export const QUANTITIES = ["100.000 – 250.000", "250.000 – 500.000", "500.000 – 1.000.000", "1.000.000 ve üzeri"];

export const FAQ = [
  ["Solingo nedir?",
   "Solingo, araç içinde kullanılmak üzere tasarlanmış bir peçete kutusudur. Silindir kutu aracın bardaklığına yerleşir; içinde %100 bambu lifinden üretilmiş peçeteler bulunur."],
  ["Kutu aracın bardaklığına uyar mı?",
   "Gövde çapı 6,8 cm olan kutular araç bardaklıklarına uyacak şekilde tasarlanmıştır. Daha geniş bardaklıklar için 8,3 cm çaplı, 14 cm boyunda bir seçenek de üretilmektedir."],
  ["Bir kutuda kaç peçete vardır, kaç katlıdır?",
   "Standart kutuda 3 katlı 50 yaprak peçete bulunur. Siparişe özel üretimde 2 katlı peçete ve 40 yapraklı kutu da seçilebilir."],
  ["Peçete kutusu nasıl kullanılır?",
   "Kapaktaki oval bölümü bastırarak açın; peçeteyi çekerek tek tek kullanın."],
  ["Kendi markamıza özel kutu üretilebilir mi?",
   "Evet. Kutu rengi, baskı rengi, logo, desen, kapak etiketi, kutu boyu ve paketleme siparişe göre belirlenir. Tasarım onaylandıktan sonra numune hazırlanır."],
  ["Siparişe özel üretimde minimum adet nedir?",
   "Siparişe özel üretim teklifleri 100.000 adetten başlar. Adet, desen ve paketleme tercihinize göre teklif hazırlanır."],
  ["Ürün nasıl saklanmalıdır?",
   "Güneş ışığından uzakta, serin ve kuru bir yerde muhafaza edin."]
];

export const img = id => `/img/g/${id}.webp`;
export const imgMd = id => `/img/g/${id}-md.webp`;
export const imgSm = id => `/img/g/${id}-sm.webp`;
export const num = v => String(v).replace(".", ",");
export const sizeLabel = s => `${num(s.h)} cm · Ø ${num(s.d)} cm`;
