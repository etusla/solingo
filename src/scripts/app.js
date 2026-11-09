import { SITE, DESIGNS, STYLES, BODY, INK, SIZES, DEFAULT_SIZE, QUANTITIES, SERIES, img, seri, sizeLabel } from "../data/site.js";

const $ = s => document.querySelector(s);

// ---------- koleksiyon ----------
const grid = $("#grid"), filters = $("#filters");
const cards = [...grid.querySelectorAll(".card:not(.cta)")];
const cta = grid.querySelector(".cta");
let visible = cards.map((_, i) => i);

// son satırdaki boşluğu "Size özel" kartı doldurur
const more = $("#gridMore");
function fitCta() {
  const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  // kapalıyken yalnızca ilk iki satır görünür
  const shown = grid.classList.contains("collapsed") ? Math.min(visible.length, cols * 2) : visible.length;
  const rem = cols - (shown % cols);
  cta.style.gridColumn = `span ${rem === 0 ? cols : rem}`;
  const ph = grid.querySelector(".card:not([hidden]):not(.cta) .ph");
  if (ph) cta.style.setProperty("--h", ph.offsetHeight + "px");
}
window.addEventListener("resize", fitCta);
window.addEventListener("load", fitCta);
fitCta();
function expand() { grid.classList.remove("collapsed"); more.parentElement.hidden = true; }
more.addEventListener("click", () => { expand(); fitCta(); });

filters.addEventListener("click", e => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  expand();
  grid.scrollTo({ left: 0 });
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

// ---------- büyük görsel (koleksiyon ve tasarım örnekleri) ----------
const lb = $("#lb"), lbImg = $("#lbImg"), lbName = $("#lbName"), lbAsk = $("#lbAsk");
const SETS = {
  desen: {
    src: i => img(DESIGNS[i].id), name: i => DESIGNS[i].name, alt: i => `Solingo ${DESIGNS[i].name}`,
    order: () => visible, ask: "Bu desen için teklif",
    text: i => `${DESIGNS[i].name} deseni için teklif almak istiyoruz.\nTahmini adet: `
  },
  seri: {
    src: i => seri(SERIES[i].id), name: i => SERIES[i].name, alt: i => `${SERIES[i].name} tasarım örneği`,
    order: () => SERIES.map((_, k) => k), ask: "Benzeri için teklif", tall: true,
    text: i => `${SERIES[i].name} tasarım örneğine benzer bir kutu için teklif almak istiyoruz (${sizeLabel(SIZES[SERIES[i].s])}).\nTahmini adet: `
  }
};
let set = SETS.desen, cur = 0;
function show(i) {
  cur = i;
  lbImg.src = set.src(i); lbImg.alt = set.alt(i); lbName.textContent = set.name(i);
}
function openLb(name, i) {
  set = SETS[name];
  lb.classList.toggle("tall", !!set.tall);
  lbImg.width = set.tall ? 720 : 1600; lbImg.height = set.tall ? 1000 : 1600;
  lbAsk.textContent = set.ask;
  show(i);
  if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
}
function step(dir) {
  const o = set.order(), k = o.indexOf(cur);
  show(o[(k + dir + o.length) % o.length]);
}
grid.addEventListener("click", e => {
  const c = e.target.closest(".card[data-i]"); if (!c || !e.target.closest("button")) return;
  openLb("desen", +c.dataset.i);
});
$("#arches").addEventListener("click", e => {
  const c = e.target.closest(".arch[data-i]"); if (!c || !e.target.closest("button")) return;
  openLb("seri", +c.dataset.i);
});
lb.addEventListener("click", e => {
  if (e.target === lb || e.target.closest("[data-close]")) lb.close();
  const s = e.target.closest("[data-step]"); if (s) step(+s.dataset.step);
});
lb.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});
lbAsk.addEventListener("click", e => {
  e.preventDefault();
  lb.close();
  prefill(set.text(cur));
});
$("#seriAsk").addEventListener("click", e => {
  e.preventDefault();
  prefill("Solingo Renk Serisi (sarı, mavi, turuncu, yeşil) için teklif almak istiyoruz.\nTahmini adet: ");
});

// ---------- özel üretim stüdyosu ----------
const st = {
  body: BODY[0], ink: INK[0], style: STYLES[0], custom: null, logo: null, size: SIZES[DEFAULT_SIZE],
  kat: "3", yaprak: "50", adet: QUANTITIES[0], paket: "Tekli kutu"
};
const mine = [];               // yapay zekâ ve yüklenen desenler: { url, label, ai }
const small = () => window.innerWidth < 1000;

// adımlar
const tabs = [...document.querySelectorAll(".wiz-nav [data-go]")];
const panes = [...document.querySelectorAll(".wizard .pane")];
const prevB = $("#wizPrev"), nextB = $("#wizNext");
let wizStep = 0;
function go(n, focus) {
  wizStep = Math.max(0, Math.min(panes.length - 1, n));
  panes.forEach((p, k) => { p.hidden = k !== wizStep; });
  tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === wizStep)); t.classList.toggle("done", k < wizStep); });
  prevB.hidden = wizStep === 0;
  nextB.hidden = wizStep === panes.length - 1;
  if (wizStep === panes.length - 1) summary();
  if (focus) {
    const w = $("#wizard").getBoundingClientRect();
    if (w.top < 70 || w.top > window.innerHeight * 0.6) $("#wizard").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
tabs.forEach(t => t.addEventListener("click", () => go(+t.dataset.go, true)));
prevB.addEventListener("click", () => go(wizStep - 1, true));
nextB.addEventListener("click", () => go(wizStep + 1, true));

// renk seçimleri
function swatches(el, list, key, nameEl) {
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    st[key] = list[+b.dataset.i];
    el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $(nameEl).textContent = st[key][0];
    paint();
  });
}
swatches($("#bodySw"), BODY, "body", "#bodyName");
swatches($("#inkSw"), INK, "ink", "#inkName");

// tek seçimli düğme grupları
document.querySelectorAll(".seg[data-key]").forEach(g => g.addEventListener("click", e => {
  const b = e.target.closest("[data-v]"); if (!b) return;
  st[g.dataset.key] = b.dataset.v;
  g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  paint();
}));

const sizes = $("#sizes");
sizes.addEventListener("click", e => {
  const b = e.target.closest("[data-z]"); if (!b) return;
  st.size = SIZES[+b.dataset.z];
  sizes.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  paint();
});

// desen seçimi: düz renk, koleksiyon ya da "Tasarımlarınız"
const pane0 = $("#pane-0"), styleSw = $("#styleSw"), mineEl = $("#mine");
function markSelection() {
  pane0.querySelectorAll("[data-s]").forEach(b => b.setAttribute("aria-pressed", String(!st.custom && STYLES[+b.dataset.s] === st.style)));
  mineEl.querySelectorAll("[data-m]").forEach(b => b.setAttribute("aria-pressed", String(st.custom === mine[+b.dataset.m])));
}
function pickStyle(i) { st.style = STYLES[i]; st.custom = null; markSelection(); paint(); }
function pickMine(k) { st.custom = mine[k]; markSelection(); paint(); }
pane0.addEventListener("click", e => {
  const s = e.target.closest("[data-s]"); if (s) { pickStyle(+s.dataset.s); return; }
  const m = e.target.closest("[data-m]"); if (m) pickMine(+m.dataset.m);
});
const altCol = $("#altCollection");
altCol.addEventListener("click", () => {
  const open = styleSw.hidden;
  styleSw.hidden = !open;
  altCol.setAttribute("aria-expanded", String(open));
});

function addMine(url, label, ai) {
  const item = { url, label, ai: ai || null };
  mine.unshift(item);
  if (mine.length > 6) mine.pop();
  mineEl.innerHTML = mine.map((m, k) => `<button type="button" data-m="${k}" title="${esc(m.label)}" aria-label="${esc(m.label)}" style="background-image:url(${m.url})"></button>`).join("");
  $("#mineWrap").hidden = false;
  st.custom = item;
  markSelection();
  paint();
  if (small()) $(".preview").scrollIntoView({ behavior: "smooth", block: "start" });
}

const note = $("#upNote");
function readImage(input, done) {
  const f = input.files && input.files[0];
  input.value = "";
  if (!f) return;
  if (!/^image\//.test(f.type)) { note.textContent = "Lütfen PNG, JPG, WEBP ya da SVG biçiminde bir görsel seçin."; return; }
  if (f.size > 10 * 1024 * 1024) { note.textContent = "Görsel 10 MB'tan küçük olmalı."; return; }
  const r = new FileReader();
  r.onload = () => { note.textContent = ""; done(r.result); };
  r.onerror = () => { note.textContent = "Görsel okunamadı, başka bir dosya deneyin."; };
  r.readAsDataURL(f);
}
$("#upDesign").addEventListener("change", e => readImage(e.target, url => addMine(url, "Yüklediğiniz görsel")));
$("#upLogo").addEventListener("change", e => readImage(e.target, url => {
  st.logo = url;
  $("#logoLabel").textContent = "Logoyu değiştirin";
  $("#logoClear").hidden = false;
  paint();
}));
$("#logoClear").addEventListener("click", () => {
  st.logo = null;
  $("#logoLabel").textContent = "Logo ekleyin";
  $("#logoClear").hidden = true;
  paint();
});

// ---------- yapay zekâ desen taslağı ----------
const aiIn = $("#aiPrompt"), aiGo = $("#aiGo"), aiNote = $("#aiNote"), AI_NOTE = aiNote.textContent;
const aiLabel = aiGo.innerHTML;
$("#aiIdeas").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { aiIn.value = b.textContent; aiIn.focus(); } });
aiIn.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); aiGo.click(); } });
aiGo.addEventListener("click", async () => {
  const prompt = aiIn.value.trim();
  aiNote.classList.remove("err");
  if (prompt.length < 3) { aiNote.textContent = "Lütfen istediğiniz deseni birkaç kelimeyle anlatın."; aiNote.classList.add("err"); aiIn.focus(); return; }
  const hasTs = window.turnstile && document.querySelector(".cf-turnstile");
  aiGo.disabled = true; aiGo.textContent = "Hazırlanıyor…";
  aiNote.textContent = "Deseniniz tasarlanıyor, bu 10–20 saniye sürebilir.";
  $(".preview").classList.add("busy");
  try {
    const r = await fetch("/api/desen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, token: hasTs ? window.turnstile.getResponse() : "", colors: `${st.body[0]} ve ${st.ink[0]}` })
    });
    const type = r.headers.get("Content-Type") || "";
    if (!type.includes("json")) throw new Error(`Sunucuya ulaşılamadı (${r.status}). Sayfayı yenileyip tekrar deneyin.`);
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.image) throw new Error((d.error || "Desen şu anda oluşturulamadı. Biraz sonra tekrar deneyin.") + (d.code ? ` [${d.code}]` : ` [${r.status}]`) + (d.detail ? ` — ${d.detail}` : ""));
    addMine(d.image, `Yapay zekâ: ${prompt}`, prompt);
    $("#aiLeft").textContent = `Bugün kalan: ${d.remaining}`;
    aiNote.textContent = "Taslak kutuya uygulandı. Beğenmezseniz tarifi değiştirip yeniden oluşturun.";
  } catch (err) {
    aiNote.textContent = err.message || AI_NOTE;
    aiNote.classList.add("err");
  } finally {
    aiGo.disabled = false; aiGo.innerHTML = aiLabel;
    $(".preview").classList.remove("busy");
    if (hasTs) window.turnstile.reset();
  }
});

const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v * k)));
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join("");
};
const textIn = $("#s-text");
const attr = (sel, k, v) => $(sel).setAttribute(k, v);
const styleName = () => st.custom ? (st.custom.ai ? "Yapay zekâ taslağı" : "Yüklediğiniz görsel") : st.style[1];

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

  $("#cKat").textContent = `${st.kat} KATLI`;
  $("#cYaprak").textContent = st.yaprak;
  $("#dims").textContent = `${sizeLabel(st.size)} · ${st.kat} katlı · ${st.yaprak} yaprak`;
  $("#pvStyle").textContent = styleName();

  // hazır desenlerin üzerinde logo zaten basılıdır
  const plain = !st.custom && st.style[0] === "duz";
  const ready = !st.custom && !plain;
  const src = st.custom ? st.custom.url : plain ? "" : `/img/stil/${st.style[0]}.webp`;
  attr("#cPat", "href", src);
  attr("#cPat", "visibility", src ? "visible" : "hidden");
  attr("#cPat", "preserveAspectRatio", st.custom ? "xMidYMid slice" : "none");
  // desen kapağı ve kapak kenarını da kaplar; kapak gövdeden ayrı renkte kalmaz
  ["#cPatRim", "#cPatLid"].forEach(q => {
    attr(q, "href", src);
    attr(q, "visibility", src ? "visible" : "hidden");
    attr(q, "preserveAspectRatio", st.custom ? "xMidYMid slice" : "none");
  });
  attr("#cLidLight", "visibility", src ? "visible" : "hidden");
  attr("#cLabel", "fill", src ? (st.ink[1] === "#1b1b1e" ? "#f5efe0" : shade(st.body[1], 0.85)) : "none");
  attr("#cWaves", "visibility", plain ? "visible" : "hidden");
  attr("#cIcons", "visibility", plain ? "visible" : "hidden");
  attr("#cLogo", "href", st.logo || "");
  attr("#cLogo", "visibility", st.logo ? "visible" : "hidden");
  attr("#cText", "visibility", ready || st.logo ? "hidden" : "visible");
  // kendi ya da yapay zekâ deseninde yazı, orijinal kutulardaki gibi koyu bir etiketin içinde durur
  const badge = !!st.custom && !st.logo;
  attr("#cBadge", "visibility", badge ? "visible" : "hidden");
  if (badge) {
    const bb = $("#cText").getBBox();
    const px = bb.height * 0.32, py = bb.height * 0.12;
    attr("#cBadge", "x", String(bb.x - px)); attr("#cBadge", "y", String(bb.y + py));
    attr("#cBadge", "width", String(bb.width + 2 * px)); attr("#cBadge", "height", String(bb.height - py * 0.6));
    attr("#cBadge", "rx", String(bb.height * 0.28));
    attr("#cBadge", "fill", st.ink[1] === "#1b1b1e" ? "#f5efe0" : shade(st.body[1], 0.85));
  }
  if (wizStep === panes.length - 1) summary();
}
textIn.addEventListener("input", paint);

function choices() {
  return [
    ["Desen", st.custom ? (st.custom.ai ? `Yapay zekâ taslağı — “${st.custom.ai}”` : "Kendi görselimiz (dosyayı ayrıca ileteceğiz)") : st.style[1]],
    [st.style[0] === "duz" && !st.custom ? "Kutu rengi" : "Kapak rengi", st.body[0]],
    ["Baskı rengi", st.ink[0]],
    ["Kutu boyu", sizeLabel(st.size)],
    ["Peçete", `${st.kat} katlı, ${st.yaprak} yaprak`],
    [st.logo ? "Logo" : "Kutu yazısı", st.logo ? "Kendi logomuz (dosyayı ayrıca ileteceğiz)" : (textIn.value.trim() || "Solingo")],
    ["Tahmini adet", st.adet],
    ["Paketleme", st.paket]
  ];
}
const esc = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function summary() {
  $("#summary").innerHTML = choices().map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
}
paint();
go(0);

$("#useDesign").addEventListener("click", () => {
  prefill(["Özel üretim için teklif almak istiyoruz.", ...choices().map(([k, v]) => `${k}: ${v}`)].join("\n"));
});

function prefill(text) {
  const m = $("#f-mesaj");
  m.value = text;
  m.classList.remove("invalid");
  $("#formOk").hidden = true;
  $("#iletisim").scrollIntoView({ behavior: "smooth" });
  if (!touch) setTimeout(() => $("#f-ad").focus({ preventScroll: true }), 700);
}

// ---------- form ----------
const form = $("#form"), err = $("#formErr"), sendB = $("#formSend");
const touch = matchMedia("(hover: none)").matches;
const fields = () => Object.fromEntries(new FormData(form).entries());
form.addEventListener("submit", async e => {
  e.preventDefault();
  const req = [...form.querySelectorAll("[required]")];
  const bad = req.filter(f => !f.value.trim());
  const mail = form.elements.eposta, tel = form.elements.tel;
  const noContact = !mail.value.trim() && !tel.value.trim();
  const badMail = mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim());
  req.forEach(f => f.classList.toggle("invalid", bad.includes(f)));
  mail.classList.toggle("invalid", !!badMail || noContact);
  tel.classList.toggle("invalid", noContact);
  if (bad.length || noContact || badMail) {
    err.textContent = bad.length ? "Ad, firma ve mesaj alanlarını doldurun."
      : badMail ? "E-posta adresini kontrol edin." : "Telefon ya da e-posta adresinizi yazın.";
    // dokunmatik ekranda klavye açılıp sayfayı kaydırmasın diye yalnızca masaüstünde odaklanılır
    if (!touch) (bad[0] || (badMail ? mail : tel)).focus({ preventScroll: true });
    return;
  }
  err.textContent = "";
  sendB.disabled = true; sendB.textContent = "Gönderiliyor…";
  try {
    const r = await fetch("/api/teklif", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields()) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) throw new Error(d.error || "Talebiniz gönderilemedi. Lütfen tekrar deneyin ya da bizi arayın.");
    document.activeElement?.blur();
    $("#formOk").hidden = false;
    form.reset();
  } catch (ex) {
    err.textContent = ex.message;
  } finally {
    sendB.disabled = false; sendB.textContent = "Formu Gönder";
  }
});
$("#formAgain").addEventListener("click", () => { $("#formOk").hidden = true; if (!touch) $("#f-ad").focus({ preventScroll: true }); });
form.addEventListener("input", e => {
  if (e.target.value.trim()) e.target.classList.remove("invalid");
  if (err.textContent && !form.querySelector(".invalid")) err.textContent = "";
});

// ---------- tasarım örnekleri şeridi ve teknik bilgiler ----------
const arches = $("#arches");
document.querySelector(".strip-nav").addEventListener("click", e => {
  const b = e.target.closest("[data-dir]"); if (!b) return;
  arches.scrollBy({ left: +b.dataset.dir * arches.clientWidth * 0.75, behavior: "smooth" });
});
// telefonda teknik tablo kapalı başlar, dokununca açılır
if (matchMedia("(max-width: 600px)").matches) $("#specs").open = false;

// ---------- menü ve giriş animasyonu ----------
const nav = $("#nav");
const navT = $("#navToggle"), mnav = $("#mnav");
function menu(open) {
  nav.classList.toggle("open", open);
  mnav.hidden = !open;
  navT.setAttribute("aria-expanded", String(open));
  navT.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
}
navT.addEventListener("click", () => menu(mnav.hidden));
mnav.addEventListener("click", e => { if (e.target.closest("a")) menu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !mnav.hidden) { menu(false); navT.focus(); } });
document.addEventListener("click", e => { if (!mnav.hidden && !e.target.closest("#nav")) menu(false); });
window.addEventListener("resize", () => { if (!mnav.hidden && innerWidth > 820) menu(false); });
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
