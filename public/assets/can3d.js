/* Solingo 3D sahne: fotoğraftan sarılmış kutu, desen geçişi, uçuşan yapraklar */
(() => {
  "use strict";

  const canvas = document.getElementById("stage");
  if (!window.THREE || !canvas) { document.documentElement.classList.add("no-webgl"); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = () => window.innerWidth < 820;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small() ? 1.75 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.1, 13);
  camera.lookAt(0, 0, 0);

  // ---------- desen verisi ----------
  // lid: kapak kenarı, label: kapak etiketi, ink: etiket yazısı
  // rim: kapak kenarı rengi; pattern: kenar gövde deseniyle sarılı
  const LIDS = {
    signature:        { rim: "#1d2547" },
    tropik:           { rim: "#1b2347", pattern: true },
    aycicegi:         { rim: "#1c2034", pattern: true },
    gelincik:         { rim: "#17191e" },
    "kir-cicekleri":  { rim: "#1f4436" },
    suluboya:         { rim: "#f2eeea", pattern: true },
    "pastel-bahce":   { rim: "#151515" },
    mozaik:           { rim: "#14161f" },
    retro:            { rim: "#161b2b" },
    "geometrik-mint": { rim: "#9fb6b4" },
    "geometrik-sari": { rim: "#f2cf2e", pattern: true }
  };

  // ---------- doku üreticileri ----------
  const loader = new THREE.TextureLoader();
  const texCache = {};
  function prep(t) {
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  function signatureTexture() {
    const W = 1024, H = 2048, c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#2a3463"); bg.addColorStop(.5, "#1f2850"); bg.addColorStop(1, "#171e3e");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // mat doku
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    const gold = "#d8c38f";
    // logo (aşağıdan yukarı)
    g.save();
    g.translate(W * 0.53, H * 0.33);
    g.rotate(-Math.PI / 2);
    g.fillStyle = gold;
    g.font = '600 300px "Cormorant Garamond", Georgia, serif';
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("Solingo", 0, 0);
    g.restore();
    // simgeler + yazılar
    g.strokeStyle = gold; g.fillStyle = gold; g.lineWidth = 5; g.lineCap = "round"; g.lineJoin = "round";
    const row = H * 0.6, xs = [W * 0.33, W * 0.5, W * 0.67];
    // bambu
    g.beginPath(); g.moveTo(xs[0], row - 70); g.lineTo(xs[0], row + 10);
    for (const y of [row - 45, row - 15]) { g.moveTo(xs[0] - 10, y); g.lineTo(xs[0] + 10, y); }
    g.moveTo(xs[0], row - 35); g.quadraticCurveTo(xs[0] + 30, row - 55, xs[0] + 38, row - 40);
    g.stroke();
    // yapraklar
    for (let k = 0; k < 3; k++) {
      const y = row - 50 + k * 14;
      g.beginPath(); g.moveTo(xs[1] - 34, y + 10); g.lineTo(xs[1], y); g.lineTo(xs[1] + 34, y + 10); g.lineTo(xs[1], y + 20); g.closePath(); g.stroke();
    }
    for (let k = 0; k < 3; k++) {
      const y = row - 55 + k * 18;
      g.beginPath(); g.moveTo(xs[2] - 34, y + 12); g.quadraticCurveTo(xs[2], y - 4, xs[2] + 34, y + 12); g.stroke();
    }
    g.font = '700 30px "Manrope", system-ui, sans-serif';
    g.textAlign = "center";
    [["%100", "BAMBU"], ["50", "YAPRAK"], ["3 KATLI", "PEÇETE"]].forEach(([a, b], i) => {
      g.fillText(a, xs[i], row + 60); g.fillText(b, xs[i], row + 96);
    });
    // dalga çizgileri
    g.lineWidth = 3.2; g.globalAlpha = 0.9;
    for (let i = 0; i < 22; i++) {
      const o = i * 22;
      g.beginPath();
      g.moveTo(-20, H * 0.98 - o * 0.2);
      g.bezierCurveTo(W * 0.3, H * 0.9 - o, W * 0.55, H * 0.98 - o * 0.6, W * 0.75, H * 0.8 - o * 0.9);
      g.bezierCurveTo(W * 0.88, H * 0.7 - o, W * 0.95, H * 0.68 - o * 0.4, W + 20, H * 0.62 - o * 0.5);
      g.stroke();
    }
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    return prep(t);
  }

  function signatureTop() {
    const S = 1024, c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d"), r = S / 2;
    g.fillStyle = "#1d2547"; g.fillRect(0, 0, S, S);
    const rg = g.createRadialGradient(r, r, r * 0.7, r, r, r);
    rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(.93, "rgba(255,255,255,.08)"); rg.addColorStop(1, "rgba(0,0,0,.3)");
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    g.strokeStyle = "#d8c38f"; g.lineWidth = 5;
    g.beginPath(); g.arc(r, r, r * 0.66, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2;
    g.beginPath(); g.arc(r, r, r * 0.62, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#d8c38f"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = '600 170px "Cormorant Garamond", Georgia, serif';
    g.fillText("Solingo", r, r + 6);
    return prep(new THREE.CanvasTexture(c));
  }

  function topTexture(id) {
    const key = id + ":top";
    if (texCache[key]) return texCache[key];
    const p = id === "signature"
      ? Promise.resolve(signatureTop())
      : new Promise(res => loader.load(`assets/tex/${id}-top.webp`, t => res(prep(t)), undefined, () => res(null)));
    texCache[key] = p;
    return p;
  }

  function bodyTexture(id) {
    if (texCache[id]) return texCache[id];
    const p = id === "signature"
      ? Promise.resolve(signatureTexture())
      : new Promise(res => loader.load(`assets/tex/${id}.webp`, t => res(prep(t)), undefined, () => res(null)));
    texCache[id] = p;
    return p;
  }

  // ---------- kutu ----------
  const R = 1, BODY = 4.1, LIDH = 0.17, LIDR = 1.03;
  const can = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.add(can);
  scene.add(tilt);

  const blank = new THREE.DataTexture(new Uint8Array([30, 37, 71, 255]), 1, 1, THREE.RGBAFormat);
  blank.needsUpdate = true;

  // tüm parçalar aynı geçiş değerini paylaşır
  const shared = {
    mixv: { value: 0 },
    lightDir: { value: new THREE.Vector3(-0.45, 0.55, 1).normalize() }
  };

  const COMMON = `
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
    vec3 dissolve(vec3 a, vec3 b, vec2 q, float mixv){
      float n = noise(q * vec2(14.0, 9.0)) * 0.6 + noise(q * vec2(40.0, 30.0)) * 0.4;
      float edge = mixv * 1.25 - 0.12;
      float m = smoothstep(edge - 0.06, edge + 0.02, 1.0 - n);
      m = mixv >= 0.999 ? 1.0 : m;
      vec3 col = mix(a, b, m);
      float glow = (1.0 - smoothstep(0.0, 0.07, abs((1.0 - n) - edge))) * step(0.001, mixv) * step(mixv, 0.999);
      return col + vec3(1.0, 0.82, 0.45) * glow * 1.4;
    }
    vec3 shade(vec3 col, vec3 N, vec3 V, vec3 L, float rimAmt){
      float dif = 0.86 + 0.22 * max(dot(N, L), 0.0);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 48.0) * 0.2;
      float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
      return col * dif + spec + vec3(0.83, 0.75, 0.56) * rim * rimAmt;
    }`;
  const VERT = `
    varying vec2 vUv; varying vec3 vN; varying vec3 vView;
    void main(){
      vUv = uv;
      vec4 wp = modelMatrix * vec4(position,1.0);
      vN = normalize(mat3(modelMatrix) * normal);
      vView = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`;

  const bodyMat = new THREE.ShaderMaterial({
    uniforms: { tA: { value: blank }, tB: { value: blank }, mixv: shared.mixv, lightDir: shared.lightDir },
    vertexShader: VERT,
    fragmentShader: `
      uniform sampler2D tA; uniform sampler2D tB; uniform float mixv; uniform vec3 lightDir;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      ${COMMON}
      void main(){
        float th = vUv.x * 6.2831853;
        vec2 t = vec2(0.5 + 0.5 * sin(th), vUv.y);
        vec3 col = dissolve(texture2D(tA, t).rgb, texture2D(tB, t).rgb, vUv, mixv);
        col = shade(col, normalize(vN), vView, lightDir, 0.28);
        if (cos(th) < 0.0) col *= 0.82;
        gl_FragColor = vec4(col, 1.0);
      }`
  });

  // kapak kenarı: düz renk ya da gövde deseninin üst bandı
  const rimMat = new THREE.ShaderMaterial({
    uniforms: {
      tA: { value: blank }, tB: { value: blank }, cA: { value: new THREE.Color("#1d2547") }, cB: { value: new THREE.Color("#1d2547") },
      pA: { value: 0 }, pB: { value: 0 }, mixv: shared.mixv, lightDir: shared.lightDir
    },
    vertexShader: VERT,
    fragmentShader: `
      uniform sampler2D tA; uniform sampler2D tB; uniform vec3 cA; uniform vec3 cB; uniform float pA; uniform float pB;
      uniform float mixv; uniform vec3 lightDir;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      ${COMMON}
      void main(){
        float th = vUv.x * 6.2831853;
        vec2 t = vec2(0.5 + 0.5 * sin(th), 0.94 + vUv.y * 0.05);
        vec3 a = mix(cA, texture2D(tA, t).rgb, pA);
        vec3 b = mix(cB, texture2D(tB, t).rgb, pB);
        vec3 col = dissolve(a, b, vUv, mixv);
        col = shade(col, normalize(vN), vView, lightDir, 0.2);
        col *= 0.9 + 0.1 * vUv.y;
        if (cos(th) < 0.0) col *= 0.82;
        gl_FragColor = vec4(col, 1.0);
      }`
  });

  const topMat = new THREE.ShaderMaterial({
    uniforms: { tA: { value: blank }, tB: { value: blank }, mixv: shared.mixv, lightDir: shared.lightDir },
    vertexShader: VERT,
    fragmentShader: `
      uniform sampler2D tA; uniform sampler2D tB; uniform float mixv; uniform vec3 lightDir;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      ${COMMON}
      void main(){
        vec3 col = dissolve(texture2D(tA, vUv).rgb, texture2D(tB, vUv).rgb, vUv, mixv);
        col = shade(col, normalize(vN), vView, lightDir, 0.0);
        gl_FragColor = vec4(col, 1.0);
      }`
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, BODY, 160, 1, true), bodyMat);
  can.add(body);
  const lidY = BODY / 2 + 0.07;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(LIDR, LIDR, LIDH, 160, 1, true), rimMat);
  lid.position.y = lidY - LIDH / 2;
  can.add(lid);
  const lidTop = new THREE.Mesh(new THREE.CircleGeometry(LIDR, 160), topMat);
  lidTop.rotation.x = -Math.PI / 2;
  lidTop.position.y = lidY;
  can.add(lidTop);
  const lidUnder = new THREE.Mesh(new THREE.RingGeometry(R * 0.99, LIDR, 160), new THREE.MeshBasicMaterial({ color: 0x0b0d16, side: THREE.DoubleSide }));
  lidUnder.rotation.x = Math.PI / 2;
  lidUnder.position.y = lidY - LIDH;
  can.add(lidUnder);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(R, 64), new THREE.MeshBasicMaterial({ color: 0xcfcac0 }));
  bottom.rotation.x = Math.PI / 2; bottom.position.y = -BODY / 2;
  can.add(bottom);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 0.75);
  key.position.set(-4, 6, 8); scene.add(key);

  // yumuşak gölge
  const sc = document.createElement("canvas"); sc.width = sc.height = 256;
  const sg = sc.getContext("2d");
  const grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(0,0,0,.55)"); grad.addColorStop(1, "rgba(0,0,0,0)");
  sg.fillStyle = grad; sg.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -BODY / 2 - 0.5;
  tilt.add(shadow);

  // ---------- yapraklar ve altın tozu ----------
  function particles(count, petal) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), seed = new Float32Array(count * 2);
    const pal = petal
      ? ["#f27fae", "#f5c33b", "#ef5b4c", "#7cc4d6", "#b48ae0", "#ffffff"]
      : ["#e8d39a", "#d4c08f", "#fff1c8"];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -7 + Math.random() * 9;
      const c = new THREE.Color(pal[(Math.random() * pal.length) | 0]);
      col.set([c.r, c.g, c.b], i * 3);
      seed.set([Math.random(), Math.random()], i * 2);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("seed", new THREE.BufferAttribute(seed, 2));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      blending: petal ? THREE.NormalBlending : THREE.AdditiveBlending,
      uniforms: { time: { value: 0 }, size: { value: petal ? 170 : 34 }, opacity: { value: 1 } },
      vertexShader: `
        attribute vec3 color; attribute vec2 seed; uniform float time; uniform float size;
        varying vec3 vC; varying float vR; varying float vA;
        void main(){
          vec3 p = position;
          float sp = 0.18 + seed.x * 0.35;
          p.y = mod(p.y + time * sp + 6.0, 12.0) - 6.0;
          p.x += sin(time * (0.4 + seed.y) + seed.x * 6.28) * 0.6;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (0.5 + seed.y) / -mv.z;
          vC = color; vR = time * (0.5 + seed.x) + seed.y * 6.28;
          vA = smoothstep(-6.0, -4.5, p.y) * (1.0 - smoothstep(4.5, 6.0, p.y));
        }`,
      fragmentShader: petal ? `
        varying vec3 vC; varying float vR; varying float vA; uniform float opacity;
        void main(){
          vec2 q = gl_PointCoord - 0.5;
          float c = cos(vR), s = sin(vR);
          q = vec2(c*q.x - s*q.y, s*q.x + c*q.y);
          q.x *= 2.2 * (0.6 + 0.4 * abs(sin(vR * 0.7)));
          float d = length(q);
          float a = smoothstep(0.5, 0.42, d);
          if (a < 0.01) discard;
          gl_FragColor = vec4(vC * (0.85 + 0.3 * (0.5 - q.y)), a * 0.85 * vA * opacity);
        }` : `
        varying vec3 vC; varying float vA; uniform float opacity;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vC, a * 0.9 * vA * opacity);
        }`
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    return mat;
  }
  const petals = particles(small() ? 46 : 90, true);
  const dust = particles(small() ? 120 : 260, false);

  // ---------- durum ----------
  const pose = { x: 0, y: 0, s: 1, ry: 0 };
  const target = { x: 0, y: 0, s: 1, ry: 0 };
  let mouseX = 0, mouseY = 0, current = null, busy = Promise.resolve();
  let visibleW = 10, visibleH = 7;

  let spin = 0;

  function assign(side, id, tex, top) {
    const d = LIDS[id] || LIDS.signature;
    bodyMat.uniforms["t" + side].value = tex;
    topMat.uniforms["t" + side].value = top;
    rimMat.uniforms["t" + side].value = tex;
    rimMat.uniforms["c" + side].value.set(d.rim);
    rimMat.uniforms["p" + side].value = d.pattern ? 1 : 0;
  }

  function setDesign(id) {
    if (id === current) return busy;
    current = id;
    busy = busy.then(() => Promise.all([bodyTexture(id), topTexture(id)])).then(([tex, top]) => {
      if (!tex || !top || current !== id) return;
      if (bodyMat.uniforms.tA.value === blank) { assign("A", id, tex, top); assign("B", id, tex, top); return; }
      assign("B", id, tex, top);
      return new Promise(res => {
        const start = performance.now(), dur = reduce ? 1 : 1100;
        (function step(now) {
          const k = Math.min(1, (now - start) / dur);
          shared.mixv.value = k;
          if (k < 1) requestAnimationFrame(step);
          else { assign("A", id, tex, top); shared.mixv.value = 0; res(); }
        })(start);
        spin += reduce ? 0 : 0.9;
      });
    });
    return busy;
  }


  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visibleH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    visibleW = visibleH * camera.aspect;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("pointermove", e => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  // sahne yerleşimleri, görünür genişliğe göre
  const wide = () => camera.aspect >= 1.5;
  const POSES = {
    hero:    () => small() ? { x: 0, y: -1.95, s: 0.5, ry: 0 } : { x: visibleW * (wide() ? 0.2 : 0.25), y: -0.15, s: wide() ? 1 : 0.85, ry: -0.15 },
    moments: () => small() ? { x: 0, y: 0.45, s: 0.68, ry: 0 } : { x: visibleW * 0.17, y: -0.35, s: 0.98, ry: 0.1 },
    contact: () => small() ? { x: 0, y: -9, s: 0.5, ry: 0 } : { x: -visibleW * 0.27, y: 0.55, s: 0.8, ry: 0.2 },
    outro:   () => small() ? { x: 0, y: 1.9, s: 0.4, ry: 0 } : { x: 0, y: 2.05, s: 0.42, ry: 0 },
    hidden:  () => ({ x: pose.x, y: -9, s: 0.6, ry: 0 })
  };
  let poseName = "hero";
  function setPose(name) { poseName = name; Object.assign(target, POSES[name]()); }
  window.addEventListener("resize", () => setPose(poseName));

  // ---------- döngü ----------
  const clock = new THREE.Clock();
  let rotY = 0;
  function frame() {
    const t = clock.getElapsedTime();
    const k = 0.06;
    pose.x += (target.x - pose.x) * k;
    pose.y += (target.y - pose.y) * k;
    pose.s += (target.s - pose.s) * k;
    pose.ry += (target.ry - pose.ry) * k;
    spin *= 0.94;
    const idle = reduce ? 0 : Math.sin(t * 0.5) * 0.32;
    rotY += ((idle + pose.ry + mouseX * 0.5 + spin) - rotY) * 0.08;
    tilt.position.set(pose.x, pose.y + (reduce ? 0 : Math.sin(t * 1.1) * 0.12), 0);
    tilt.scale.setScalar(pose.s);
    can.rotation.y = rotY;
    tilt.rotation.x = 0.2 + mouseY * 0.12;
    tilt.rotation.z = reduce ? 0 : Math.sin(t * 0.7) * 0.03;
    shadow.material.opacity = 0.8 - Math.sin(t * 1.1) * 0.1;
    petals.uniforms.time.value = reduce ? 0 : t;
    dust.uniforms.time.value = reduce ? 0 : t;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  const fontsReady = document.fonts && document.fonts.load
    ? Promise.all([
        document.fonts.load('600 100px "Cormorant Garamond"'),
        document.fonts.load('italic 800 100px "Exo 2"'),
        document.fonts.load('700 30px "Manrope"')
      ]).catch(() => {})
    : Promise.resolve();

  fontsReady.then(() => {
    setPose(poseName);
    pose.x = target.x; pose.y = target.y - 3; pose.s = target.s;
    setDesign("signature");
    requestAnimationFrame(frame);
    document.documentElement.classList.add("stage-ready");
  });

  // ön yükleme
  setTimeout(() => Object.keys(LIDS).forEach(id => { bodyTexture(id); topTexture(id); }), 1200);

  window.SolingoStage = {
    setDesign,
    setPose,
    setParticles(v) { petals.uniforms.opacity.value = v; dust.uniforms.opacity.value = v; }
  };
})();
