// Micro-interactions for "Designed for Civic Action" Section
export function initCivicAction() {
  // 1. Viewfinder mode switcher
  const vfModes = document.querySelectorAll('.vf-modes span');
  vfModes.forEach(span => {
    span.addEventListener('click', () => {
      vfModes.forEach(s => s.classList.remove('on'));
      span.classList.add('on');
    });
  });

  // 2. Category tag switcher
  const tagItems = document.querySelectorAll('.ca-tag-item');
  tagItems.forEach(item => {
    item.addEventListener('click', () => {
      tagItems.forEach(t => {
        t.classList.remove('active');
        const check = t.querySelector('.tag-check');
        if (check) check.remove();
      });
      item.classList.add('active');
      const badge = document.createElement('span');
      badge.className = 'tag-check';
      badge.textContent = '✓ Routed';
      item.appendChild(badge);
    });
  });

  // 3. Discovery filter pills
  const fPills = document.querySelectorAll('.f-pill');
  const ftDist = document.querySelector('.ft-dist');
  const ftTitle = document.querySelector('.ft-title');
  fPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      fPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (idx === 0 && ftDist && ftTitle) {
        ftDist.textContent = '📍 240m from you';
        ftTitle.textContent = 'Broken slab on stormwater drain near 5th Cross bus stop';
      } else if (idx === 1 && ftDist && ftTitle) {
        ftDist.textContent = '🔥 86 Neighbours Upvoted';
        ftTitle.textContent = 'Dangerous uncovered pothole on 14th Main Road curve';
      } else if (idx === 2 && ftDist && ftTitle) {
        ftDist.textContent = '⏱️ Just now · 12m ago';
        ftTitle.textContent = 'Garbage overflow behind municipal park gate';
      }
    });
  });

  // 4. Privacy shield toggle
  const shieldToggle = document.querySelector('.shield-toggle');
  const togglePill = document.querySelector('.toggle-pill');
  if (shieldToggle && togglePill) {
    shieldToggle.style.cursor = 'pointer';
    shieldToggle.addEventListener('click', () => {
      const isOn = togglePill.textContent === 'ACTIVE';
      if (isOn) {
        togglePill.textContent = 'OFF';
        togglePill.style.background = '#678272';
      } else {
        togglePill.textContent = 'ACTIVE';
        togglePill.style.background = '#2fbf6b';
      }
    });
  }
}
