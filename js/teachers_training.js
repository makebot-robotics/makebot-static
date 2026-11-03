/* ─── Smooth scroll for nav links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ─── CTA form submit ─── */
const ctaBtn = document.getElementById('cta-btn');
const ctaInput = document.getElementById('cta-input');
const ctaSuccess = document.getElementById('cta-success');

if (ctaBtn && ctaInput && ctaSuccess) {
  ctaBtn.addEventListener('click', () => {
    const val = ctaInput.value.trim();
    if (!val) {
      ctaInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.45)';
      ctaInput.placeholder = 'Please enter your name & number';
      setTimeout(() => {
        ctaInput.style.boxShadow = '';
        ctaInput.placeholder = 'Your name & phone number';
      }, 2000);
      return;
    }
    ctaBtn.textContent = 'Submitted!';
    ctaBtn.disabled = true;
    ctaInput.value = '';
    ctaSuccess.classList.add('visible');
    setTimeout(() => {
      ctaBtn.innerHTML = 'Get a callback <i class="ti ti-arrow-right"></i>';
      ctaBtn.disabled = false;
      ctaSuccess.classList.remove('visible');
    }, 4000);
  });
}

/* ─── Scroll-in animation ─── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

/* Add fade-up style */
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

/* Observe animatable elements */
const animTargets = document.querySelectorAll(
  '.offer-card, .step, .plan-card, .testi-card, .section-title, .section-sub'
);

animTargets.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

/* ─── Stats counter animation ─── */
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1200;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = start + suffix;
    }
  }, 16);
}

const statsData = [
  { value: 800, suffix: '+' },
  { value: 200, suffix: '+' },
  { value: 15,  suffix: '+' }
];

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach((el, i) => {
        if (statsData[i]) animateCounter(el, statsData[i].value, statsData[i].suffix);
      });
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ─── Nav CTA → scroll to CTA form ─── */
const navCta = document.querySelector('.nav-cta');
const ctaSection = document.querySelector('.cta-section');

if (navCta && ctaSection) {
  navCta.addEventListener('click', () => {
    ctaSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => ctaInput && ctaInput.focus(), 600);
  });
}