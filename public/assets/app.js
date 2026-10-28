(() => {
  "use strict";

  const PHONE = "905327012100";
  const EMAIL = "i.yldz2106@gmail.com";
  const IMG = "assets/img/g/";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = () => window.SolingoStage;

  const DESIGNS = [
    { id: "signature",      name: "Signature Lacivert" },
    { id: "tropik",         name: "Tropik" },
    { id: "aycicegi",       name: "Ayçiçeği" },
    { id: "gelincik",       name: "Gelincik" },
    { id: "kir-cicekleri",  name: "Kır Çiçekleri" },
    { id: "suluboya",       name: "Suluboya" },
    { id: "pastel-bahce",   name: "Pastel Bahçe" },
    { id: "mozaik",         name: "Mozaik" },
    { id: "retro",          name: "Retro" },
    { id: "geometrik-mint", name: "Mint Geometri" },
    { id: "geometrik-sari", name: "Sarı Geometri" }
  ];
  const nameOf = id => DESIGNS.find(d => d.id === id).name;

  const MOMENTS = [
    { name: "Araç İçi",     line: "Yollarda",          design: "tropik",         bg: "#0f2238" },
    { name: "Mutfak",       line: "Sofrada",           design: "kir-cicekleri",  bg: "#15362c" },
    { name: "Ofis",         line: "Mesaide",           design: "geometrik-mint", bg: "#24343d" },
    { name: "Film Gecesi",  line: "Ağlarken",          design: "suluboya",       bg: "#1e1442" },
    { name: "Hasta Günler", line: "Hapşırınca",        design: "pastel-bahce",   bg: "#3a2134" },
    { name: "Hastane",      line: "Zor günde",         design: "aycicegi",       bg: "#16303b" },
    { name: "Yolculuk",     line: "Her yolculukta",    design: "gelincik",       bg: "#2c1820" }
  ];
  const BASE_BG = "#141a35";

  // ---------- harf harf bölme ----------
  function split(el) {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            [...part].forEach(ch => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; w.appendChild(s); });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
  }
  document.querySelectorAll(".split").forEach(split);

  // ---------- an kelimeleri ----------
  const words = document.getElementById("words");
  const ticks = document.getElementById("ticks");
  words.innerHTML = MOMENTS.map((m, i) => `<p class="word${i === 0 ? " on" : ""}" data-i="${i}">${m.line} <em>yanında.</em></p>`).join("");
  ticks.innerHTML = MOMENTS.map((m, i) => `<li class="${i === 0 ? "on" : ""}">${m.name}</li>`).join("");
  words.querySelectorAll(".word").forEach(split);
  words.querySelectorAll(".word").forEach(w => w.querySelectorAll(".ch").forEach((c, k) => c.style.setProperty("--d", `${k * 35}ms`)));

  // ---------- galeri ----------
  const grid = document.getElementById("grid");
  grid.innerHTML = DESIGNS.map((d, i) => `
    <button type="button" class="card" data-i="${i}" aria-label="${d.name} desenini büyüt">
      <span class="ph"><img src="${IMG}${d.id}-md.webp" alt="Solingo ${d.name}" width="800" height="800" loading="lazy"><i class="shine"></i></span>
      <span class="nm">${d.name}</span>
    </button>`).join("") + `
    <a class="card cta" href="#iletisim">
      <span class="ph"><span class="cta-in"><em>Size özel</em><b>desen</b><small>Markanıza özel tasarım için yazın →</small></span><i class="shine"></i></span>
      <span class="nm">Özel Tasarım</span>
    </a>`;

  // 3D eğilme
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    grid.addEventListener("pointermove", e => {
      const c = e.target.closest(".card"); if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
      c.style.setProperty("--ry", `${(x * 16).toFixed(2)}deg`);
      c.style.setProperty("--sx", `${(x + 0.5) * 100}%`);
      c.style.setProperty("--sy", `${(y + 0.5) * 100}%`);
    });
    grid.addEventListener("pointerout", e => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    });
  }

  // ---------- büyük görsel ----------
  const lb = document.getElementById("lb"), lbImg = document.getElementById("lbImg"), lbName = document.getElementById("lbName");
  let cur = 0;
  function show(i) {
    cur = (i + DESIGNS.length) % DESIGNS.length;
    const d = DESIGNS[cur];
    lbImg.src = `${IMG}${d.id}.webp`; lbImg.alt = `Solingo ${d.name}`; lbName.textContent = d.name;
  }
  grid.addEventListener("click", e => {
    const c = e.target.closest("button[data-i]"); if (!c) return;
    show(+c.dataset.i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  });
  lb.addEventListener("click", e => {
    if (e.target === lb || e.target.closest("[data-close]")) lb.close();
    const s = e.target.closest("[data-step]"); if (s) show(cur + +s.dataset.step);
  });
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  // ---------- form ----------
  const form = document.getElementById("form"), err = document.getElementById("formErr");
  let via = "wa";
  form.querySelectorAll("[data-via]").forEach(b => b.addEventListener("click", () => { via = b.dataset.via; }));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const req = [...form.querySelectorAll("[required]")];
    const bad = req.filter(f => !f.value.trim());
    req.forEach(f => f.classList.toggle("invalid", bad.includes(f)));
    if (bad.length) { err.textContent = "Lütfen adınızı ve mesajınızı yazın."; err.hidden = false; bad[0].focus(); return; }
    err.hidden = true;
    const v = Object.fromEntries(new FormData(form).entries());
    const text = [
      "Merhaba, Solingo hakkında bilgi almak istiyorum.", "",
      `Ad Soyad: ${v.ad}`,
      v.firma ? `Firma: ${v.firma}` : "",
      v.tel ? `Telefon: ${v.tel}` : "",
      "", v.mesaj
    ].filter((l, i, a) => l || (a[i - 1] && a[i - 1] !== "")).join("\n");
    if (via === "wa") {
      const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
      const w = window.open(url, "_blank");
      if (w) w.opener = null; else location.href = url;
    } else {
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Solingo — " + (v.firma || v.ad))}&body=${encodeURIComponent(text)}`;
    }
  });
  form.addEventListener("input", e => { if (e.target.value.trim()) e.target.classList.remove("invalid"); });

  // ---------- sahne yönetimi ----------
  const bg = document.getElementById("bg");
  const nowName = document.getElementById("nowName");
  const sections = [...document.querySelectorAll("[data-pose]")];
  let region = null, momentIdx = -1, heroTimer = null, heroK = 0;

  function setBg(color) {
    if (window.gsap) gsap.to(bg, { backgroundColor: color, duration: 1.1, ease: "power2.out", overwrite: true });
    else bg.style.backgroundColor = color;
  }
  function heroCycle() {
    clearInterval(heroTimer);
    const order = DESIGNS.map(d => d.id);
    const tick = () => {
      const id = order[heroK % order.length];
      stage() && stage().setDesign(id);
      nowName.textContent = nameOf(id);
      heroK++;
    };
    tick();
    if (!reduce) heroTimer = setInterval(tick, 3400);
  }
  function setMoment(i) {
    if (i === momentIdx) return;
    momentIdx = i;
    words.querySelectorAll(".word").forEach((w, k) => { w.classList.toggle("on", k === i); w.classList.toggle("past", k < i); });
    ticks.querySelectorAll("li").forEach((t, k) => t.classList.toggle("on", k === i));
    const m = MOMENTS[i];
    stage() && stage().setDesign(m.design);
    setBg(m.bg);
  }
  function enter(name) {
    if (name === region) return;
    region = name;
    stage() && stage().setPose(name);
    if (name === "hero") { heroCycle(); setBg(BASE_BG); }
    else clearInterval(heroTimer);
    if (name === "moments") { momentIdx = -1; }
    if (name === "contact" || name === "outro") { stage() && stage().setDesign("signature"); setBg(BASE_BG); }
    document.body.dataset.region = name;
  }

  const moments = document.getElementById("her-yerde");
  function onScroll() {
    const mid = window.innerHeight * 0.5;
    const s = sections.find(el => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    if (s) enter(s.dataset.pose);
    if (region === "moments") {
      const r = moments.getBoundingClientRect();
      const p = Math.min(0.9999, Math.max(0, -r.top / (r.height - window.innerHeight)));
      setMoment(Math.floor(p * MOMENTS.length));
    }
    document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // sahne hazır olunca başlat
  const boot = () => { region = null; onScroll(); };
  if (stage()) boot(); else window.addEventListener("load", boot);

  // ---------- animasyonlar ----------
  if (window.gsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.from(".hero h1 .ch", { yPercent: 110, opacity: 0, rotate: 8, duration: 0.9, stagger: 0.025 })
      .from(".hero .anim", { y: 26, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.5")
      .from(".nav", { y: -30, opacity: 0, duration: 0.7 }, 0.2);

    document.querySelectorAll(".waves path").forEach((p, i) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.4, delay: 0.3 + i * 0.12, ease: "power2.inOut" });
    });
    gsap.to(".waves", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    document.querySelectorAll(".g-head .split, .contact .split, .outro .split").forEach(h => {
      gsap.from(h.querySelectorAll(".ch"), {
        yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.02, ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 85%" }
      });
    });
    gsap.utils.toArray(".card").forEach((c, i) => {
      gsap.from(c, {
        y: 60, opacity: 0, rotateX: 18, duration: 0.9, ease: "power3.out", delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: c, start: "top 92%" }
      });
    });
    gsap.from(".form, .c-lead, .direct", {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".contact", start: "top 70%" }
    });
  }
})();
