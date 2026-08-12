/* =========================================================
   NIROMY ANTONY FRANCIS — PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. PAGE LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });

  /* ---------- 2. THEME TOGGLE (Light / Dark) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeIcon.classList.toggle('fa-moon', theme === 'light');
    themeIcon.classList.toggle('fa-sun', theme === 'dark');
    try { localStorage.setItem('portfolio-theme', theme); } catch (e) { /* storage unavailable */ }
  };

  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  } catch (e) { /* storage unavailable, default to dark */ }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(current);
  });

  /* ---------- 3. STICKY NAVBAR + ACTIVE LINK + SCROLL PROGRESS ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    navbar.classList.toggle('scrolled', scrollY > 40);

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';

    // Back to top visibility
    backToTop.classList.toggle('show', scrollY > 500);

    // Active nav link
    let currentId = 'home';
    sections.forEach((sec) => {
      const offset = sec.offsetTop - 120;
      if (scrollY >= offset) currentId = sec.id;
    });
    navLinkEls.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 4. MOBILE MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinkEls.forEach((link) => link.addEventListener('click', closeMenu));

  /* ---------- 4b. HERO PHOTO SLIDE-UP ENTRANCE (JS-driven) ---------- */
  const heroPhoto = document.getElementById('heroPhoto');
  const heroBadge = document.querySelector('.hero-badge');
  // Photo starts translated down + transparent (see CSS .photo-frame),
  // JS adds the class that animates it up into place once the page has loaded.
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (heroPhoto) heroPhoto.classList.add('photo-in');
      if (heroBadge) heroBadge.classList.add('photo-in');
    }, 650);
  });

  /* ---------- 5. HERO TYPING EFFECT ---------- */
  const typingText = document.getElementById('typingText');
  const roles = ['Frontend Developer', 'UI/UX Designer'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  };
  typeLoop();

  /* ---------- 6. HERO PARTICLES (canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      const hero = canvas.closest('.hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = root.getAttribute('data-theme') === 'dark';
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(45,217,168,${p.alpha})` : `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    };

    resizeCanvas();
    initParticles();
    draw();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  }

  /* ---------- 7. SCROLL REVEAL ANIMATIONS ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 8. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- 9. ANIMATED SKILL PROGRESS BARS ---------- */
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.width}%`;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => barObserver.observe(b));

  /* ---------- 9b. ABOUT PHOTO SCROLL TURN ---------- */
  const aboutAvatar = document.querySelector('.about-avatar');
  if (aboutAvatar) {
    let ticking = false;
    const updateAvatarTurn = () => {
      const rect = aboutAvatar.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const center = rect.top + rect.height / 2;
      const progress = (viewportH / 2 - center) / (viewportH / 2); // -1 to 1
      const clamped = Math.max(-1, Math.min(1, progress));
      const angle = clamped * 28; // degrees of turn
      aboutAvatar.style.transform = `rotateY(${angle}deg)`;
      ticking = false;
    };
    const onAvatarScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateAvatarTurn);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onAvatarScroll, { passive: true });
    window.addEventListener('resize', onAvatarScroll);
    updateAvatarTurn();
  }

  /* ---------- 10. GALLERY LIGHTBOX ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxFrame = document.getElementById('lightboxFrame');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    currentGalleryIndex = index;
    const item = galleryItems[index];
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = item.dataset.img || '';
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => openLightbox((currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length));
  lightboxNext.addEventListener('click', () => openLightbox((currentGalleryIndex + 1) % galleryItems.length));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* ---------- 11. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Please enter a subject.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const input = form.elements[field];
      const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
      const result = validators[field](input.value);
      if (result !== true) {
        input.classList.add('invalid');
        errorEl.textContent = result;
        isValid = false;
      } else {
        input.classList.remove('invalid');
        errorEl.textContent = '';
      }
    });

    if (!isValid) return;

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.classList.add('sending');

    const payload = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      subject: form.elements.subject.value,
      message: form.elements.message.value,
      _subject: `Portfolio contact: ${form.elements.subject.value}`,
      _template: 'table',
      _captcha: 'false',
    };

    fetch('https://formsubmit.co/ajax/nironiromy87@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        formSuccess.textContent = "Message sent! I'll get back to you soon.";
        formSuccess.classList.remove('form-error-msg');
        formSuccess.classList.add('show');
        form.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      })
      .catch(() => {
        formSuccess.textContent = "Something went wrong sending your message. Please email nironiromy87@gmail.com directly.";
        formSuccess.classList.add('show', 'form-error-msg');
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
      });
  });

  // Clear error state on input
  Object.keys(validators).forEach((field) => {
    const input = form.elements[field];
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      form.querySelector(`.form-error[data-for="${field}"]`).textContent = '';
    });
  });

  /* ---------- 12. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
