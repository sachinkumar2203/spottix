// Top scroll progress bar
export function initScrollProgress() {
const bar=document.getElementById('bar');addEventListener('scroll',()=>{bar.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
}
