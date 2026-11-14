// A-06: a dotted globe on canvas. It turns from Mumbai towards the Atlantic while the two moves
// are drawn (Mumbai to Chicago, Chicago to Dubai), then keeps turning slowly while it's on screen.
// With reduced motion it's drawn once, finished.

const RAD = Math.PI / 180;
const CITIES = [
  { name: 'MUMBAI', lon: 72.88, lat: 19.08 },
  { name: 'CHICAGO', lon: -87.63, lat: 41.88 },
  { name: 'DUBAI', lon: 55.27, lat: 25.2 },
];
const REST = { lon: -7, lat: 30 }; // all three cities in view
const START_LON = 62;
const TURN = 360 / 90; // degrees a second after the intro
const LIFT = 0.15;
const SAMPLES = 90;

// seconds from the moment the globe first comes into view
const T = {
  turn: [0, 2.8],
  arc1: [0.4, 1.6],
  arc2: [1.8, 3.0],
  hop1: [1.6, 2.8],
  hop2: [3.0, 4.2],
};

const clamp = (v) => Math.min(1, Math.max(0, v));
const span = ([a, b], t) => clamp((t - a) / (b - a));
const inOut = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

function unit(lon, lat) {
  const l = lon * RAD;
  const p = lat * RAD;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

// great circle from a to b, as points on the unit sphere
function arc(a, b) {
  const va = unit(a.lon, a.lat);
  const vb = unit(b.lon, b.lat);
  const omega = Math.acos(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]);
  const points = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const ka = Math.sin((1 - t) * omega) / Math.sin(omega);
    const kb = Math.sin(t * omega) / Math.sin(omega);
    const v = [ka * va[0] + kb * vb[0], ka * va[1] + kb * vb[1], ka * va[2] + kb * vb[2]];
    points.push({ lon: Math.atan2(v[1], v[0]), lat: Math.asin(v[2]), lift: 1 + LIFT * Math.sin(Math.PI * t) });
  }
  return points;
}

const ROUTES = [arc(CITIES[0], CITIES[1]), arc(CITIES[1], CITIES[2])];

export function setup({ motion }) {
  const wrap = document.querySelector('.globe');
  if (!wrap) return;

  const canvas = wrap.querySelector('.globe__canvas');
  const g = canvas.getContext('2d');
  if (!g) return;

  const css = getComputedStyle(document.documentElement);
  const tone = (name) => css.getPropertyValue(name).trim();
  const colors = { line: tone('--line'), orange: tone('--orange'), paper: tone('--paper') };

  let dots = null;
  let size = 0;
  let dpr = 1;
  let clock = motion ? 0 : Infinity;
  let visible = false;
  let raf = 0;
  let last = 0;
  let lastDraw = 0;

  function view(t) {
    if (t <= T.turn[1]) return { lon: START_LON + (REST.lon - START_LON) * inOut(span(T.turn, t)), lat: REST.lat };
    if (!motion) return { lon: REST.lon, lat: REST.lat };
    return { lon: REST.lon - (t - T.turn[1]) * TURN, lat: REST.lat };
  }

  function draw(t) {
    if (!size) return;
    const { lon, lat } = view(t);
    const l0 = lon * RAD;
    const sin0 = Math.sin(lat * RAD);
    const cos0 = Math.cos(lat * RAD);
    const c = size / 2;
    const R = size * 0.4;

    const project = (plon, plat, lift = 1) => {
      const cosLat = Math.cos(plat);
      const dl = plon - l0;
      const cosDl = Math.cos(dl);
      const x = cosLat * Math.sin(dl);
      const y = cos0 * Math.sin(plat) - sin0 * cosLat * cosDl;
      const z = sin0 * Math.sin(plat) + cos0 * cosLat * cosDl;
      const shown = z > 0 || lift * lift * (x * x + y * y) > 1;
      return { x: c + R * lift * x, y: c - R * lift * y, z, shown };
    };

    g.clearRect(0, 0, size, size);

    g.beginPath();
    g.arc(c, c, R, 0, Math.PI * 2);
    g.globalAlpha = 0.04;
    g.fillStyle = colors.line;
    g.fill();
    g.globalAlpha = 0.35;
    g.lineWidth = dpr;
    g.strokeStyle = colors.line;
    g.stroke();

    if (dots) {
      const dot = dpr * Math.min(2, Math.max(1.2, size / dpr / 290));
      const half = dot / 2;
      const shades = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < dots.length; i += 3) {
        const dl = dots[i] - l0;
        const cosLat = dots[i + 1];
        const sinLat = dots[i + 2];
        const cosDl = Math.cos(dl);
        const z = sin0 * sinLat + cos0 * cosLat * cosDl;
        if (z <= 0) continue;
        const x = c + R * cosLat * Math.sin(dl);
        const y = c - R * (cos0 * sinLat - sin0 * cosLat * cosDl);
        shades[Math.min(4, Math.floor(z * 5))].rect(x - half, y - half, dot, dot);
      }
      g.fillStyle = colors.line;
      shades.forEach((shade, i) => {
        g.globalAlpha = 0.22 + i * 0.16;
        g.fill(shade);
      });
    }

    g.globalAlpha = 1;
    g.strokeStyle = colors.orange;
    g.fillStyle = colors.orange;
    g.lineWidth = 1.6 * dpr;
    g.lineCap = 'round';

    [span(T.arc1, t), span(T.arc2, t)].forEach((p, r) => {
      const progress = inOut(p);
      if (!progress) return;
      const points = ROUTES[r];
      const end = progress * SAMPLES;
      g.beginPath();
      let pen = false;
      for (let i = 0; i <= Math.ceil(end); i++) {
        const k = Math.min(i, end);
        const a = points[Math.floor(k)];
        const b = points[Math.min(SAMPLES, Math.floor(k) + 1)];
        const f = k - Math.floor(k);
        let dlon = b.lon - a.lon;
        if (dlon > Math.PI) dlon -= Math.PI * 2;
        if (dlon < -Math.PI) dlon += Math.PI * 2;
        const pt = project(a.lon + dlon * f, a.lat + (b.lat - a.lat) * f, a.lift + (b.lift - a.lift) * f);
        if (!pt.shown) { pen = false; continue; }
        if (pen) g.lineTo(pt.x, pt.y);
        else g.moveTo(pt.x, pt.y);
        pen = true;
      }
      g.stroke();
    });

    // a small dot travels each move once, right after it's drawn
    [[T.hop1, 0], [T.hop2, 1]].forEach(([window, r]) => {
      if (t <= window[0] || t >= window[1]) return;
      const k = inOut(span(window, t)) * SAMPLES;
      const a = ROUTES[r][Math.floor(k)];
      const pt = project(a.lon, a.lat, a.lift);
      if (!pt.shown) return;
      g.beginPath();
      g.arc(pt.x, pt.y, 3 * dpr, 0, Math.PI * 2);
      g.fill();
    });

    // pins appear as each move lands
    const pinAt = [0, T.arc1[1], T.arc2[1]];
    g.font = `500 ${11 * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
    g.textBaseline = 'middle';
    CITIES.forEach((city, i) => {
      const alpha = motion ? clamp((t - pinAt[i]) / 0.3) : 1;
      if (!alpha) return;
      const pt = project(city.lon * RAD, city.lat * RAD);
      if (pt.z <= 0) return;
      const side = pt.x > c + R * 0.5 ? -1 : 1;
      g.globalAlpha = alpha * Math.min(1, pt.z * 4);
      g.fillStyle = colors.orange;
      g.fillRect(pt.x - 3.5 * dpr, pt.y - 3.5 * dpr, 7 * dpr, 7 * dpr);
      g.fillStyle = colors.paper;
      g.textAlign = side > 0 ? 'left' : 'right';
      g.fillText(city.name, pt.x + side * 10 * dpr, pt.y);
    });
    g.globalAlpha = 1;
  }

  function frame(now) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    clock += dt;
    // once the intro is over the turn is slow, so 30 frames a second is plenty
    if (clock < T.hop2[1] || now - lastDraw > 32) {
      draw(clock);
      lastDraw = now;
    }
    if (visible) raf = requestAnimationFrame(frame);
  }

  function play() {
    cancelAnimationFrame(raf);
    if (!motion) return draw(clock);
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const cssSize = wrap.clientWidth;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    size = Math.round(cssSize * dpr);
    canvas.width = size;
    canvas.height = size;
    draw(clock);
  }

  new ResizeObserver(resize).observe(wrap);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else cancelAnimationFrame(raf);
  }, { threshold: 0.25 }).observe(wrap);

  fetch(wrap.dataset.dots)
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`globe data ${res.status}`))))
    .then((list) => {
      dots = new Float32Array((list.length / 2) * 3);
      for (let i = 0, j = 0; i < list.length; i += 2, j += 3) {
        const lat = list[i + 1] * RAD;
        dots[j] = list[i] * RAD;
        dots[j + 1] = Math.cos(lat);
        dots[j + 2] = Math.sin(lat);
      }
      draw(clock);
    })
    .catch((err) => console.error(err));

  if (document.fonts) document.fonts.ready.then(() => draw(clock));
}
