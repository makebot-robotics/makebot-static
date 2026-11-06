// Header, footer and cart drawer.
//
// Built site (npm run build):  these are already inside every page, so nothing
//                              is fetched and the page shows them immediately.
// Unbuilt source pages:        if a placeholder is still empty, the matching
//                              file is fetched and inserted, exactly like before.
//
// Either way, 'componentsReady' is fired once everything is in place.
(function () {
  var parts = [
    ['header-placeholder', 'Header.html'],
    ['footer-placeholder', 'Footer.html'],
    ['cart-drawer-placeholder', 'Cartdrawer.html']
  ];

  var pending = [];
  parts.forEach(function (p) {
    var el = document.getElementById(p[0]);
    if (el && !el.firstElementChild) {
      pending.push(
        fetch(p[1])
          .then(function (r) { return r.text(); })
          .then(function (html) { el.innerHTML = html; })
      );
    }
  });

  function ready() {
    document.dispatchEvent(new Event('componentsReady'));
  }

  if (pending.length) {
    // Source page (not built): same behaviour as the old version.
    Promise.all(pending).then(ready);
  } else {
    // Built page: wait until the whole page and every script has loaded, so all
    // scripts have had the chance to listen for 'componentsReady'.
    var fire = function () { setTimeout(ready, 0); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fire);
    } else {
      fire();
    }
  }
})();
