
// Mobile nav
const burger = document.getElementById('hamburger');
const links = document.getElementById('nav-links');
if (burger){
  burger.addEventListener('click', ()=>{
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.classList.toggle('open');
  });
}

// IntersectionObserver reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Counter up for badges
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const isFloat = String(target).includes('.');
  let cur = 0;
  const step = target / 60;
  const t = setInterval(()=>{
    cur += step;
    if (cur >= target){ cur = target; clearInterval(t); }
    el.textContent = isFloat ? cur.toFixed(1) : Math.round(cur);
  }, 16);
}
document.querySelectorAll('.badge .num').forEach(animateCount);

// Year
document.getElementById('y').textContent = new Date().getFullYear();
