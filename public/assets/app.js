(() => {
  "use strict";

  const PHONE = "905327012100";
  const EMAIL = "i.yldz2106@gmail.com";
  const IMG = "assets/img/g/";
  const $ = s => document.querySelector(s);

  const GROUPS = { duz: "Signature", cicek: "Çiçek", geo: "Geometrik" };
  const DESIGNS = [
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

  // ---------- koleksiyon ----------
  const grid = $("#grid"), filters = $("#filters");
  grid.innerHTML = DESIGNS.map((d, i) => `
    <button type="button" class="card" data-i="${i}" data-g="${d.g}" aria-label="${d.name} desenini büyüt">
      <span class="ph"><img src="${IMG}${d.id}-md.webp" alt="Solingo ${d.name}" width="800" height="800" loading="lazy"></span>
      <span class="nm"><b>${d.name}</b><small>${GROUPS[d.g]}</small></span>
    </button>`).join("") + `
    <a class="card cta" href="#ozel">
      <span class="ph"><span class="cta-in"><em>Size özel</em><b>renk ve desen</b><small>Kurumsal renklerinizle üretim →</small></span></span>
      <span class="nm"><b>Özel Üretim</b><small>Siparişe özel</small></span>
    </a>`;
  // son satırdaki boşluğu "Size özel" kartı doldurur
  const cta = grid.querySelector(".cta");
  function fitCta() {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const rem = cols - (visible.length % cols);
    cta.style.gridColumn = `span ${rem === 0 ? cols : rem}`;
    const ph = grid.querySelector(".card:not([hidden]):not(.cta) .ph");
    if (ph) cta.style.setProperty("--h", ph.offsetHeight + "px");
  }
  window.addEventListener("resize", fitCta);
  const tabs = [["all", "Tümü", DESIGNS.length], ...Object.entries(GROUPS).map(([k, v]) => [k, v, DESIGNS.filter(d => d.g === k).length])];
  filters.innerHTML = tabs.map(([k, v, n]) => `<button type="button" class="filter" data-f="${k}" aria-pressed="${k === "all"}">${v} <small>${n}</small></button>`).join("");
  let visible = DESIGNS.map((_, i) => i);
  filters.addEventListener("click", e => {
    const b = e.target.closest("[data-f]"); if (!b) return;
    const f = b.dataset.f;
    filters.querySelectorAll(".filter").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    visible = [];
    grid.querySelectorAll(".card:not(.cta)").forEach(c => {
      const on = f === "all" || c.dataset.g === f;
      c.hidden = !on;
      if (on) visible.push(+c.dataset.i);
    });
    fitCta();
  });

  // ---------- büyük görsel ----------
  const lb = $("#lb"), lbImg = $("#lbImg"), lbName = $("#lbName");
  let cur = 0;
  function show(i) {
    cur = i; const d = DESIGNS[i];
    lbImg.src = `${IMG}${d.id}.webp`; lbImg.alt = `Solingo ${d.name}`; lbName.textContent = d.name;
  }
  function step(dir) {
    const k = visible.indexOf(cur);
    show(visible[(k + dir + visible.length) % visible.length]);
  }
  grid.addEventListener("click", e => {
    const c = e.target.closest("button[data-i]"); if (!c) return;
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
  const BODY = [
    ["Lacivert", "#1d2547"], ["Bordo", "#5e1d29"], ["Siyah", "#1b1b1e"], ["Antrasit", "#3b4049"],
    ["Orman Yeşili", "#1f4436"], ["Gri Mavi", "#8ea8aa"], ["Kum", "#c8b597"], ["Krem", "#efe8d8"]
  ];
  const INK = [["Altın", "#d2bc86"], ["Gümüş", "#c9ccd3"], ["Beyaz", "#ffffff"], ["Siyah", "#1b1b1e"]];
  const st = { body: BODY[0], ink: INK[0] };
  function swatches(el, list, key) {
    el.innerHTML = list.map(([n, c], i) => `<button type="button" style="--c:${c}" data-i="${i}" aria-label="${n}" aria-pressed="${i === 0}"></button>`).join("") +
      `<span class="sw-name" aria-live="polite">${list[0][0]}</span>`;
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-i]"); if (!b) return;
      st[key] = list[+b.dataset.i];
      el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      el.querySelector(".sw-name").textContent = st[key][0];
      paint();
    });
  }
  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.min(255, Math.round(v * k)));
    return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join("");
  };
  const textIn = $("#s-text");
  function paint() {
    const b = st.body[1], ink = st.ink[1];
    $("#cBody").setAttribute("fill", b);
    $("#cRim").setAttribute("fill", b);
    $("#cLid").setAttribute("fill", shade(b, 1.12));
    ["#cText", "#cLidText"].forEach(s => $(s).setAttribute("fill", ink));
    $("#cIcons").setAttribute("fill", ink);
    $("#cWaves").setAttribute("stroke", ink);
    $("#cLabel").setAttribute("stroke", ink);
    const t = textIn.value.trim() || "Solingo";
    $("#cText").textContent = t;
    $("#cLidText").textContent = t;
    const len = [...t].length;
    $("#cText").setAttribute("font-size", String(Math.min(46, Math.round(300 / Math.max(len, 1)))));
    $("#cLidText").setAttribute("font-size", String(Math.min(13, Math.round(86 / Math.max(len, 1)))));
  }
  swatches($("#bodySw"), BODY, "body");
  swatches($("#inkSw"), INK, "ink");
  textIn.addEventListener("input", paint);
  paint();

  $("#useDesign").addEventListener("click", () => {
    prefill([
      "Özel üretim için teklif almak istiyoruz.",
      `Kutu rengi: ${st.body[0]}`,
      `Baskı rengi: ${st.ink[0]}`,
      `Kutu üzerindeki yazı: ${textIn.value.trim() || "Solingo"}`,
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
      const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
      const w = window.open(url, "_blank");
      if (w) w.opener = null; else location.href = url;
    } else {
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Solingo teklif talebi — " + v.firma)}&body=${encodeURIComponent(text)}`;
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

  fitCta();
  window.addEventListener("load", fitCta);
  $("#year").textContent = new Date().getFullYear();
})();
