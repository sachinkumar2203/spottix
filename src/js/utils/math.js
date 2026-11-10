// Math helpers used by scroll-driven animations
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (x) => x * x * (3 - 2 * x);
export const lerp = (a, b, x) => a + (b - a) * x;
// seg(p, a, b): progress of p inside the window [a, b], clamped to 0..1
export const seg = (p, a, b) => clamp((p - a) / (b - a));
