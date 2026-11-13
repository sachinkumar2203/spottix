// Civic action features carousel dots & swipe sync for mobile
export function initCivicCarousel() {
  const carousel = document.getElementById('caCarousel');
  const dotsContainer = document.getElementById('caDots');
  if (!carousel || !dotsContainer) return;

  const dots = Array.from(dotsContainer.querySelectorAll('.ca-dot'));
  const cards = Array.from(carousel.querySelectorAll('.ca-card'));
  if (!dots.length || !cards.length) return;

  let isClickScrolling = false;
  let clickTimeout = null;

  const updateActiveDot = () => {
    if (isClickScrolling) return;
    const carouselLeft = carousel.getBoundingClientRect().left;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs(cardRect.left - carouselLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === closestIndex);
    });
  };

  carousel.addEventListener('scroll', updateActiveDot, { passive: true });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const targetCard = cards[index];
      if (targetCard) {
        isClickScrolling = true;
        clearTimeout(clickTimeout);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 500);
      }
    });
  });

  // Initial update
  updateActiveDot();
}
