'use strict';

// PRODUCTS comes from js/products-data.js, Cart comes from js/Cart.js — both loaded before this file

// ── STATE ─────────────────────────────────────────────────────────────────────
const state = {
  categories: [],
  ages: [],
  prices: [],
  difficulties: [],
  sort: 'best-selling',
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fa fa-check" style="color:var(--pink)"></i> ${msg}`;
  $('toastContainer').appendChild(t);
  setTimeout(() => {
    t.style.animation = 'none';
    t.style.opacity = '0';
    t.style.transform = 'translateX(60px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// Things that don't depend on Header/Footer/CartDrawer can run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  bindFilter();
  bindSort();
});

// Navbar + Cart live inside Header.html / CartDrawer.html, which are injected
// asynchronously by Components.js. We must wait for them to exist in the DOM
// before we try to bind listeners to #navToggle, #cartBtn, #cartDrawer, etc.
document.addEventListener('componentsReady', () => {
  bindNavbar();
  Cart.init(); // binds drawer open/close and renders current cart (persisted across pages)
});

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function bindNavbar() {
  const toggle = $('navToggle');
  const links  = $('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// ── FILTER ────────────────────────────────────────────────────────────────────
function bindFilter() {
  $('filterToggle').addEventListener('click', () => {
    const panel = $('filterPanel');
    const btn   = $('filterToggle');
    const isOpen = panel.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
  });

  document.querySelectorAll('[data-filter]').forEach(cb => {
    cb.addEventListener('change', readFilters);
  });

  $('clearFilters').addEventListener('click', clearFilters);
  $('noResultsClear').addEventListener('click', clearFilters);
}

function readFilters() {
  state.categories   = checked('category');
  state.ages         = checked('age');
  state.prices       = checked('price');
  state.difficulties = checked('difficulty');
  renderGrid();
}

function checked(type) {
  return [...document.querySelectorAll(`[data-filter="${type}"]:checked`)].map(c => c.value);
}

function clearFilters() {
  document.querySelectorAll('[data-filter]').forEach(cb => cb.checked = false);
  state.categories = state.ages = state.prices = state.difficulties = [];
  renderGrid();
}

// ── SORT ─────────────────────────────────────────────────────────────────────
function bindSort() {
  $('sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
}

// ── FILTER & SORT LOGIC ───────────────────────────────────────────────────────
function filteredProducts() {
  let list = [...PRODUCTS];

  if (state.categories.length)
    list = list.filter(p => state.categories.includes(p.category));

  if (state.ages.length)
    list = list.filter(p => state.ages.includes(p.age));

  if (state.difficulties.length)
    list = list.filter(p => state.difficulties.includes(p.difficulty));

  if (state.prices.length) {
    list = list.filter(p => state.prices.some(range => {
      const [lo, hi] = range.split('-').map(Number);
      return p.price >= lo && p.price <= hi;
    }));
  }

  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'newest':     list.sort((a, b) => b.id - a.id); break;
    default: break;
  }

  return list;
}

// ── RENDER GRID ───────────────────────────────────────────────────────────────
function renderGrid() {
  const list = filteredProducts();
  const grid = $('productGrid');
  const none = $('noResults');

  $('resultsCount').textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    grid.innerHTML = '';
    none.style.display = 'flex';
    return;
  }
  none.style.display = 'none';

  grid.innerHTML = list.map(p => {
    // Always use imgs[0] as the card thumbnail
    const cardImg  = p.imgs ? p.imgs[0] : p.img;
    const badgeHTML = p.badge
      ? `<span class="card-badge badge-${p.badge}">${p.badge.charAt(0).toUpperCase() + p.badge.slice(1)}</span>`
      : '';
    const oldHTML = p.oldPrice ? `<span class="card-old">${fmt(p.oldPrice)}</span>` : '';

    return `
    <div class="product-card" data-id="${p.id}">
      <div class="card-img">
        <img src="${cardImg}" alt="${p.name}" loading="lazy"/>
        ${badgeHTML}
        <div class="card-buy-wrap">
          <button class="btn-add" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${p.name}</div>
        <div class="card-price"><strong>${fmt(p.price)}</strong>${oldHTML}</div>
      </div>
    </div>`;
  }).join('');

  // Card click → product detail page
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `product_details.html?id=${card.dataset.id}`;
    });
  });

  // Add to cart button
  grid.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(+btn.dataset.id);
    });
  });
}


// ── CART ──────────────────────────────────────────────────────────────────────
// All cart state, persistence, drawer open/close, and rendering now live in
// js/Cart.js (the shared Cart module) so the cart is identical and stays in
// sync across index.html, shop.html, and product_details.html.
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  Cart.add(id, 1);
  showToast(`${p.name} added to cart`);
}