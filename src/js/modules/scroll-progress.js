// Top scroll progress bar + Back to top handler
export function initScrollProgress() {
  const bar = document.getElementById('bar');
  if (bar) {
    addEventListener('scroll', () => {
      bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
    }, { passive: true });
  }

  const backToTopBtn = document.getElementById('backToTop') || document.querySelector('.bt');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
