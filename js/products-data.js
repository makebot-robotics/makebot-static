// ============================================================
//  MAKEBOT  PRODUCTS DATA
//  Loads products from the backend API instead of a hardcoded
//  list. Uses a synchronous request so PRODUCTS is fully
//  populated before any script that loads after this one runs
//  (shop.js, product-details.js, script.js, search.js all
//  expect that, unchanged from before).
//
//  Only the shop-related pages load this file (shop, product
//  details, checkout). The homepage does NOT load it.
//
//  API URL:
//    - On localhost / 127.0.0.1 it defaults to http://localhost:4000
//    - On a live site it is empty until you set it. Before the
//      scripts load, add this to the page (or to this file):
//          window.MAKEBOT_API_BASE = 'https://api.yourdomain.com';
//      With no API URL the request is skipped (PRODUCTS stays []),
//      instead of making a blocking request that is bound to fail.
// ============================================================

const API_BASE = window.MAKEBOT_API_BASE ||
  (['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://localhost:4000' : '');

let PRODUCTS = [];

(function loadProducts() {
  if (!API_BASE) return; // no backend configured for this environment
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_BASE}/api/products`, false); // false = synchronous
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      PRODUCTS = JSON.parse(xhr.responseText);
    } else {
      console.error('[products-data] Failed to load products, status:', xhr.status);
    }
  } catch (err) {
    console.error('[products-data] Could not reach backend:', err);
  }
})();