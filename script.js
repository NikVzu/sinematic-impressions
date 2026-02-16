// =====================
// Mobile nav
// =====================
const burger = document.getElementById('hamburger');
const links  = document.getElementById('nav-links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// =====================
// IntersectionObserver reveal
// =====================
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// =====================
// Counter up for badges
// =====================
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  if (isNaN(target)) return;
  const isFloat = String(target).includes('.');
  let cur = 0;
  const frames = 60;
  const step = target / frames;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = isFloat ? cur.toFixed(1) : Math.round(cur);
  }, 16);
}
document.querySelectorAll('.badge .num').forEach(animateCount);

// =====================
// Footer-Jahr
// =====================
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// =====================
// Kontaktformular (Formspree) + Redirect
// =====================
(function attachContactFormHandler() {
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet…';
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        window.location.href = '/danke.html';
      } else {
        alert('Leider hat das Absenden nicht geklappt. Bitte später erneut versuchen.');
      }
    } catch (err) {
      alert('Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
})();

// =====================
// Mini-Parallax auf Hero mockups (dezent)
// =====================
(function miniParallax(){
  const wrap = document.querySelector('[data-parallax]');
  if (!wrap) return;

  const strength = 10; // px
  function handle(e){
    const rect = wrap.getBoundingClientRect();
    const x = ( (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left ) / rect.width - 0.5;
    const y = ( (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top ) / rect.height - 0.5;
    wrap.style.transform = `translate3d(${(-x*strength)}px, ${(-y*strength)}px, 0)`;
  }
  function reset(){ wrap.style.transform = 'translate3d(0,0,0)'; }

  wrap.addEventListener('mousemove', handle);
  wrap.addEventListener('mouseleave', reset);
  wrap.addEventListener('touchmove', handle, {passive:true});
  wrap.addEventListener('touchend', reset);
})();
