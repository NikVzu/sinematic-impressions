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
})();

// ===== Marquee init: misst Breite + startet Animation =====
(function initMarquee(){
  const track = document.getElementById('marquee-track');
  if (!track) return;

  // Erste Gruppe holen
  const first = track.querySelector('.group');
  if (!first) return;

  // Duplikat für nahtlosen Übergang
  const clone = first.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  // Startfunktion: misst endgültige Breite (nach Font-Load)
  const start = () => {
    // exakte Breite der ERSTEN Gruppe bestimmen
    const w = first.scrollWidth;
    // Distanz & Dauer setzen (Speed ≈ 120px/s)
    const speedPxPerSec = 120;
    const duration = (w / speedPxPerSec).toFixed(2) + 's';

    track.style.setProperty('--marquee-w', w + 'px');
    track.style.setProperty('--marquee-duration', duration);

    // Reflow + Animation aktivieren
    void track.offsetWidth;
    track.classList.add('run');
  };

  // Warten bis Webfonts geladen sind, damit die Breite stimmt
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(start));
  } else {
    window.addEventListener('load', () => requestAnimationFrame(start));
  }
})();
