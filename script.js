// =====================
// Mobile nav
// =====================
const burger = document.getElementById('hamburger');
const links = document.getElementById('nav-links');
if (burger && links) {
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
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
  const frames = 60; // ~1 Sekunde
  const step = target / frames;

  const t = setInterval(() => {
    cur += step;
    if (cur >= target) {
      cur = target;
      clearInterval(t);
    }
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

    // Honeypot (Spam-Schutz)
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

  // =====================
// Hero Slider
// =====================
(function heroSlider(){
  const wrap = document.getElementById('hero-slider');
  if (!wrap) return;

  const track = wrap.querySelector('.slides');
  const slides = [...wrap.querySelectorAll('.slide')];
  const dots = [...wrap.querySelectorAll('.dot')];

  const setActive = () => {
    let best = 0, bestArea = -1;
    const rectTrack = track.getBoundingClientRect();
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const visible =
        Math.max(0, Math.min(r.right, rectTrack.right) - Math.max(r.left, rectTrack.left)) *
        Math.max(0, Math.min(r.bottom, rectTrack.bottom) - Math.max(r.top, rectTrack.top));
      if (visible > bestArea) { bestArea = visible; best = i; }
    });
    slides.forEach((s,i)=> s.classList.toggle('is-active', i===best));
    dots.forEach((d,i)=> d.classList.toggle('is-active', i===best));
  };

  setActive();
  let tick = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(tick);
    tick = requestAnimationFrame(setActive);
  }, { passive:true });

  dots.forEach(d=>{
    d.addEventListener('click', ()=>{
      const i = +d.dataset.i || 0;
      const target = slides[i];
      if (target) target.scrollIntoView({ behavior:'smooth', inline:'center' });
    });
  });
})();
})();
