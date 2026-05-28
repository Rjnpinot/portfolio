document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide?.createIcons) {
    lucide.createIcons();
  }

  initTheme();
  initMobileNav();
  initSmoothScroll();
  initScrollSpy();
  initReveal();
  initTyping();
  initWhatsApp();
  initOrbParallax();
});

function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');

  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  updateThemeIcon();

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    if (!toggle) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    toggle.innerHTML = isLight ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    if (window.lucide?.createIcons) lucide.createIcons();
  }
}

function initMobileNav() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.top-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (nav.contains(target) || btn.contains(target)) return;
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });

  nav.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = getNavHeight();
      const top = target.getBoundingClientRect().top + window.scrollY - navH + 6;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.top-nav a[href^="#"]'));
  if (!links.length) return;

  const sections = links
    .map((l) => {
      const id = l.getAttribute('href');
      const el = id ? document.querySelector(id) : null;
      return el ? { link: l, el } : null;
    })
    .filter(Boolean);

  const navH = getNavHeight();
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

      if (!visible) return;
      const id = `#${visible.target.id}`;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
    },
    { rootMargin: `-${navH + 10}px 0px -60% 0px`, threshold: [0.12, 0.22, 0.4] }
  );

  sections.forEach((s) => observer.observe(s.el));
}

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');

        entry.target.querySelectorAll('.val').forEach((val) => {
          if (!(val instanceof HTMLElement)) return;
          if (val.dataset.started) return;
          startCounter(val);
        });

        entry.target.querySelectorAll('.skill-bar').forEach((bar) => {
          if (!(bar instanceof HTMLElement)) return;
          if (bar.dataset.animated) return;
          bar.dataset.animated = 'true';
          const level = clampInt(parseInt(bar.dataset.level || '0', 10), 0, 100);
          bar.style.setProperty('--level', `${level}%`);
          bar.classList.add('is-animated');
        });
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function startCounter(el) {
  const target = clampInt(parseInt(el.dataset.target || '0', 10), 0, 999);
  const duration = 1200;
  const stepMs = 16;
  const steps = Math.max(1, Math.floor(duration / stepMs));
  const inc = target / steps;
  let current = 0;

  el.dataset.started = 'true';
  const timer = setInterval(() => {
    current += inc;
    if (current >= target) {
      el.innerText = String(target);
      clearInterval(timer);
    } else {
      el.innerText = String(Math.floor(current));
    }
  }, stepMs);
}

function initTyping() {
  const el = document.querySelector('.typing');
  if (!(el instanceof HTMLElement)) return;
  const text = el.dataset.typing || '';
  if (!text) return;

  el.textContent = '';
  const speed = 22;
  let i = 0;
  const timer = setInterval(() => {
    i += 1;
    el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// Respect reduced motion preferences (soft disable for heavy animations)
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduced-motion');
}

function initWhatsApp() {
  const fab = document.querySelector('.whatsapp-fab');
  if (!(fab instanceof HTMLAnchorElement)) return;
  const phoneE164 = '261345900557';
  const message = encodeURIComponent('Bonjour Jean Nicolas, je vous contacte après avoir vu votre portfolio.');
  fab.href = `https://wa.me/${phoneE164}?text=${message}`;
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
}

function initOrbParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 70;
    const y = (e.clientY - window.innerHeight / 2) / 70;
    orbs.forEach((orb, idx) => {
      const factor = (idx + 1) * 0.55;
      if (orb instanceof HTMLElement) {
        orb.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
      }
    });
  });
}

function getNavHeight() {
  const header = document.querySelector('.top-header');
  if (!(header instanceof HTMLElement)) return 80;
  return header.getBoundingClientRect().height || 80;
}

function clampInt(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}
