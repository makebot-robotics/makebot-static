'use strict';

// PRODUCTS comes from js/products-data.js, Cart comes from js/Cart.js — both loaded before this file

// ── STATE ─────────────────────────────────────────────────────────────────────
let qty = 1;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => '₹' + n.toLocaleString('en-IN');

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fa fa-check" style="color:var(--pink)"></i> ${msg}`;
  $('toastContainer').appendChild(t);
  setTimeout(() => {
    t.style.transition = 'all 0.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(60px)';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

function starsHTML(rating) {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// Things that don't depend on Header.html / CartDrawer.html can run immediately
document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const id      = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    document.querySelector('.product-main').innerHTML =
      '<div class="container" style="padding:80px 0;text-align:center;color:var(--muted)">Product not found. <a href="shop.html" style="color:var(--purple)">Back to Shop</a></div>';
    return;
  }

  renderProduct(product);
  renderRelated(product);
});

// Navbar + Cart live inside Header.html / CartDrawer.html, which are injected
// asynchronously by Components.js. Wait for them before binding listeners.
document.addEventListener('componentsReady', () => {
  bindNavbar();
  Cart.init(); // binds drawer open/close and renders current cart (persisted across pages)
});

// ── RENDER PRODUCT ────────────────────────────────────────────────────────────
function renderProduct(p) {
  $('breadcrumbName').textContent = p.name;
  document.title = `${p.name} – MakeBot`;

  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  const thumbsHTML = p.imgs.map((src, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <img src="${src}" alt="${p.name} view ${i + 1}" loading="lazy"/>
    </div>`).join('');

  const specsHTML = Object.entries(p.specs).map(([label, val]) => `
    <div class="spec-item">
      <div class="spec-label">${label}</div>
      <div class="spec-value">${val}</div>
    </div>`).join('');

  const badgeHTML = p.badge
    ? `<span class="meta-badge badge-${p.badge}">${p.badge.charAt(0).toUpperCase() + p.badge.slice(1)}</span>`
    : '';

  $('productLayout').innerHTML = `
    <div class="gallery">
      <div class="gallery-main">
        <img id="mainImg" src="${p.imgs[0]}" alt="${p.name}"/>
      </div>
      <div class="gallery-thumbs" id="thumbs">
        ${thumbsHTML}
      </div>
    </div>

    <div class="product-info">
      <div class="product-meta">
        <span class="meta-tag">${p.category}</span>
        <span class="meta-dot">·</span>
        <span class="meta-tag">Ages ${p.age}</span>
        ${badgeHTML}
      </div>

      <h1 class="product-name">${p.name}</h1>

      <div class="product-rating">
        <span class="stars">${starsHTML(p.rating)}</span>
        <span class="rating-text">${p.rating} (${p.reviews} reviews)</span>
      </div>

      <div class="product-price-row">
        <span class="product-price">${fmt(p.price)}</span>
        ${p.oldPrice ? `<span class="product-old">${fmt(p.oldPrice)}</span><span class="product-discount">${discount}% off</span>` : ''}
      </div>

      <p class="product-desc">${p.desc}</p>

      <div>
        <div class="specs-title">Specifications</div>
        <div class="specs-grid">${specsHTML}</div>
      </div>

      <div class="qty-row">
        <span class="qty-label">Quantity</span>
        <div class="qty-control">
          <button id="qtyMinus">−</button>
          <span id="qtyVal">1</span>
          <button id="qtyPlus">+</button>
        </div>
      </div>

      <div class="action-btns">
        <button class="btn-cart" id="btnCart">
          <i class="fa fa-shopping-bag"></i> Add to Cart
        </button>
        <button class="btn-buynow" id="btnBuyNow">
          <i class="fa fa-bolt"></i> Buy Now
        </button>
      </div>

      <div class="perks-row">
        <div class="perk"><i class="fa fa-shipping-fast"></i> Free delivery above ₹999</div>
        <div class="perk"><i class="fa fa-undo"></i> 7-day returns</div>
        <div class="perk"><i class="fa fa-shield-alt"></i> Secure checkout</div>
      </div>
    </div>`;

  // Gallery thumbnails
  const mainImg = $('mainImg');
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = p.imgs[+thumb.dataset.idx];
        mainImg.style.opacity = '1';
      }, 200);
    });
  });

  // Quantity
  $('qtyMinus').addEventListener('click', () => { if (qty > 1)  { qty--; $('qtyVal').textContent = qty; } });
  $('qtyPlus').addEventListener('click',  () => { if (qty < 99) { qty++; $('qtyVal').textContent = qty; } });

  // Add to cart
  $('btnCart').addEventListener('click', () => {
    Cart.add(p.id, qty);
    showToast(`${p.name} × ${qty} added to cart`);
  });

  // Buy Now
  $('btnBuyNow').addEventListener('click', () => {
    Cart.add(p.id, qty);
    Cart.open();
  });
}

// ── RENDER RELATED ────────────────────────────────────────────────────────────
function renderRelated(current) {
  const related = PRODUCTS.filter(p => p.id !== current.id && p.category === current.category).slice(0, 4);

  if (related.length < 4) {
    const others = PRODUCTS.filter(p => p.id !== current.id && p.category !== current.category);
    related.push(...others.slice(0, 4 - related.length));
  }

  $('relatedGrid').innerHTML = related.map(p => `
    <div class="rel-card" data-id="${p.id}">
      <div class="rel-img">
        <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy"/>
      </div>
      <div class="rel-info">
        <div class="rel-name">${p.name}</div>
        <div class="rel-price">
          <strong>${fmt(p.price)}</strong>
          ${p.oldPrice ? `<span style="text-decoration:line-through;font-size:12px;color:var(--muted)">${fmt(p.oldPrice)}</span>` : ''}
        </div>
      </div>
    </div>`).join('');

  $('relatedGrid').querySelectorAll('.rel-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `product_details.html?id=${card.dataset.id}`;
    });
  });
}

// ── CART ──────────────────────────────────────────────────────────────────────
// All cart state, persistence, drawer open/close, and rendering now live in
// js/Cart.js (the shared Cart module) so the cart is identical and stays in
// sync across index.html, shop.html, and product_details.html.

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function bindNavbar() {
  const toggle = $('navToggle');
  const links  = $('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}