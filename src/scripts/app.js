import { SITE, DESIGNS, STYLES, BODY, INK, SIZES, DEFAULT_SIZE, img, sizeLabel } from "../data/site.js";

const $ = s => document.querySelector(s);

// ---------- koleksiyon ----------
const grid = $("#grid"), filters = $("#filters");
const cards = [...grid.querySelectorAll(".card:not(.cta)")];
const cta = grid.querySelector(".cta");
let visible = cards.map((_, i) => i);

// son satırdaki boşluğu "Size özel" kartı doldurur
function fitCta() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  const rem = cols - (visible.length % cols);
  cta.style.gridColumn = `span ${rem === 0 ? cols : rem}`;
  const ph = grid.querySelector(".card:not([hidden]):not(.cta) .ph");
  if (ph) cta.style.setProperty("--h", ph.offsetHeight + "px");
}
window.addEventListener("resize", fitCta);
window.addEventListener("load", fitCta);
fitCta();

filters.addEventListener("click", e => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  const f = b.dataset.f;
  filters.querySelectorAll(".filter").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  visible = [];
  cards.forEach((c, i) => {
    const on = f === "all" || c.dataset.g === f;
    c.hidden = !on;
    if (on) visible.push(i);
  });
  fitCta();
});

// ---------- büyük görsel ----------
const lb = $("#lb"), lbImg = $("#lbImg"), lbName = $("#lbName");
let cur = 0;
function show(i) {
  cur = i; const d = DESIGNS[i];
  lbImg.src = img(d.id); lbImg.alt = `Solingo ${d.name}`; lbName.textContent = d.name;
}
function step(dir) {
  const k = visible.indexOf(cur);
  show(visible[(k + dir + visible.length) % visible.length]);
}
grid.addEventListener("click", e => {
  const c = e.target.closest(".card[data-i]"); if (!c || !e.target.closest("button")) return;
  show(+c.dataset.i);
  if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
});
lb.addEventListener("click", e => {
  if (e.target === lb || e.target.closest("[data-close]")) lb.close();
  const s = e.target.closest("[data-step]"); if (s) step(+s.dataset.step);
});
lb.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
$("#lbAsk").addEventListener("click", e => {
  e.preventDefault();
  lb.close();
  prefill(`${DESIGNS[cur].name} deseni için teklif almak istiyoruz.\nTahmini adet: `);
});

// ---------- özel üretim stüdyosu ----------
const st = { body: BODY[0], ink: INK[0], style: STYLES[0], design: null, logo: null, size: SIZES[DEFAULT_SIZE] };

function swatches(el, list, key) {
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    st[key] = list[+b.dataset.i];
    el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    el.querySelector(".sw-name").textContent = st[key][0];
    paint();
  });
}
swatches($("#bodySw"), BODY, "body");
swatches($("#inkSw"), INK, "ink");

const styleSw = $("#styleSw");
function pickStyle(i) {
  st.style = i === "upload" ? ["upload", "Kendi deseniniz"] : STYLES[i];
  styleSw.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.s === String(i))));
  $("#styleName").textContent = st.style[1];
  paint();
}
styleSw.addEventListener("click", e => {
  const b = e.target.closest("[data-s]"); if (!b) return;
  pickStyle(b.dataset.s === "upload" ? "upload" : +b.dataset.s);
});

const sizes = $("#sizes");
sizes.addEventListener("click", e => {
  const b = e.target.closest("[data-z]"); if (!b) return;
  st.size = SIZES[+b.dataset.z];
  sizes.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  paint();
});
["#s-kat", "#s-yaprak"].forEach(s => $(s).addEventListener("change", () => paint()));

const note = $("#upNote"), NOTE = note.textContent;
function readImage(input, done) {
  const f = input.files && input.files[0];
  input.value = "";
  if (!f) return;
  if (!/^image\//.test(f.type)) { note.textContent = "Lütfen PNG, JPG, WEBP ya da SVG biçiminde bir görsel seçin."; return; }
  if (f.size > 10 * 1024 * 1024) { note.textContent = "Görsel 10 MB'tan küçük olmalı."; return; }
  const r = new FileReader();
  r.onload = () => { note.textContent = NOTE; done(r.result); };
  r.onerror = () => { note.textContent = "Görsel okunamadı, başka bir dosya deneyin."; };
  r.readAsDataURL(f);
}
$("#upDesign").addEventListener("change", e => readImage(e.target, url => {
  st.design = url;
  let b = styleSw.querySelector('[data-s="upload"]');
  if (!b) {
    b = document.createElement("button");
    b.type = "button"; b.dataset.s = "upload"; b.title = "Kendi deseniniz"; b.setAttribute("aria-label", "Kendi deseniniz");
    styleSw.insertBefore(b, $("#styleName"));
  }
  b.style.backgroundImage = `url(${url})`;
  pickStyle("upload");
}));
$("#upLogo").addEventListener("change", e => readImage(e.target, url => { st.logo = url; paint(); }));

const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v * k)));
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join("");
};
const textIn = $("#s-text");
const attr = (sel, k, v) => $(sel).setAttribute(k, v);

function paint() {
  const b = st.body[1], ink = st.ink[1];
  attr("#cBody", "fill", b);
  attr("#cRim", "fill", b);
  attr("#cLid", "fill", shade(b, 1.12));
  ["#cText", "#cLidText", "#cIcons"].forEach(s => attr(s, "fill", ink));
  attr("#cWaves", "stroke", ink);
  attr("#cLabel", "stroke", ink);
  const t = textIn.value.trim() || "Solingo";
  $("#cText").textContent = t;
  $("#cLidText").textContent = t;
  const len = [...t].length;
  attr("#cText", "font-size", String(Math.min(46, Math.round(300 / Math.max(len, 1)))));
  attr("#cLidText", "font-size", String(Math.min(13, Math.round(86 / Math.max(len, 1)))));

  const kat = $("#s-kat").value, yap = $("#s-yaprak").value;
  $("#cKat").textContent = `${kat} KATLI`;
  $("#cYaprak").textContent = yap;
  $("#dims").textContent = `${sizeLabel(st.size)} · ${kat} katlı · ${yap} yaprak`;

  // hazır desenlerin üzerinde logo zaten basılıdır
  const sid = st.style[0];
  const src = sid === "duz" ? "" : sid === "upload" ? st.design : `/img/stil/${sid}.webp`;
  attr("#cPat", "href", src || "");
  attr("#cPat", "visibility", src ? "visible" : "hidden");
  const ready = sid !== "duz" && sid !== "upload";
  attr("#cWaves", "visibility", sid === "duz" ? "visible" : "hidden");
  attr("#cIcons", "visibility", sid === "duz" ? "visible" : "hidden");
  attr("#cLogo", "href", st.logo || "");
  attr("#cLogo", "visibility", st.logo ? "visible" : "hidden");
  attr("#cText", "visibility", ready || st.logo ? "hidden" : "visible");
}
textIn.addEventListener("input", paint);
paint();

$("#useDesign").addEventListener("click", () => {
  prefill([
    "Özel üretim için teklif almak istiyoruz.",
    `Stil: ${st.style[0] === "upload" ? "Kendi desenimiz (dosyayı ayrıca ileteceğiz)" : st.style[1]}`,
    `${st.style[0] === "duz" ? "Kutu rengi" : "Kapak rengi"}: ${st.body[0]}`,
    `Baskı rengi: ${st.ink[0]}`,
    `Kutu boyu: ${sizeLabel(st.size)}`,
    `Peçete: ${$("#s-kat").value} katlı, ${$("#s-yaprak").value} yaprak`,
    st.logo ? "Logo: Kendi logomuz (dosyayı ayrıca ileteceğiz)" : `Kutu üzerindeki yazı: ${textIn.value.trim() || "Solingo"}`,
    `Tahmini adet: ${$("#s-adet").value}`,
    `Paketleme: ${$("#s-paket").value}`
  ].join("\n"));
});

function prefill(text) {
  const m = $("#f-mesaj");
  m.value = text;
  m.classList.remove("invalid");
  $("#iletisim").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#f-ad").focus({ preventScroll: true }), 600);
}

// ---------- form ----------
const form = $("#form"), err = $("#formErr");
let via = "wa";
form.querySelectorAll("[data-via]").forEach(b => b.addEventListener("click", () => { via = b.dataset.via; }));
form.addEventListener("submit", e => {
  e.preventDefault();
  const req = [...form.querySelectorAll("[required]")];
  const bad = req.filter(f => !f.value.trim());
  req.forEach(f => f.classList.toggle("invalid", bad.includes(f)));
  if (bad.length) { err.textContent = "Lütfen adınızı, firmanızı ve mesajınızı yazın."; err.hidden = false; bad[0].focus(); return; }
  err.hidden = true;
  const v = Object.fromEntries(new FormData(form).entries());
  const text = [
    "Merhaba, Solingo hakkında bilgi almak istiyoruz.", "",
    `Ad Soyad: ${v.ad}`, `Firma: ${v.firma}`,
    v.tel ? `Telefon: ${v.tel}` : null,
    v.eposta ? `E-posta: ${v.eposta}` : null,
    "", v.mesaj
  ].filter(l => l !== null).join("\n");
  if (via === "wa") {
    const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
    const w = window.open(url, "_blank");
    if (w) w.opener = null; else location.href = url;
  } else {
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Solingo teklif talebi — " + v.firma)}&body=${encodeURIComponent(text)}`;
  }
});
form.addEventListener("input", e => { if (e.target.value.trim()) e.target.classList.remove("invalid"); });

// ---------- menü ve giriş animasyonu ----------
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("solid", window.scrollY > 30);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const rv = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add("in"));
