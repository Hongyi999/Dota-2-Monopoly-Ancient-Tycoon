/* ─── Nav: shrink on scroll ─── */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── Scroll-reveal ─── */
const reveals = document.querySelectorAll('.reveal');

function checkReveal() {
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

/* ─── Stat counters ─── */
const statNumbers = document.querySelectorAll('.stats__number');
let statsCounted = false;

function animateStat(el, target, duration = 1600) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function checkStats() {
  if (statsCounted) return;
  const section = document.querySelector('.stats');
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 60) {
    statsCounted = true;
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animateStat(el, target);
    });
  }
}

window.addEventListener('scroll', checkStats);
window.addEventListener('load', checkStats);
