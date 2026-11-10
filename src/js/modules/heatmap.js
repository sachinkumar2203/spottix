// Ward heatmap tiles + info panel
import { $ } from '../utils/dom.js';

export function initHeatmap() {
const names={0:['HSR Layout (Ward 4)',92,14,342],1:['Indiranagar (Ward 2)',88,19,296],2:['Byrasandra (Ward 196)',79,27,251],3:['Bellandur (Ward 150)',48,63,118]},tl=$('#tl');
for(let i=0;i<40;i++){const n=names[i]||['Ward '+(5+i*5),Math.round(45+((i*37)%50)),10+(i*7)%50,80+(i*53)%260],r=n[1],b=document.createElement('button');b.style.background=r>80?'#2fbf6b':r>=60?'#f0b429':'#e5594f';b.textContent=r;b.title=n[0];b.onclick=()=>{tl.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');$('#pn1').textContent=n[0];$('#pn2').textContent=r+'%';$('#pn3').style.width=r+'%';$('#pn4').textContent=n[2]+' active · '+n[3]+' resolved'};tl.appendChild(b);if(!i){b.click()}}
}
