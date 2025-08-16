// =====================
// Mobile nav
// =====================
const burger = document.getElementById('hamburger');
const links = document.getElementById('nav-links');
if (burger && links) {
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    links.style.display = open ? 'flex' : 'none';
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

// =====================
// Tinder-like Swipe Stack
// =====================
(function swipeStack() {
  const stack = document.getElementById('hero-stack');
  if (!stack) return;

  const getTop = () => stack.querySelector('.swipe-card:nth-child(1)');

  let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;

  const setStyle = (el, x, y) => {
    const rot = x * 0.06;
    el.style.transform = translate(${x}px, ${y}px) rotate(${rot}deg);
  };

  const resetTop = (el) => {
    el.style.transition = 'transform .25s ease';
    el.style.transform = '';
    setTimeout(() => (el.style.transition = ''), 250);
  };

  const flyOut = (el, dir) => {
    const off = (dir === 'right') ? 1 : -1;
    el.style.transition = 'transform .35s ease, opacity .35s ease';
    el.style.opacity = '0';
    el.style.transform = translate(${off * window.innerWidth}px, ${dy * 0.3}px) rotate(${off * 30}deg);
    setTimeout(() => {
      el.style.transition = '';
      el.style.opacity = '';
      el.style.transform = '';
      stack.appendChild(el); // Karte ans Ende
    }, 360);
  };

  const pointerDown = (e) => {
    const top = getTop();
    if (!top) return;
    dragging = true;
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    dx = dy = 0;
    top.style.transition = '';
  };

  const pointerMove = (e) => {
    if (!dragging) return;
    const top = getTop();
    if (!top) return;
    const p = e.touches ? e.touches[0] : e;
    dx = p.clientX - startX;
    dy = p.clientY - startY;
    setStyle(top, dx, dy);
    e.preventDefault();
  };

  const pointerUp = () => {
    if (!dragging) return;
    dragging = false;
    const top = getTop();
    if (!top) return;

    const threshold = Math.min(140, window.innerWidth * 0.28);
    if (Math.abs(dx) > threshold) {
      flyOut(top, dx > 0 ? 'right' : 'left');
    } else {
      resetTop(top);
    }
  };

  // Events
  stack.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.swipe-card') === getTop()) pointerDown(e);
  });
  window.addEventListener('pointermove', pointerMove, { passive: false });
  window.addEventListener('pointerup', pointerUp);

  stack.addEventListener('touchstart', (e) => {
    if (e.target.closest('.swipe-card') === getTop()) pointerDown(e);
  }, { passive: true });
  window.addEventListener('touchmove', pointerMove, { passive: false });
  window.addEventListener('touchend', pointerUp);

  // Buttons
  document.querySelectorAll('.swipe-actions [data-dir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const top = getTop();
      if (top) flyOut(top, btn.dataset.dir);
    });
  });
})();
