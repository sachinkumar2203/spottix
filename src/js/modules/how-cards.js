// "Why the city needs Spottix": hover to expand cards
export function initHowCards() {
const cards=[...document.querySelectorAll('.yc')];
cards.forEach(c=>{
 c.addEventListener('mouseenter',()=>{
  cards.forEach(x=>x.classList.remove('open'));
  c.classList.add('open');
  setTimeout(()=>c.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}),80);
 });
 // Also keep click support for touch devices
 c.addEventListener('click',e=>{
  if(c.classList.contains('open')&&!e.target.closest('.pl'))return;
  const o=c.classList.contains('open');
  cards.forEach(x=>x.classList.remove('open'));
  if(!o){c.classList.add('open');setTimeout(()=>c.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}),80)}
 });
});
// Close when mouse leaves the entire rail
const rail=document.getElementById('rail');
if(rail) rail.addEventListener('mouseleave',()=>cards.forEach(x=>x.classList.remove('open')));
}
