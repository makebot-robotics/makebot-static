'use strict';
/* ============================================================
   MAKEBOT ADMIN PAGE
   Handles login and rendering/editing for admin.html.
   Token is kept only in a JS variable (not localStorage) --
   refreshing the page requires logging in again. That's a
   deliberate choice for a simple, low-risk admin setup.
   ============================================================ */

const API_BASE = 'http://localhost:4000';
let adminToken = null;

const $ = id => document.getElementById(id);

// LOGIN
$('loginBtn').addEventListener('click', () => {
  const password = $('passwordInput').value;
  $('loginMsg').textContent = '';

  fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    })
    .then(data => {
      adminToken = data.token;
      $('loginBox').style.display = 'none';
      $('app').style.display = 'block';
      loadEverything();
    })
    .catch(err => {
      $('loginMsg').textContent = err.message;
    });
});

// AUTH HELPER
function adminFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'x-admin-token': adminToken,
    },
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  });
}

function fmt(n) { return '\u20B9' + Number(n).toLocaleString('en-IN'); }

function loadEverything() {
  loadProducts();
  loadOrders();
  loadFailedPayments();
}

// PRODUCTS
function loadProducts() {
  adminFetch('/api/admin/products')
    .then(renderProducts)
    .catch(err => alert('Failed to load products: ' + err.message));
}

function renderProducts(products) {
  const body = $('productsBody');
  body.innerHTML = products.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td><input type="number" class="priceInput" value="${p.price}" /></td>
      <td><input type="number" class="oldPriceInput" value="${p.old_price ?? ''}" /></td>
      <td><input type="number" class="stockInput" value="${p.stock}" /></td>
      <td><button class="saveBtn">Save</button></td>
    </tr>
  `).join('');

  body.querySelectorAll('.saveBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const id = row.dataset.id;
      const price = Number(row.querySelector('.priceInput').value);
      const old_price = row.querySelector('.oldPriceInput').value
        ? Number(row.querySelector('.oldPriceInput').value)
        : null;
      const stock = Number(row.querySelector('.stockInput').value);

      adminFetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, old_price, stock }),
      })
        .then(() => {
          btn.textContent = 'Saved!';
          setTimeout(() => (btn.textContent = 'Save'), 1200);
        })
        .catch(err => alert('Failed to save: ' + err.message));
    });
  });
}

// ORDERS
function loadOrders() {
  adminFetch('/api/admin/orders')
    .then(renderOrders)
    .catch(err => alert('Failed to load orders: ' + err.message));
}

function renderOrders(orders) {
  const body = $('ordersBody');
  body.innerHTML = orders.map(o => `
    <tr>
      <td>${o.order_code}</td>
      <td>${o.full_name} (${o.email})</td>
      <td>${fmt(o.total)}</td>
      <td>${o.status}</td>
      <td>${o.created_at}</td>
    </tr>
  `).join('');
}

// FAILED PAYMENTS
function loadFailedPayments() {
  adminFetch('/api/admin/failed-payments')
    .then(renderFailedPayments)
    .catch(err => alert('Failed to load failed payments: ' + err.message));
}

function renderFailedPayments(rows) {
  const body = $('failedBody');
  if (rows.length === 0) {
    body.innerHTML = `<tr><td colspan="5">None -- good sign.</td></tr>`;
    return;
  }
  body.innerHTML = rows.map(r => `
    <tr>
      <td>${r.razorpay_payment_id}</td>
      <td>${r.full_name || '-'} (${r.email || '-'})</td>
      <td>${r.reason}</td>
      <td>${fmt(r.total)}</td>
      <td>${r.created_at}</td>
    </tr>
  `).join('');
}