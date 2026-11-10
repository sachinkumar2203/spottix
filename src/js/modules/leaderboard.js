// Gamification leaderboard (Citizens / Wards tabs)
import { $ } from '../utils/dom.js';

export function initLeaderboard() {
const C=[['RK','Ramesh Kumar','HSR Layout • 84 fixed reports',1680],['SM','Shalini Murthy','Indiranagar • 62 fixed reports',1240],['AN','Ananya Nair','Koramangala • 51 fixed reports',1020],['VJ','Vikram Joshi','Whitefield • 48 fixed reports',960]];
const W=[['🌳','Ward 4 · HSR Layout',92],['🏢','Ward 2 · Indiranagar',88],['⛲','Ward 196 · Byrasandra',79],['🚇','Ward 150 · Bellandur',48]];
const rows=$('#rows');
function lb(t){rows.innerHTML=(t?W:C).map((r,i)=>{const v=t?r[2]:r[3],m=['🥇','🥈','🥉','4'][i];return '<div class="rw" style="animation-delay:'+i*.1+'s"><i>'+(t?r[0]:r[0])+'</i><div><b>'+m+' '+(t?r[1]:r[1])+'</b>'+(t?'':'<small>'+r[2]+'</small>')+'<div class="bar2"><u data-w="'+(t?v:v/16.8)+'"></u></div></div><b>'+(t?v+'%':v.toLocaleString('en-IN')+' pts')+'</b></div>'}).join('');
 setTimeout(()=>rows.querySelectorAll('u').forEach(u=>u.style.width=u.dataset.w+'%'),60)}
document.querySelectorAll('.tb button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tb button').forEach(x=>x.classList.toggle('on',x===b));lb(+b.dataset.t)});lb(0);
}
