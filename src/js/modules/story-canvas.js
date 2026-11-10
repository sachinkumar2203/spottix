// Story section: scroll-driven canvas particles + pin animation
import { $ } from '../utils/dom.js';
import { clamp, ease, lerp, seg } from '../utils/math.js';
import { heroImages as srcs } from '../data/images.js';

// Parametric S-curve generator: returns [x, y] in [-1, 1] range
function sCurve(t) {
  if (t < 0.5) {
    const u = t * 2;
    // Top arc: starts top-right, sweeps counter-clockwise over top, loops into center (0, 0)
    const ang = 0.15 * Math.PI + u * 1.35 * Math.PI;
    return [Math.cos(ang), -0.5 - Math.sin(ang) * 0.5];
  } else {
    const u = (t - 0.5) * 2;
    // Bottom arc: starts center (0, 0), sweeps clockwise down-right, loops bottom-left
    const ang = 0.5 * Math.PI - u * 1.35 * Math.PI;
    return [Math.cos(ang), 0.5 - Math.sin(ang) * 0.5];
  }
}

export function initStoryCanvas() {
  const S1 = $('#story'), cv = $('#cv'), ctx = cv.getContext('2d'), pin = $('#pin');
  const srcs = [...document.querySelectorAll('.slide')].map(s => s.style.getPropertyValue('--img').replace(/^url\(["']?|["']?\)$/g, ''));
  let W, H, mob, pH, pW, hr, cx2, cy2, P = [], dpr = Math.min(devicePixelRatio || 1, 2);
  const tex = [], N = 240, M = 28;
  let animTime = 0, inView = false, rafId = null;

  function build() {
    const Rc = Math.min(W, H) * (mob ? 0.24 : 0.22);
    hr = (mob ? Math.min(H * 0.5, W * 0.95) : Math.min(H * 0.95, W * 0.72)) * (100 / 128) * 0.3;
    P = [];

    for (let i = 0; i < N; i++) {
      const a2 = Math.random() * 6.283;
      const r2 = Math.sqrt(Math.random()) * hr * 0.75;

      const o = {
        t: Math.random(),
        baseRk: i / N,
        jitter: (Math.random() - 0.5) * (Rc * 0.12),
        rotSpeed: 1.2 + Math.random() * 1.6,
        wL: 15 + Math.random() * 12,
        dx: Math.cos(a2) * r2,
        dy: Math.sin(a2) * r2,
        hI: hr * 2 * (0.08 + Math.random() * 0.1),
        sel: false
      };
      o.hL = o.wL * 1.33;
      P.push(o);
    }

    // Selected particles that form the pin image cluster
    [...P.keys()].sort(() => Math.random() - 0.5).slice(0, M).forEach(i => (P[i].sel = true));
  }

  function size() {
    W = innerWidth;
    H = innerHeight;
    mob = W < 820;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pH = mob ? Math.min(H * 0.5, W * 0.95) : Math.min(H * 0.95, W * 0.72);
    pW = pH * 100 / 128;
    hr = pW * 0.3;
    cx2 = mob ? 0.5 * W : 0.68 * W;
    cy2 = mob ? 0.42 * H : 0.46 * H;
    pin.style.width = pW + 'px';
    pin.style.height = pH + 'px';
    pin.style.left = (cx2 - pW / 2) + 'px';
    pin.style.top = (cy2 - 0.375 * pH) + 'px';
    build();
  }

  srcs.forEach(u => {
    const im = new Image();
    im.onload = () => {
      for (let i = 0; i < 16; i++) {
        const c = document.createElement('canvas');
        c.width = 90;
        c.height = 120;
        const g = c.getContext('2d');
        const sw = im.width * (0.08 + Math.random() * 0.08);
        const sh = sw * 4 / 3;
        const sx = im.width * 0.16 + Math.random() * (im.width * 0.68 - sw);
        const sy = im.height * 0.3 + Math.random() * (im.height * 0.44 - sh);

        g.beginPath();
        g.moveTo(14, 0);
        g.arcTo(90, 0, 90, 120, 14);
        g.arcTo(90, 120, 0, 120, 14);
        g.arcTo(0, 120, 0, 0, 14);
        g.arcTo(0, 0, 90, 0, 14);
        g.closePath();
        g.clip();
        g.drawImage(im, sx, sy, sw, sh, 0, 0, 90, 120);
        tex.push(c);
      }
    };
    im.src = u;
  });

  function prog(el) {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - H));
  }

  function draw(p, time) {
    ctx.clearRect(0, 0, W, H);

    // Scroll progress stages:
    // 1. S-shape stays 100% visible and moving as user reads statement 1 & statement 2 (p: 0 to 0.28)
    // 2. Pin rises from bottom right: p from 0.20 to 0.45
    const uR = ease(seg(p, 0.20, 0.45));
    // 3. S-shape glides towards the rising pin (maintaining S structure!): p from 0.28 to 0.52
    const uMoveToPin = ease(seg(p, 0.28, 0.52));
    // 4. Particles stream directly into the pin center circle: p from 0.42 to 0.66
    const uConverge = ease(seg(p, 0.42, 0.66));
    // 5. Final compression into pin center: p from 0.60 to 0.74
    const uV = ease(seg(p, 0.60, 0.74));

    const fN = 1 - seg(p, 0.40, 0.56);
    const fS = 1 - seg(p, 0.70, 0.78);
    const cy = cy2 + (1 - uR) * H * 0.95;

    const c1x = mob ? 0.5 * W : 0.28 * W;
    const c1y = mob ? 0.45 * H : 0.52 * H;
    const Rc = Math.min(W, H) * (mob ? 0.24 : 0.22);
    const Ws = Rc * 1.05;
    const Hs = Rc * 1.45;

    // Continuous flow speed along the S curve
    const flowSpeed = 0.045;

    for (let i = 0; i < P.length; i++) {
      const o = P[i];

      // Dynamic flow progression along the S curve
      const flowT = (o.baseRk + time * flowSpeed) % 1.0;
      const [sx, sy] = sCurve(flowT);

      // Living wave / breathing motion along the S path
      const waveX = Math.sin(time * 1.6 + flowT * 6.28) * (Rc * 0.045);
      const waveY = Math.cos(time * 1.3 + flowT * 4.71) * (Rc * 0.035);

      // S position on the left
      const sX = c1x + sx * Ws + o.jitter + waveX;
      const sY = c1y + sy * Hs + o.jitter + waveY;

      // S target near pin (retains S curve flow even when shifting towards pin!)
      const targetPinX = cx2 + sx * (Ws * 0.6) + o.dx * 0.5;
      const targetPinY = cy + sy * (Hs * 0.6) + o.dy * 0.5;

      // S smooth shift towards pin
      let x = lerp(sX, targetPinX, uMoveToPin);
      let y = lerp(sY, targetPinY, uMoveToPin);

      // Smooth fade-in at top of S and fade-out at bottom
      const edgeAlpha = clamp(Math.sin(flowT * Math.PI) * 1.6, 0, 1);

      let w = o.wL;
      let h = o.hL;
      let a = (0.2 + 0.8 * seg(p, 0, 0.08)) * edgeAlpha;

      if (o.sel) {
        // Selected particles stream into the pin center circle
        x = lerp(x, cx2 + o.dx, uConverge);
        y = lerp(y, cy + o.dy, uConverge);
        w = lerp(w, o.hI * 0.66, uConverge);
        h = lerp(h, o.hI, uConverge);

        // Final tuck into pin center
        x = lerp(x, cx2, uV);
        y = lerp(y, cy, uV);
        w = lerp(w, 2, uV);
        h = lerp(h, 3, uV);
        a *= fS;
      } else {
        // Non-selected particles fade away gracefully as pin completes
        x = lerp(x, cx2, uConverge * 0.8);
        y = lerp(y, cy, uConverge * 0.8);
        w = lerp(w, 3, uConverge);
        h = lerp(h, 4, uConverge);
        a *= fN;
      }

      if (a <= 0.01 || w < 0.5) continue;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(x, y);

      // Organic rotation along S curve with subtle continuous floating tilt
      const rotL = (flowT < 0.5 ? -1 : 1) * 0.22 + Math.sin(time * o.rotSpeed + i) * 0.14;
      const rot = lerp(rotL, (Math.random() - 0.5) * 0.5, uConverge);
      ctx.rotate(rot);

      const tx = tex[Math.floor(o.t * tex.length)];
      if (tx) {
        ctx.drawImage(tx, -w / 2, -h / 2, w, h);
      } else {
        ctx.fillStyle = '#5fbf85';
        ctx.fillRect(-w / 2, -h / 2, w, h);
      }
      ctx.restore();
    }
  }

  function update() {
    const p = prog(S1);
    draw(p, animTime);
    const st = $('#stmt'), p1 = $('#p1'), t2 = $('#t2');

    // Statement 1: "We're reporting more civic issues than ever..."
    st.style.opacity = 1 - seg(p, 0.04, 0.14);
    st.style.transform = 'translate(-50%,-50%) translateY(' + (-seg(p, 0.02, 0.16) * H * 0.55) + 'px)';

    // Statement 2: "Thousands of complaints are scattered..." (stays visible longer alongside S!)
    p1.style.opacity = seg(p, 0.04, 0.12) * (1 - seg(p, 0.38, 0.48));
    p1.style.transform = 'translateY(' + (-seg(p, 0.12, 0.48) * H * 0.45) + 'px)';

    // Statement 3: "That's why Spottix has created a new home..."
    t2.style.opacity = seg(p, 0.34, 0.44) * (1 - seg(p, 0.84, 0.94));
    t2.style.transform = 'translateY(' + ((1 - ease(seg(p, 0.34, 0.52))) * H * 0.4 - seg(p, 0.8, 0.95) * H * 0.35) + 'px)';

    // Pin appearance & rotation
    const uR = ease(seg(p, 0.20, 0.45));
    const sc = lerp(1, 0.62, ease(seg(p, 0.65, 0.82)));
    const op = seg(p, 0.18, 0.26) * (1 - 0.88 * ease(seg(p, 0.72, 0.84))) * (1 - seg(p, 0.86, 0.94));
    pin.style.opacity = op;
    pin.style.transform = 'translateY(' + (1 - uR) * H * 0.95 + 'px) rotate(' + (-140 * (1 - uR)) + 'deg) scale(' + sc + ')';
  }

  // Continuous 60fps animation loop (runs smoothly when in view)
  function loop(now) {
    animTime = now * 0.001;
    if (inView) {
      update();
    }
    rafId = requestAnimationFrame(loop);
  }

  // IntersectionObserver to run loop whenever section is visible
  const obs = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  }, { threshold: 0.05 });
  obs.observe(S1);

  addEventListener('scroll', () => {
    if (!inView) {
      const r = S1.getBoundingClientRect();
      inView = (r.bottom > 0 && r.top < innerHeight);
    }
  }, { passive: true });

  addEventListener('resize', size);
  size();
  rafId = requestAnimationFrame(loop);
}
