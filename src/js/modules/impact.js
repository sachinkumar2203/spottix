// Impact: category marquee + animated counters
export function initImpact() {
const mq=document.querySelector('#mq div'),cats=['Potholes','Garbage','Streetlights','Water leaks','Drainage','Broken footpaths','Stray hazards','Illegal dumping'];
mq.innerHTML=cats.concat(cats).map(c=>'<i>'+c+'</i>').join('');
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const t=+e.target.dataset.n,d=e.target.dataset.s||'',t0=performance.now();(function f(n){const k=Math.min(1,(n-t0)/1800);e.target.textContent=Math.round(t*(1-Math.pow(1-k,3))).toLocaleString('en-IN')+d;if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.5});
document.querySelectorAll('[data-n]').forEach(e=>co.observe(e));
}
