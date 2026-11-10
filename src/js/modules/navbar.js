// Navbar: becomes solid white after scrolling past the hero
import { $ } from '../utils/dom.js';

export function initNavbar() {
const nav = $('nav');
const toggle = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.7);
addEventListener('scroll', () => requestAnimationFrame(toggle), { passive: true });
addEventListener('resize', toggle);
toggle();
}
