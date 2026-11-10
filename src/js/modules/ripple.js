// Button ripple effect on click
export function initRipple() {
document.addEventListener('click',e=>{const b=e.target.closest('.dl,.pill,.badge,.wv,.bt');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rp';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';b.appendChild(s);setTimeout(()=>s.remove(),700)});
}
