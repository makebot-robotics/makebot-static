/* =========================================
   MAKEBOT – STEAM EDUCATION PAGE SCRIPT
   ========================================= */

document.addEventListener('componentsReady', () => {

  // ── NAVBAR SCROLL ──────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── MOBILE NAV TOGGLE ──────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.querySelector('i').className =
      navLinks.classList.contains('open') ? 'fa fa-times' : 'fa fa-bars';
  });

  // ── SHARED CART (same cart as shop.html / product_details.html) ──
  // PRODUCTS comes from js/products-data.js, Cart comes from js/Cart.js —
  // both are loaded before this file.
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
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 8000); // previous value :  5000
  }

  function resetSlider() {
    clearInterval(sliderTimer);
    startSlider();
  }

  document.getElementById('nextSlide').addEventListener('click', (e) => {
    e.stopPropagation();          // prevent triggering slide click
    goToSlide(currentSlide + 1);
    resetSlider();
  });
  document.getElementById('prevSlide').addEventListener('click', (e) => {
    e.stopPropagation();          // prevent triggering slide click
    goToSlide(currentSlide - 1);
    resetSlider();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();        // prevent triggering slide click
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

  // ── COUNTER ANIMATION ──────────────────────
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.nextElementSibling;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      // Format large numbers with K
      if (target >= 1000) {
        el.textContent = Math.floor(current / 1000) + (current >= target ? '' : '');
      } else {
        el.textContent = Math.floor(current);
      }
      if (current >= target) {
        el.textContent = target >= 1000 ? target / 1000 : target;
        clearInterval(timer);
      }
    }, step);
  }

  const counters = document.querySelectorAll('.stat-number');
  let countersStarted = false;
  const statsSection = document.querySelector('.stats-section');

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.4 });
  if (statsSection) statsObserver.observe(statsSection);

  // ── PRODUCT SHOWCASE (real catalog, same data as shop.html) ───
  // Each homepage tab is a filter over the real PRODUCTS array from
  // js/products-data.js — NOT a separate hardcoded product list.
  // Adjust these filters any time without touching markup or CSS.
  //
  // NOTE: there are currently no products with category 'laser' in
  // products-data.js (no xTool items exist yet in the real catalog).
  // The "Laser Tools" tab will show an empty state until real laser
  // products are added there. See the chat explanation for options.
  const TAB_FILTERS = {
    bestseller: p => p.badge === 'bestseller',
    stem:       p => ['robotics', 'electronics', 'coding', 'science'].includes(p.category),
    newArrivals: p => p.badge === 'new',
    laser:      p => p.category === 'laser',
  };

  function getTabProducts(tab) {
    const filterFn = TAB_FILTERS[tab] || TAB_FILTERS.bestseller;
    return [...PRODUCTS]
      .filter(filterFn)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }

  function renderProducts(tab) {
    const grid = document.getElementById('productGrid');
    const items = getTabProducts(tab);

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:14px;padding:60px 0;text-align:center;color:var(--text-muted);">
          <i class="fa fa-box-open" style="font-size:36px;opacity:0.3;"></i>
          <p>More products coming soon in this category.</p>
        </div>`;
      return;
    }

    grid.innerHTML = '';
    items.forEach((p, i) => {
      const cardImg = p.imgs ? p.imgs[0] : p.img;
      const card = document.createElement('div');
      card.className = 'product-card fade-up';
      card.style.transitionDelay = `${i * 80}ms`;
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="product-img">
          ${p.badge ? `<div class="product-badge">${p.badge.charAt(0).toUpperCase() + p.badge.slice(1)}</div>` : ''}
          <img src="${cardImg}" alt="${p.name}" />
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div>
            <span class="product-price">${Cart.fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old">${Cart.fmt(p.oldPrice)}</span>` : ''}
          </div>
          <button class="btn-buy" data-id="${p.id}">Buy Now</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Click anywhere on the card → real product detail page (same as shop.html)
    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `product_details.html?id=${card.dataset.id}`;
      });
    });

    // Buy Now → adds to the SAME cart used on shop.html / product_details.html
    grid.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // don't also trigger the card's navigate-to-detail click
        const id = +btn.dataset.id;
        Cart.add(id, 1);

        const original = btn.textContent;
        btn.textContent = 'Added ✓';
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
        }, 1800);
      });
    });

    requestAnimationFrame(() => {
      grid.querySelectorAll('.fade-up').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 10);
      });
    });
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-tab'));
    });
  });
  renderProducts('bestseller');

  // ── REVIEW CAROUSEL ────────────────────────
  const track = document.getElementById('reviewsTrack');
  const reviewCards = track.querySelectorAll('.review-card');
  let revIdx = 0;
  const visibleCards = () => window.innerWidth < 700 ? 1 : 2;

  function updateReviews() {
    const cardWidth = reviewCards[0].offsetWidth + 20;
    const maxIdx = reviewCards.length - visibleCards();
    revIdx = Math.max(0, Math.min(revIdx, maxIdx));
    track.style.transform = `translateX(-${revIdx * (cardWidth)}px)`;
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

  // ── INTERSECTION OBSERVER (fade-up) ────────
  const fadeEls = document.querySelectorAll(
    '.feature-card, .action-row, .resource-card, .stat-item, .perk-item, .logo-item, .review-card, .gram-item'
  );
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up', 'visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
  });

  // ── SUBSCRIBE FORM ─────────────────────────
  document.getElementById('subBtn').addEventListener('click', () => {
    const input = document.getElementById('subEmail');
    if (!input.value || !input.value.includes('@')) {
      input.style.borderColor = 'var(--brand-danger)';
      input.placeholder = 'Enter a valid email';
      setTimeout(() => { input.style.borderColor = ''; input.placeholder = 'Your email address'; }, 2000);
      return;
    }
    const btn = document.getElementById('subBtn');
    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });

  // ── GRAM ITEMS CLICK ───────────────────────
  document.querySelectorAll('.gram-item').forEach(item => {
    item.addEventListener('click', () => {
      window.open('https://instagram.com', '_blank');
    });
  });

  // ── SMOOTH SCROLL for anchor links ─────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});