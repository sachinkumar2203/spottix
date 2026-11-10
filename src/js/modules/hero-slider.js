// Hero: auto-rotating vertical slider (every 5s)
import { heroSlides } from '../data/images.js';

export function initHeroSlider() {
const slides=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.dots span')];
slides.forEach((s, i) => {
  const h = heroSlides[i];
  if (h) { s.style.setProperty('--img', 'url(' + h.img + ')'); s.style.setProperty('--bg', 'url(' + h.bg + ')'); }
});
let cur=0;
function next(){
 const n=(cur+1)%slides.length,c=slides[cur],x=slides[n];
 x.classList.add('reset');x.classList.remove('out','active');x.style.transform='translateY(100%)';
 void x.offsetHeight;x.classList.remove('reset');x.style.transform='';
 c.classList.remove('active');c.classList.add('out');x.classList.add('active');
 setTimeout(()=>{c.classList.remove('out')},1300);
 dots[cur].classList.remove('on');dots[n].classList.add('on');cur=n;
}
setInterval(next,5000);
}
