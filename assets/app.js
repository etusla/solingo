(() => {
  "use strict";

  // Teklif e-postasının gönderileceği adres. Boş bırakılırsa e-posta uygulaması alıcısız açılır.
  const CONFIG = { email: "i.yldz2106@gmail.com" };

  const IMG = "assets/img/";

  const SERIES = {
    botanik:   { name: "Botanik Seri",  short: "Botanik",   desc: "Ayçiçeğinden hibiskusa, doğanın en canlı halleri." },
    sanat:     { name: "Sanat Seri",    short: "Sanat",     desc: "Suluboya ve yağlı boya dokularıyla tuvalden kutuya." },
    motif:     { name: "Motif Seri",    short: "Motif",     desc: "Mozaik, retro ve geometrik desenlerle modern bir dil." },
    signature: { name: "Signature",     short: "Signature", desc: "Lacivert ve altın; markanın imza tasarımı." }
  };

  const MOMENTS = {
    arac:     { name: "Araç İçi",       text: "Bardaklığa tam oturur; trafikte, otoparkta, yolda hep elinizin altında.", icon: '<path d="M5 20l2.5-7.2A3 3 0 0 1 10.3 11h11.4a3 3 0 0 1 2.8 1.8L27 20"/><rect x="3" y="20" width="26" height="7" rx="2"/><circle cx="9" cy="27" r="2.4"/><circle cx="23" cy="27" r="2.4"/><path d="M8 23.5h2M22 23.5h2"/>' },
    mutfak:   { name: "Mutfak",         text: "Tezgâhın köşesinde şık bir dokunuş; yemek hazırlarken ve sofrada hazır.", icon: '<path d="M6 14h20v8a6 6 0 0 1-6 6h-8a6 6 0 0 1-6-6z"/><path d="M3 16h3M26 16h3M11 10c0-2 2-2 2-4M16 10c0-2 2-2 2-4M21 10c0-2 2-2 2-4"/>' },
    ofis:     { name: "Ofis",           text: "Masanızda dağınıklık yaratmaz; toplantı odasında da şık durur.", icon: '<rect x="4" y="7" width="24" height="15" rx="2"/><path d="M2 26h28M13 22l-1 4M19 22l1 4"/>' },
    film:     { name: "Film Gecesi",    text: "Duygusal sahneler için 3 kat yumuşaklık. Ağlamak serbest, mendil hazır.", icon: '<path d="M8 12h16l-2 16H10z"/><path d="M8 12c-1-3 2-5 4-4 0-3 4-4 5-2 1-2 5-1 5 2 2-1 4 1 3 4"/><path d="M13 16l1 10M19 16l-1 10"/>' },
    hastalik: { name: "Hasta Günler",   text: "Grip, nezle, uzun geceler. Bambu lifi burnunuzu tahriş etmeden yanınızda.", icon: '<path d="M14 5a3 3 0 0 1 6 0v13a6 6 0 1 1-6 0z"/><circle cx="17" cy="23" r="2.5"/><path d="M17 20.5V11"/>' },
    hastane:  { name: "Hastane & Refakat", text: "Hasta odası, refakatçi koltuğu, bekleme salonu. Sakin tasarımlar, temiz bir his.", icon: '<rect x="5" y="5" width="22" height="22" rx="5"/><path d="M16 10v12M10 16h12"/>' },
    yolculuk: { name: "Yolculuk",       text: "Uçakta, otobüste, trende. Çantanıza sığar, kapağı içeriği korur.", icon: '<rect x="6" y="10" width="20" height="16" rx="3"/><path d="M12 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M6 17h20M11 26v2M21 26v2"/>' },
    kafe:     { name: "Kafe & Restoran", text: "Masada, paket serviste ve kurye siparişinde markanıza eşlik eden detay.", icon: '<path d="M6 12h16v8a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z"/><path d="M22 14h2.5a3.5 3.5 0 0 1 0 7H21M4 29h20M11 4c0 2-2 2-2 4M16 4c0 2-2 2-2 4"/>' }
  };

  const DESIGNS = [
    { id: "signature",      name: "Signature Lacivert", series: "signature", colors: ["#1d2547", "#d4c08f", "#f1ead8"], moments: ["arac", "ofis", "hastane", "kafe"],
      desc: "Mat lacivert zemin, altın tonlu dalga çizgileri ve zarif serif logo. Solingo'nun imza tasarımı; kurumsal ortamların ilk tercihi." },
    { id: "aycicegi",       name: "Ayçiçeği Bahçesi",   series: "botanik",   colors: ["#1e2440", "#f2b31d", "#e8862a", "#4aa0d8"], moments: ["mutfak", "yolculuk", "kafe"],
      desc: "Gece mavisi zeminde güneş sarısı ayçiçekleri ve rengârenk kır çiçekleri. Enerjik, sıcak ve neşeli." },
    { id: "tropik",         name: "Tropik Hibiskus",    series: "botanik",   colors: ["#1b2347", "#ef4b4b", "#f58ab0", "#3fa65a"], moments: ["arac", "yolculuk", "kafe"],
      desc: "Hibiskus, monstera ve palmiye yaprakları. Yazın ve tatil yollarının ruhu kutuda." },
    { id: "gelincik",       name: "Gelincik Tarlası",   series: "botanik",   colors: ["#16181c", "#d8322b", "#2f5fc4", "#f2c230"], moments: ["film", "mutfak", "kafe"],
      desc: "Kırmızı, mavi ve sarı gelincikler; koyu zeminde yüksek kontrastlı, cesur bir duruş." },
    { id: "kir-cicekleri",  name: "Kır Çiçekleri",      series: "botanik",   colors: ["#1f4436", "#f2c230", "#e0502f", "#8fb7e8"], moments: ["mutfak", "hastalik", "hastane"],
      desc: "Orman yeşili zeminde minik kır çiçekleri. Doğal, sakin ve zamansız bir botanik." },
    { id: "suluboya",       name: "Suluboya Esintisi",  series: "sanat",     colors: ["#ffffff", "#e8459a", "#f5822a", "#3a63d6"], moments: ["film", "hastane", "ofis"],
      desc: "Beyaz zemin üzerinde serbest fırça darbeleri ve renk sıçramaları. Ferah, aydınlık ve sanatsal." },
    { id: "pastel-bahce",   name: "Pastel Bahçe",       series: "sanat",     colors: ["#f27fae", "#54cfd0", "#f7d53b", "#fbe3ec"], moments: ["film", "hastalik", "mutfak"],
      desc: "Pembe, turkuaz ve sarı tonlarında yağlı boya dokulu çiçekler. Yumuşak, romantik ve iç açıcı." },
    { id: "mozaik",         name: "Çiçek Mozaiği",      series: "motif",     colors: ["#53bfc7", "#f08a3c", "#ef6f92", "#86b85a"], moments: ["kafe", "ofis", "yolculuk"],
      desc: "Yüzlerce renkli parçadan oluşan, çini esintili mozaik çiçek deseni." },
    { id: "retro",          name: "Retro 70'ler",       series: "motif",     colors: ["#f6ecd9", "#f0712b", "#3364c8", "#9a6cc8"], moments: ["kafe", "mutfak", "film"],
      desc: "Krem zeminde turuncu, mavi ve mor papatyalar. Nostaljik, eğlenceli ve bir o kadar şık." },
    { id: "geometrik-mint", name: "Mint Geometri",      series: "motif",     colors: ["#9fb7b5", "#e9e3d3", "#7f9b98"], moments: ["hastane", "ofis", "hastalik"],
      desc: "Mint ve krem tonlarında iç içe kareler. Sakin, minimal; klinik ve kurumsal ortamlara uyumlu." },
    { id: "geometrik-sari", name: "Sarı Geometri",      series: "motif",     colors: ["#f5d22c", "#ffffff", "#141414"], moments: ["arac", "ofis", "yolculuk"],
      desc: "Canlı sarı ve beyaz geometrik bloklar. Modern, dinamik ve uzaktan bile fark edilir." }
  ];

  const byId = Object.fromEntries(DESIGNS.map(d => [d.id, d]));
  const $ = (s, r = document) => r.querySelector(s);
  const thumb = id => `<i class="th" style="background-image:url(${IMG}${id}-sm.webp)" aria-hidden="true"></i>`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- selection store ----------
  const KEY = "solingo-secki";
  let picked = [];
  try { picked = JSON.parse(localStorage.getItem(KEY) || "[]").filter(id => byId[id]); } catch (e) { picked = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(picked)); } catch (e) { /* depolama kapalı */ } };
  const isPicked = id => picked.includes(id);
  function toggle(id) {
    picked = isPicked(id) ? picked.filter(x => x !== id) : [...picked, id];
    save();
    syncSelection();
  }

  // ---------- state ----------
  const state = { series: "all", moment: null };
  let visible = DESIGNS.slice();

  // ---------- filters ----------
  const filters = $("#filters");
  const tabs = [["all", "Tümü", DESIGNS.length], ...Object.entries(SERIES).map(([k, v]) => [k, v.short, DESIGNS.filter(d => d.series === k).length])];
  filters.innerHTML = tabs.map(([k, label, n]) =>
    `<button type="button" class="filter" role="tab" data-series="${k}" aria-selected="${k === "all"}">${label} <small>${n}</small></button>`).join("");
  filters.addEventListener("click", e => {
    const b = e.target.closest("[data-series]");
    if (!b) return;
    state.series = b.dataset.series;
    render();
  });

  // ---------- grid ----------
  const grid = $("#grid");
  function render() {
    filters.querySelectorAll(".filter").forEach(b => b.setAttribute("aria-selected", String(b.dataset.series === state.series)));
    visible = DESIGNS.filter(d =>
      (state.series === "all" || d.series === state.series) &&
      (!state.moment || d.moments.includes(state.moment)));

    const banner = $("#momentBanner");
    if (state.moment) {
      banner.hidden = false;
      $("#momentBannerText").textContent = `“${MOMENTS[state.moment].name}” anı için önerilen ${visible.length} tasarım`;
    } else banner.hidden = true;

    if (!visible.length) {
      grid.innerHTML = `<p class="picked"><span class="empty">Bu seri ve an kombinasyonunda tasarım yok. Filtreyi temizleyerek tüm koleksiyonu görebilirsiniz.</span></p>`;
      return;
    }
    grid.innerHTML = visible.map((d, i) => `
      <article class="card" style="animation-delay:${i * 45}ms">
        <span class="badge">${SERIES[d.series].short}</span>
        <button type="button" class="card-media" data-open="${d.id}" aria-label="${esc(d.name)} tasarımını büyüt">
          <img src="${IMG}${d.id}-sm.webp" alt="Solingo ${esc(d.name)} tasarımı" width="600" height="600" loading="lazy">
          <span class="zoom">İncele</span>
        </button>
        <div class="card-body">
          <h3>${esc(d.name)}</h3>
          <p>${esc(d.desc.split(".")[0])}.</p>
          <div class="card-foot">
            <span class="dots" aria-hidden="true">${d.colors.map(c => `<i style="background:${c}"></i>`).join("")}</span>
            <button type="button" class="add" data-add="${d.id}" aria-pressed="${isPicked(d.id)}">${isPicked(d.id) ? "✓ Seçkide" : "+ Seçkiye Ekle"}</button>
          </div>
        </div>
      </article>`).join("");
  }
  grid.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) { toggle(add.dataset.add); return; }
    const open = e.target.closest("[data-open]");
    if (open) openLb(open.dataset.open);
  });

  $("#clearMoment").addEventListener("click", () => { state.moment = null; render(); });

  // ---------- series overview ----------
  $("#seriesGrid").innerHTML = Object.entries(SERIES).map(([k, s]) => {
    const items = DESIGNS.filter(d => d.series === k);
    return `<button type="button" class="series reveal${k === "signature" ? " sig" : ""}" data-goseries="${k}">
      <span class="thumbs">${items.map(d => thumb(d.id)).join("")}</span>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <span class="go">${items.length} tasarımı gör →</span>
    </button>`;
  }).join("");
  $("#seriesGrid").addEventListener("click", e => {
    const b = e.target.closest("[data-goseries]");
    if (!b) return;
    state.series = b.dataset.goseries; state.moment = null;
    render();
    $("#filters").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- moments ----------
  $("#moments").innerHTML = Object.entries(MOMENTS).map(([k, m]) => {
    const recs = DESIGNS.filter(d => d.moments.includes(k));
    return `<button type="button" class="moment reveal" data-moment="${k}">
      <svg viewBox="0 0 32 32" aria-hidden="true">${m.icon}</svg>
      <h3>${m.name}</h3>
      <p>${m.text}</p>
      <span class="recs"><span>${recs.slice(0, 4).map(d => thumb(d.id)).join("")}</span><b>${recs.length} öneri →</b></span>
    </button>`;
  }).join("");
  $("#moments").addEventListener("click", e => {
    const b = e.target.closest("[data-moment]");
    if (!b) return;
    state.moment = b.dataset.moment; state.series = "all";
    render();
    $("#filters").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- lightbox ----------
  const lb = $("#lb");
  let lbId = null;
  function fillLb(id) {
    const d = byId[id]; lbId = id;
    const img = $("#lbImg");
    img.src = `${IMG}${d.id}.webp`;
    img.alt = `Solingo ${d.name} tasarımı`;
    $("#lbSeries").textContent = SERIES[d.series].name;
    $("#lbTitle").textContent = d.name;
    $("#lbDesc").textContent = d.desc;
    $("#lbSwatch").innerHTML = d.colors.map(c => `<i style="background:${c}" title="${c}"></i>`).join("");
    $("#lbMoments").innerHTML = d.moments.map(m => `<span>${MOMENTS[m].name}</span>`).join("");
    syncLbBtn();
  }
  function syncLbBtn() {
    if (!lbId) return;
    const b = $("#lbAdd"), on = isPicked(lbId);
    b.textContent = on ? "✓ Seçkide — Çıkar" : "Seçkiye Ekle";
    b.className = on ? "btn btn-gold btn-block" : "btn btn-navy btn-block";
  }
  function openLb(id) {
    fillLb(id);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    if (typeof lb.close === "function") lb.close(); else lb.removeAttribute("open");
  }
  function step(dir) {
    const list = visible.length ? visible : DESIGNS;
    let i = list.findIndex(d => d.id === lbId);
    if (i < 0) i = 0;
    fillLb(list[(i + dir + list.length) % list.length].id);
  }
  lb.addEventListener("close", () => { document.body.style.overflow = ""; });
  lb.addEventListener("click", e => {
    if (e.target === lb || e.target.closest("[data-close]")) closeLb();
    else if (e.target.closest("[data-prev]")) step(-1);
    else if (e.target.closest("[data-next]")) step(1);
  });
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  $("#lbAdd").addEventListener("click", () => toggle(lbId));

  // ---------- selection UI ----------
  function syncSelection() {
    document.querySelectorAll("[data-count]").forEach(el => {
      el.textContent = picked.length;
      if (el.classList.contains("count")) el.hidden = picked.length === 0;
    });
    grid.querySelectorAll("[data-add]").forEach(b => {
      const on = isPicked(b.dataset.add);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Seçkide" : "+ Seçkiye Ekle";
    });
    syncLbBtn();
    $("#dockThumbs").innerHTML = picked.slice(-4).map(thumb).join("");
    updateDock();
    $("#picked").innerHTML = picked.length
      ? picked.map(id => { const d = byId[id]; return `<div class="pick">${thumb(id)}<div><b>${esc(d.name)}</b><small>${SERIES[d.series].name}</small></div><button type="button" data-remove="${id}" aria-label="${esc(d.name)} seçkiden çıkar">✕</button></div>`; }).join("")
      : `<div class="empty">Seçkiniz henüz boş. <a href="#koleksiyon">Koleksiyondan</a> tasarım ekleyin ya da formu doğrudan doldurun.</div>`;
  }
  $("#picked").addEventListener("click", e => {
    const b = e.target.closest("[data-remove]");
    if (b) toggle(b.dataset.remove);
  });

  // dock: seçki varken ve teklif bölümü görünmüyorken göster
  const dock = $("#dock");
  let quoteVisible = false;
  function updateDock() { dock.hidden = picked.length === 0 || quoteVisible; }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { quoteVisible = en.isIntersecting; updateDock(); }, { threshold: 0.15 }).observe($("#teklif"));
  }

  // ---------- form ----------
  const form = $("#quoteForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const err = $("#formErr"), ok = $("#formOk");
    ok.hidden = true;
    let bad = [];
    form.querySelectorAll("[required]").forEach(f => {
      const invalid = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.classList.toggle("invalid", invalid);
      if (invalid) bad.push(f);
    });
    if (bad.length) {
      err.textContent = "Lütfen işaretli alanları eksiksiz doldurun.";
      err.hidden = false;
      bad[0].focus();
      return;
    }
    err.hidden = true;
    const v = Object.fromEntries(new FormData(form).entries());
    const lines = [
      "Merhaba Solingo,", "",
      "Kurumsal teklif talebimizi aşağıda iletiyoruz.", "",
      `Firma: ${v.firma}`, `Yetkili: ${v.yetkili}`, `E-posta: ${v.eposta}`, `Telefon: ${v.telefon || "-"}`,
      `Sektör: ${v.sektor}`, `Tahmini adet: ${v.adet}`, "",
      "Seçilen tasarımlar:",
      ...(picked.length ? picked.map(id => `• ${byId[id].name} (${SERIES[byId[id].series].name})`) : ["• Henüz seçim yapılmadı"]),
      "", `Not: ${v.not || "-"}`
    ];
    const href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`Solingo Teklif Talebi — ${v.firma}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
    ok.hidden = false;
  });
  form.addEventListener("input", e => { if (e.target.classList.contains("invalid") && e.target.value.trim()) e.target.classList.remove("invalid"); });

  // ---------- nav ----------
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  }
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });

  // ---------- hero rotator ----------
  const slides = [...document.querySelectorAll("#heroRotator img")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (slides.length > 1 && !reduce) {
    let k = 0;
    setInterval(() => {
      if (document.hidden) return;
      slides[k].classList.remove("on");
      k = (k + 1) % slides.length;
      slides[k].classList.add("on");
    }, 3800);
  }

  // ---------- reveal ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add("in"));

  $("#year").textContent = new Date().getFullYear();

  render();
  syncSelection();
})();
