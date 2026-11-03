// ============================================================
//  MAKEBOT  PRODUCTS DATA
//  Loads products from the backend API instead of a hardcoded
//  list. Uses a synchronous request so PRODUCTS is fully
//  populated before any script that loads after this one runs
//  (shop.js, product_details.js, script.js, search.js all
//  expect that, unchanged from before).
//
//  If you move the backend to a different URL later (e.g. once
//  it's deployed live), update API_BASE below  that's the
//  only thing that needs to change.
// ============================================================

const API_BASE = 'http://localhost:4000';

let PRODUCTS = [];

(function loadProducts() {
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