// FAQ accordion
export function initFaq() {
document.querySelectorAll('.fq>div').forEach(d=>d.querySelector('button').onclick=()=>{const o=d.classList.contains('o');document.querySelectorAll('.fq>div.o').forEach(x=>x.classList.remove('o'));if(!o)d.classList.add('o')});
document.querySelector('.fq>div').classList.add('o');
}
