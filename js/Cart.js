'use strict';
/* ============================================================
   MAKEBOT – SHARED CART MODULE
   ------------------------------------------------------------
   Single source of truth for the cart across index.html,
   shop.html and product_details.html.

   - Persists to localStorage so the cart survives navigation
     between pages (and page refreshes).
   - Renders into the shared cart drawer markup that comes from
     CartDrawer.html (#cartItems / #cartFooter / #cartTotal /
     #cartCount) — same drawer on every page.
   - Requires PRODUCTS (from js/products-data.js) to be loaded
     BEFORE this file, since cart items are stored as {id, qty}
     and looked up against PRODUCTS for name/price/image.

   Load order on every page:
     1. Components.js        (injects Header/Footer/CartDrawer)
     2. js/products-data.js  (defines PRODUCTS)
     3. js/Cart.js           (this file)
     4. page script (script.js / shop.js / product_details.js)

   Usage from a page script:
     document.addEventListener('componentsReady', () => {
       Cart.init();          // binds drawer open/close + renders
     });
     Cart.add(productId, qty);
     Cart.open();
   ============================================================ */

const Cart = (function () {
  const STORAGE_KEY = 'makebot_cart';
  const $ = id => document.getElementById(id);

  // ── PERSISTENCE ──────────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Cart: could not read localStorage, starting empty.', e);
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Cart: could not save to localStorage.', e);
    }
  }

  let items = load(); // [{ id, qty }, ...]

  // ── HELPERS ──────────────────────────────────────────────────
  function findProduct(id) {
    return (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === id) : null;
  }

  function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }

  function notify() {
    persist();
    render();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
  }

  // ── PUBLIC MUTATIONS ─────────────────────────────────────────
  function add(id, qty = 1) {
    const p = findProduct(id);
    if (!p) { console.warn(`Cart: no product with id ${id}`); return; }
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else items.push({ id, qty });
    notify();
  }

  function remove(id) {
    items = items.filter(i => i.id !== id);
    notify();
  }

  function changeQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    notify();
  }

  function clear() {
    items = [];
    notify();
  }

  function count() {
    return items.reduce((s, i) => s + i.qty, 0);
  }

  function total() {
    return items.reduce((s, i) => {
      const p = findProduct(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }

  function getItems() {
    // Return enriched copies (product + qty) for pages that want to display the cart
    return items
      .map(i => {
        const p = findProduct(i.id);
        return p ? { ...p, qty: i.qty } : null;
      })
      .filter(Boolean);
  }

  // ── DRAWER OPEN/CLOSE ────────────────────────────────────────
  function open()  { $('cartDrawer')?.classList.add('open');    $('drawerOverlay')?.classList.add('open'); }
  function close() { $('cartDrawer')?.classList.remove('open'); $('drawerOverlay')?.classList.remove('open'); }

  function bindDrawer() {
    $('cartBtn')?.addEventListener('click', open);
    $('cartClose')?.addEventListener('click', close);
    $('drawerOverlay')?.addEventListener('click', close);
    document.querySelector('.btn-checkout')?.addEventListener('click', () => {
      if (count() === 0) return;
      window.location.href = 'checkout.html';
    });
  }

  // ── RENDER ───────────────────────────────────────────────────
  function render() {
    const countEl = $('cartCount');
    if (countEl) {
      const c = count();
      countEl.textContent   = c > 9 ? '9+' : c;
      countEl.style.display = c > 0 ? 'flex' : 'none';
    }

    const body   = $('cartItems');
    const footer = $('cartFooter');
    if (!body || !footer) return; // drawer not in the DOM yet on this render pass

    if (items.length === 0) {
      body.innerHTML = `<div class="empty-cart"><i class="fa fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
      footer.style.display = 'none';
      return;
    }

    body.innerHTML = items.map(i => {
      const p = findProduct(i.id);
      if (!p) return '';
      const thumb = p.imgs ? p.imgs[0] : p.img;
      return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${thumb}" alt="${p.name}"/></div>
        <div class="cart-item-info">
          <strong>${p.name}</strong>
          <div class="cart-item-price">${fmt(p.price * i.qty)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-id="${p.id}" data-d="-1">−</button>
            <span class="qty-val">${i.qty}</span>
            <button class="qty-btn" data-id="${p.id}" data-d="1">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${p.id}"><i class="fa fa-times"></i></button>
      </div>`;
    }).join('');

    body.querySelectorAll('.qty-btn').forEach(btn =>
      btn.addEventListener('click', () => changeQty(+btn.dataset.id, +btn.dataset.d)));
    body.querySelectorAll('.cart-item-remove').forEach(btn =>
      btn.addEventListener('click', () => remove(+btn.dataset.id)));

    $('cartTotal').textContent = fmt(total());
    footer.style.display = 'flex';
  }

  // ── INIT (call once per page, after componentsReady) ────────
  function init() {
    bindDrawer();
    render();
  }

  return { add, remove, changeQty, clear, count, total, getItems, open, close, render, init, fmt };
})();