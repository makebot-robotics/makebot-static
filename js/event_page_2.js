'use strict';
/* ============================================================
   EVENTS SWITCHER -- static HTML, JS only shows/hides
   Each event's full content already exists in the HTML as a
   .es-content block. Clicking a tab just toggles which block
   is visible -- nothing is built or rendered by JS.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const AUTO_SWITCH_SECONDS = 15 ; // change this one number to adjust timing

  const tabs = Array.from(document.querySelectorAll('.es-tab'));
  const contents = document.querySelectorAll('.es-content');
  const panelWrap = document.querySelector('.events-switcher');

  let currentIndex = tabs.findIndex(t => t.classList.contains('active'));
  if (currentIndex === -1) currentIndex = 0;

  let timer = null;

  function activate(index) {
    currentIndex = index;
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tabs[index].classList.add('active');
    document.getElementById(tabs[index].dataset.target).classList.add('active');
  }

  function startAutoSwitch() {
    stopAutoSwitch();
    timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tabs.length;
      activate(nextIndex);
    }, AUTO_SWITCH_SECONDS * 1000);
  }

  function stopAutoSwitch() {
    if (timer) clearInterval(timer);
  }

  // Manual click: jump to that tab and restart the auto-switch timer
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activate(index);
      startAutoSwitch();
    });
  });

  // Pause while hovering the panel, resume on mouse leave
  if (panelWrap) {
    panelWrap.addEventListener('mouseenter', stopAutoSwitch);
    panelWrap.addEventListener('mouseleave', startAutoSwitch);
  }

  startAutoSwitch();
});

/* YouTube embed builder for cards 04 and 06 */
document.querySelectorAll('.yt-embed-wrap').forEach(function (wrap) {
  var id = wrap.getAttribute('data-yt-id');
  if (id && id !== 'YOUR_YOUTUBE_ID') {
    wrap.classList.remove('empty');
    wrap.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + id +
      '?rel=0&modestbranding=1" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen></iframe>';
  }
});