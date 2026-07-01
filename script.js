/* ═══════════════════════════════════════════════════════════════════════════
   FIRDAVS SAMADOV — Portfolio JS
   Terminal animation, theme toggle, navigation, scroll effects
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Initialize i18n (multilingual support) ─────────────────────────────
  I18N.init();

  // ── Initialize AOS animations ──────────────────────────────────────────
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // ── Navigation scroll effect ───────────────────────────────────────────
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', () => {
    // Add scrolled class for nav background
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active section highlighting
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ── Mobile hamburger menu ──────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ── Theme toggle ───────────────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check saved preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // ── Terminal typing animation ──────────────────────────────────────────
  const lines = [
    { id: 'typeLine1', text: '<span class="t-prompt">$</span> <span class="t-cmd">kubectl</span> get nodes', delay: 0 },
    { id: 'typeLine2', text: '<span class="t-output">NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;ROLES&nbsp;&nbsp;&nbsp;AGE</span>', delay: 800 },
    { id: 'typeLine3', text: '<span class="t-output">node-01&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;control&nbsp;42d</span>', delay: 1200 },
    { id: 'typeLine4', text: '<span class="t-output">node-02&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;worker&nbsp;&nbsp;42d</span>', delay: 1600 },
    { id: 'typeLine5', text: '<span class="t-prompt">$</span> <span class="t-cmd">terraform</span> apply ✓ <span class="t-success">45 resources created</span>', delay: 2400 },
    { id: 'typeLine6', text: '<span class="t-prompt">$</span> <span class="t-cmd">argocd</span> app sync ✓ <span class="t-success">7 apps healthy</span>', delay: 3200 },
  ];

  // Add terminal CSS
  const termStyle = document.createElement('style');
  termStyle.textContent = `
    .t-prompt { color: #38bdf8; }
    .t-cmd { color: #a78bfa; }
    .t-output { color: #8b949e; }
    .t-success { color: #34d399; }
  `;
  document.head.appendChild(termStyle);

  function typeText(element, html, speed = 25) {
    return new Promise(resolve => {
      // Strip HTML tags for typing effect, then insert full HTML
      const plain = html.replace(/<[^>]*>/g, '');
      let i = 0;
      element.innerHTML = '';

      function type() {
        if (i < plain.length) {
          element.textContent += plain[i];
          i++;
          setTimeout(type, speed);
        } else {
          // Replace with styled HTML
          element.innerHTML = html;
          resolve();
        }
      }
      type();
    });
  }

  // Run terminal animation
  async function runTerminal() {
    for (const line of lines) {
      await new Promise(r => setTimeout(r, line.delay ? 400 : 0));
      const el = document.getElementById(line.id);
      if (el) {
        await typeText(el, line.text, 20);
      }
    }
  }

  // Start terminal animation after page loads
  setTimeout(runTerminal, 1000);

  // ── Smooth scroll for anchor links ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Project diagram lightbox / full-screen preview ─────────────────────
  const lightboxOverlay = document.getElementById('projectLightbox');
  const lightboxImage = lightboxOverlay?.querySelector('.lightbox-image');
  const lightboxClose = lightboxOverlay?.querySelector('.lightbox-close');

  function openProjectLightbox(src, alt) {
    if (!lightboxOverlay || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || 'Project architecture diagram';
    lightboxOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeProjectLightbox() {
    if (!lightboxOverlay || !lightboxImage) return;
    lightboxOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
    lightboxImage.src = '';
    lightboxImage.alt = '';
  }

  document.querySelectorAll('.project-image').forEach(card => {
    card.addEventListener('click', () => {
      const image = card.querySelector('img');
      if (!image || !image.src) return;
      openProjectLightbox(image.src, image.alt);
    });
  });

  lightboxOverlay?.addEventListener('click', event => {
    if (event.target === lightboxOverlay) {
      closeProjectLightbox();
    }
  });

  lightboxClose?.addEventListener('click', closeProjectLightbox);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightboxOverlay?.classList.contains('open')) {
      closeProjectLightbox();
    }
  });

  // ── Intersection Observer for fade-in ──────────────────────────────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-category, .cert-card, .education-card').forEach(el => {
    observer.observe(el);
  });

});
