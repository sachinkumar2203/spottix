// Reveal-on-scroll (IntersectionObserver)
export const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});

export function initReveal() {
document.querySelectorAll('.y-rv').forEach(e=>io.observe(e));
document.querySelectorAll('.st>*').forEach((e,i)=>{e.classList.add('y-rv');e.style.transitionDelay=(i%4)*.14+'s';io.observe(e)});
}
