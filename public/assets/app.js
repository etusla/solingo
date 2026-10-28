(() => {
  "use strict";

  const IMG = "assets/img/";

  // tint: kartın zemin rengi
  const DESIGNS = [
    { id: "signature",      name: "Signature Lacivert", tint: "#1d2547", photo: true },
    { id: "tropik",         name: "Tropik",             tint: "#dde8df" },
    { id: "aycicegi",       name: "Ayçiçeği",           tint: "#f3e6c6" },
    { id: "gelincik",       name: "Gelincik",           tint: "#f1d9d3" },
    { id: "kir-cicekleri",  name: "Kır Çiçekleri",      tint: "#dbe5d8" },
    { id: "suluboya",       name: "Suluboya",           tint: "#f2dce6" },
    { id: "pastel-bahce",   name: "Pastel Bahçe",       tint: "#d8eeec" },
    { id: "mozaik",         name: "Mozaik",             tint: "#f3dfcf" },
    { id: "retro",          name: "Retro",              tint: "#e3dcef" },
    { id: "geometrik-mint", name: "Mint Geometri",      tint: "#dfe8e6" },
    { id: "geometrik-sari", name: "Sarı Geometri",      tint: "#f6edc4" }
  ];

  const grid = document.getElementById("grid");
  grid.innerHTML = DESIGNS.map((d, i) => `
    <button type="button" class="card${d.photo ? " sig" : ""}" data-i="${i}" aria-label="${d.name} desenini büyüt">
      <span class="ph" style="--tint:${d.tint}">
        ${d.photo
          ? `<img class="photo" src="${IMG}${d.id}-sm.webp" alt="" width="600" height="600" loading="lazy">`
          : `<img src="${IMG}cut/${d.id}.webp" alt="" width="281" height="640" loading="lazy">`}
      </span>
      <span>${d.name}</span>
    </button>`).join("");

  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lbImg");
  const lbName = document.getElementById("lbName");
  let cur = 0;

  function show(i) {
    cur = (i + DESIGNS.length) % DESIGNS.length;
    const d = DESIGNS[cur];
    lbImg.src = `${IMG}${d.id}.webp`;
    lbImg.alt = `Solingo ${d.name} deseni`;
    lbName.textContent = d.name;
  }

  grid.addEventListener("click", e => {
    const c = e.target.closest("[data-i]");
    if (!c) return;
    show(+c.dataset.i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  });
  lb.addEventListener("click", e => {
    if (e.target === lb || e.target.closest("[data-close]")) lb.close();
    const s = e.target.closest("[data-step]");
    if (s) show(cur + +s.dataset.step);
  });
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();
