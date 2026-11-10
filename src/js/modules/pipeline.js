// Live status pipeline animation
import { $ } from '../utils/dom.js';

export function initPipeline() {
const N=['Reported','Verified','Assigned','In progress','Resolved'],pp=$('#pipe');
if(!pp) return;
N.forEach((n,i)=>{const d=document.createElement('div');d.className='nd';d.innerHTML='<b>'+(i+1)+'</b><span>'+n+'</span>';pp.appendChild(d)});
let k=0;setInterval(()=>{k=(k+1)%6;[...pp.querySelectorAll('.nd')].forEach((d,i)=>d.classList.toggle('on',i<k));$('#pf').style.width=(k?(k-1)/4*80:0)+'%'},1400);
}
