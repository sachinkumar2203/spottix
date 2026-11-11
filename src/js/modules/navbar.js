// Navbar: becomes solid white after scrolling past hero + mobile menu toggle
import { $ } from '../utils/dom.js';

export function initNavbar() {
  const nav = $('nav');
  if (!nav) return;

  const toggleSolid = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.7);
  addEventListener('scroll', () => requestAnimationFrame(toggleSolid), { passive: true });
  addEventListener('resize', toggleSolid);
  toggleSolid();

  // Mobile navigation menu toggle
  const toggleBtn = $('#navToggle');
  const links = nav.querySelectorAll('.links a');

  if (toggleBtn) {
    const closeMenu = () => {
      nav.classList.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('menu-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
        closeMenu();
      }
    });

    // Close when window resized to desktop
    addEventListener('resize', () => {
      if (innerWidth > 820 && nav.classList.contains('menu-open')) {
        closeMenu();
      }
    });
  }
}
