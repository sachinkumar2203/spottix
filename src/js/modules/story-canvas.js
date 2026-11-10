// Story section: scroll-driven logo pin animation
import { $ } from '../utils/dom.js';
import { clamp, ease, lerp, seg } from '../utils/math.js';

export function initStoryCanvas() {
  const S1 = $('#story'), cv = $('#cv'), pin = $('#pin');
  const st = $('#stmt'), p1 = $('#p1'), t2 = $('#t2');
  if (!S1 || !pin) return;

  // Clear/hide canvas as the S image particles are replaced by the brand logo
  if (cv) {
    const ctx = cv.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, cv.width, cv.height);
    cv.style.display = 'none';
  }

  let W = innerWidth, H = innerHeight, mob = W < 820;
  let pW = 0, pH = 0;
  let c1x = 0, c1y = 0; // Stage 2: Left position (opposite #p1)
  let cx2 = 0, cy2 = 0; // Stage 3: Right position (opposite #t2)
  let animTime = 0, inView = false, rafId = null;

  function size() {
    W = innerWidth;
    H = innerHeight;
    mob = W < 820;

    // Pin size: authentic, prominent brand mark matching reference
    pH = mob ? Math.min(H * 0.40, W * 0.72) : Math.min(H * 0.80, W * 0.52);
    pW = pH * (100 / 128);

    // Stage 2: Left column (opposite #p1 on right)
    c1x = mob ? 0.50 * W : 0.28 * W;
    c1y = mob ? 0.34 * H : 0.50 * H;

    // Stage 3: Right column (opposite #t2 on left)
    cx2 = mob ? 0.50 * W : 0.70 * W;
    cy2 = mob ? 0.34 * H : 0.48 * H;

    pin.style.width = pW.toFixed(1) + 'px';
    pin.style.height = pH.toFixed(1) + 'px';
    pin.style.left = '0px';
    pin.style.top = '0px';
  }

  function prog(el) {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - H));
  }

  function update() {
    const p = prog(S1);
    const time = animTime;

    // -------------------------------------------------------------
    // Text statements scroll timing
    // -------------------------------------------------------------
    // Statement 1: "We're reporting more civic issues than ever..."
    if (st) {
      st.style.opacity = (1 - seg(p, 0.04, 0.14)).toFixed(3);
      st.style.transform = `translate(-50%,-50%) translateY(${(-seg(p, 0.02, 0.16) * H * 0.55).toFixed(1)}px)`;
    }

    // Statement 2: "Thousands of complaints are scattered..." (on the right)
    if (p1) {
      const p1Op = seg(p, 0.05, 0.14) * (1 - seg(p, 0.36, 0.46));
      p1.style.opacity = p1Op.toFixed(3);
      p1.style.transform = `translateY(${(-seg(p, 0.12, 0.46) * H * 0.35).toFixed(1)}px)`;
    }

    // Statement 3: "That's why Spottix has created a new home..." (on the left)
    if (t2) {
      const t2Op = seg(p, 0.42, 0.52) * (1 - seg(p, 0.84, 0.94));
      t2.style.opacity = t2Op.toFixed(3);
      const t2Y = (1 - ease(seg(p, 0.42, 0.54))) * H * 0.35 - seg(p, 0.82, 0.95) * H * 0.35;
      t2.style.transform = `translateY(${t2Y.toFixed(1)}px)`;
    }

    // -------------------------------------------------------------
    // Logo Pin scroll & continuous micro-animation
    // -------------------------------------------------------------
    // Entrance: fades in and rises into Stage 2 (Left position)
    const uEnter = ease(seg(p, 0.04, 0.15));
    
    // Transition: glides from Left (c1x, c1y) to Right (cx2, cy2)
    const uGlide = ease(seg(p, 0.35, 0.56));
    
    // Exit: fades out smoothly at end of section
    const uExit = ease(seg(p, 0.82, 0.96));

    // Base coordinates lerped between left and right
    const baseX = lerp(c1x, cx2, uGlide);
    const baseY = lerp(c1y, cy2, uGlide) + (1 - uEnter) * H * 0.18 - uExit * H * 0.30;

    // Organic floating breathing motion (runs continuously at 60fps)
    const floatY = Math.sin(time * 1.8) * (mob ? 4 : 7);
    const floatRot = Math.sin(time * 1.2) * (mob ? 1 : 1.8);

    // Dynamic tilt during the left-to-right glide
    const glideTilt = Math.sin(uGlide * Math.PI) * (mob ? 4 : 12);
    const totalRot = glideTilt + floatRot;

    // Scale dynamics
    const enterScale = lerp(0.85, 1.0, uEnter);
    const glideScale = 1.0 + Math.sin(uGlide * Math.PI) * 0.04;
    const exitScale = lerp(1.0, 0.82, uExit);
    const totalScale = enterScale * glideScale * exitScale;

    // Opacity
    const pinOpacity = uEnter * (1 - uExit);

    // Apply GPU-accelerated transform
    const tx = (baseX - pW / 2).toFixed(1);
    const ty = (baseY - 0.375 * pH + floatY).toFixed(1);

    pin.style.opacity = pinOpacity.toFixed(3);
    pin.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${totalRot.toFixed(2)}deg) scale(${totalScale.toFixed(3)})`;
  }

  function loop(now) {
    animTime = now * 0.001;
    if (inView) {
      update();
    }
    rafId = requestAnimationFrame(loop);
  }

  const obs = new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  }, { threshold: 0.02 });
  obs.observe(S1);

  addEventListener('scroll', () => {
    if (!inView) {
      const r = S1.getBoundingClientRect();
      inView = (r.bottom > 0 && r.top < innerHeight);
    }
  }, { passive: true });

  addEventListener('resize', size);
  size();
  update();
  rafId = requestAnimationFrame(loop);
}
