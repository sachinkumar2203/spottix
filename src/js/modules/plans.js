// Membership plan cards (rendered from data/plans.js)
import { io } from './reveal.js';
import { F, P } from '../data/plans.js';

export function initPlans() {
const E=(t,c,h)=>{const e=document.createElement(t);e.className=c;e.innerHTML=h;return e};
const pg=document.getElementById('pg');
P.forEach((p,i)=>{const el=E('div','pl y-rv',`<div class="tp">${p.live?'<span class="live">LIVE</span>':'COMING SOON'}</div><div class="hd" style="background:${p.bg}"><i class="dot" style="background:${p.c}"></i><h3>${p.n}</h3><p>${p.d}</p><ul>${p.b.map(x=>'<li>'+x+'</li>').join('')}</ul></div><div class="pr"><b>₹${p.m}</b><b class="g">₹${p.m*10}*</b><br><small>Monthly</small><small class="g">Yearly *Save 16.7%</small></div>${p.live?'<div class="fm"><h4>Become a Founding Member</h4><b>₹49</b><b class="g">₹99</b><br><small>Monthly till Dec 31st</small><small class="g">After December 31st</small></div>':''}<button class="tg" aria-label="Show features">⌄</button><div class="fl">${F.map(f=>'<div class="fr"><div class="fh"><span>›</span>'+f[0]+'<em>'+(f[2][i]?'✓':'–')+'</em></div><p>'+f[1]+'</p></div>').join('')}</div>`);
 el.style.transitionDelay=i*.15+'s';pg.appendChild(el);
 el.querySelector('.tg').onclick=()=>el.classList.toggle('open');
 el.querySelectorAll('.fr').forEach(r=>r.onclick=()=>r.classList.toggle('open'));io.observe(el)});
}
