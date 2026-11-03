// ===================== SECTION 3: Competitions — map swaps on hover =====================
(function () {
  var items = document.querySelectorAll('.v2-comp-item');
  var mapImg = document.getElementById('v2-comp-map-img');

  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      var mapSrc = item.getAttribute('data-map');
      if (mapSrc && mapImg) {
        mapImg.src = mapSrc;
      }
      items.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });
})();

// ===================== SECTION 2: image slider (auto-loop) =====================
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.v2-slider').forEach(function (slider) {
    var track = slider.querySelector('.v2-slider-track');
    var total = track.children.length;
    if (total < 2) return;

    var interval = parseInt(slider.getAttribute('data-interval'), 10) || 3500;
    var index = 0;

    // clone the first slide at the end so the loop wraps smoothly
    var clone = track.children[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);

    setInterval(function () {
      index++;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }, interval);

    // after sliding onto the clone, jump back to the real first slide with no animation
    track.addEventListener('transitionend', function (e) {
      if (e.target !== track || index < total) return;
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0)';
      void track.offsetWidth;          // force reflow so the jump is applied
      track.style.transition = '';
    });
  });
})();

// Section 4 (Registration) and Section 5 (Materials) need no page-specific JS —
// registration form logic lives in js/registration.js (shared with makeX-registration.html).