/* =========================================
   MAKEBOT – HOMEPAGE SCRIPT
   Runs after Components.js has injected the header, footer and cart drawer.
   ========================================= */

document.addEventListener('componentsReady', () => {

  // ── NAVBAR SCROLL ──────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── MOBILE NAV TOGGLE ──────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.querySelector('i').className =
        navLinks.classList.contains('open') ? 'fa fa-times' : 'fa fa-bars';
    });
  }

  // ── SHARED CART (same cart as shop.html / product_details.html) ──
  // Cart comes from js/Cart.js and PRODUCTS from js/products-data.js,
  // both loaded before this file.
  Cart.init();

  // ── HERO SLIDER ────────────────────────────
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderTimer;

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 8000);
  }

  function resetSlider() {
    clearInterval(sliderTimer);
    startSlider();
  }

  document.getElementById('nextSlide').addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlide + 1);
    resetSlider();
  });
  document.getElementById('prevSlide').addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(currentSlide - 1);
    resetSlider();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
      resetSlider();
    });
  });

  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      const url = slide.dataset.href;
      if (url && url !== '#') window.location.href = url;
    });
  });

  startSlider();

  // ── STATS COUNTER ──────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.stats-bar');
  let countersStarted = false;

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statsSection.querySelectorAll('.count').forEach(animateCounter);
      }
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  // ── PILLAR CAROUSELS (Schools / Home / MakeX India) ──
  document.querySelectorAll('.pillar-carousel').forEach(carousel => {
    const pSlides = carousel.querySelectorAll('.pillar-slide');
    const dotsWrap = carousel.querySelector('.pillar-dots');
    let idx = 0;
    let timer;

    // dots are built from the slide count, so add or remove slides freely
    pSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'pillar-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    const pDots = dotsWrap.querySelectorAll('.pillar-dot');

    function go(n) {
      pSlides[idx].classList.remove('active');
      pDots[idx].classList.remove('active');
      idx = (n + pSlides.length) % pSlides.length;
      pSlides[idx].classList.add('active');
      pDots[idx].classList.add('active');
    }
    function start() { timer = setInterval(() => go(idx + 1), 5000); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    carousel.querySelector('.prev').addEventListener('click', () => { go(idx - 1); restart(); });
    carousel.querySelector('.next').addEventListener('click', () => { go(idx + 1); restart(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    start();
  });

  // ── REVIEW CAROUSEL ────────────────────────
  const track = document.getElementById('reviewsTrack');
  if (track) {
    const reviewCards = track.querySelectorAll('.review-card');
    let revIdx = 0;
    const visibleCards = () => window.innerWidth < 700 ? 1 : 2;

    function updateReviews() {
      const cardWidth = reviewCards[0].offsetWidth + 20;
      const maxIdx = reviewCards.length - visibleCards();
      revIdx = Math.max(0, Math.min(revIdx, maxIdx));
      track.style.transform = `translateX(-${revIdx * cardWidth}px)`;
    }

    document.getElementById('revNext').addEventListener('click', () => {
      revIdx = Math.min(revIdx + 1, reviewCards.length - visibleCards());
      updateReviews();
    });
    document.getElementById('revPrev').addEventListener('click', () => {
      revIdx = Math.max(revIdx - 1, 0);
      updateReviews();
    });
    window.addEventListener('resize', updateReviews);
  }

  // ── FADE-UP ON SCROLL (recognition logos + review cards) ──
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up', 'visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.logo-item, .review-card').forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
  });

  // ── SMOOTH SCROLL for in-page anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return; // placeholder links: do nothing
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});