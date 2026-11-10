// Applies hero images to every element with [data-im] via the --im CSS variable
import { heroImages as srcs } from '../data/images.js';

export function initImageBinding() {
document.querySelectorAll('[data-im]').forEach(e=>e.style.setProperty('--im','url('+srcs[(+e.dataset.im)%srcs.length]+')'));
}
