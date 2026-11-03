/* =========================================================
   animations.js  —  Scroll animations & UI interactions
   Add this AFTER your main.js on every page:
   <script src="animations.js"></script>
   ========================================================= */


/* ─── 1. Smooth scroll for any in-page anchor link ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});




/* ─── 4. Fade-up scroll animation ─── */

/* Inject CSS */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-up.in-view {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

/* Observer */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      fadeObserver.unobserve(entry.target); /* animate once only */
    }
  });
}, {
  threshold:  0.12,
  rootMargin: '0px 0px -40px 0px'
});


/*
  Add class names from your other pages below.
  Existing ones are kept so current pages still work.
*/
const ANIMATE_SELECTORS = [
  '.offer-card',
  '.step',
  '.plan-card',
  '.testi-card',
  '.section-title',
  '.section-sub',
  '.pg',
  '.hero',
  '.sec',
  '.sec sec-alt',
  '.inc card',
  '.cta'
  /* ↓ add new page class names here */
  // '.feature-card',
  // '.team-card',
  // '.blog-card',
].join(', ');

document.querySelectorAll(ANIMATE_SELECTORS).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`; /* max 240ms stagger */
  fadeObserver.observe(el);
});



