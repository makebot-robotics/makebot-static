'use strict';
/* ============================================================
   MAKEBOT - SITE SEARCH
   Works on every page. Load AFTER Components.js (and after
   js/products-data.js on pages that have it, though it's not
   required — this file checks for PRODUCTS before using it).

   Load order:
     1. Components.js
     2. js/products-data.js   (optional, only on index/shop/product_details)
     3. js/Cart.js            (optional, same pages as above)
     4. js/search.js          (this file)
     5. page script
   ============================================================ */

document.addEventListener('componentsReady', () => {
  const btn = document.getElementById('searchBtn');
  const wrap = document.getElementById('navSearch');
  const form = document.getElementById('searchForm');
  const input = document.getElementById('navSearchInput');
  const results = document.getElementById('searchResults');
  if (!btn || !wrap || !form || !input || !results) return;

  const fmt = n => '₹' + n.toLocaleString('en-IN');
  let debounceTimer;

  function openSearch() { wrap.classList.add('open'); input.focus(); }
  function closeSearch() { wrap.classList.remove('open'); results.classList.remove('open'); }

  btn.addEventListener('click', () => {
    wrap.classList.contains('open') ? closeSearch() : openSearch();
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target) && e.target !== btn && !btn.contains(e.target)) closeSearch();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    goToShop(input.value.trim());
  });

  function goToShop(query) {
    if (!query) return;
    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (typeof PRODUCTS === 'undefined') return;

    if (!q) { results.classList.remove('open'); results.innerHTML = ''; return; }
    debounceTimer = setTimeout(() => renderSuggestions(q), 150);
  });

  function renderSuggestions(q) {
    const term = q.toLowerCase();
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.desc && p.desc.toLowerCase().includes(term))
    ).slice(0, 6);

    if (matches.length === 0) {
      results.innerHTML = `<div class="search-result-empty">No products found for "${escapeHtml(q)}"</div>
        <a class="search-result-viewall" href="shop.html?search=${encodeURIComponent(q)}">Search full shop &rarr;</a>`;
      results.classList.add('open');
      return;
    }

    results.innerHTML = matches.map(p => {
      const img = p.imgs ? p.imgs[0] : p.img;
      return `
      <div class="search-result-item" data-id="${p.id}">
        <img src="${img}" alt="${escapeHtml(p.name)}"/>
        <div>
          <div class="sr-name">${escapeHtml(p.name)}</div>
          <div class="sr-price">${fmt(p.price)}</div>
        </div>
      </div>`;
    }).join('') + `<a class="search-result-viewall" href="shop.html?search=${encodeURIComponent(q)}">View all results &rarr;</a>`;

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.href = `product_details.html?id=${item.dataset.id}`;
      });
    });
    results.classList.add('open');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': ' ', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
});