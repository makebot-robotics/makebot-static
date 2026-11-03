'use strict';

// PRODUCTS comes from js/products-data.js, Cart comes from js/Cart.js — both loaded before this file

const $ = id => document.getElementById(id);
const fmt = n => '₹' + n.toLocaleString('en-IN');

const DELIVERY_FEE_THRESHOLD = 999; // free delivery above this subtotal
const DELIVERY_FEE = 79;

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('componentsReady', () => {
  bindNavbar();
  Cart.init();           // binds drawer open/close + renders the shared cart drawer
  renderOrderSummary();  // renders the checkout page's own order summary panel
  bindPaymentOptions();
  bindPlaceOrder();

  // Keep the order summary in sync if the cart changes (e.g. via the drawer
  // qty buttons) while the user is still on this page.
  document.addEventListener('cartUpdated', renderOrderSummary);
});

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function bindNavbar() {
  const toggle = $('navToggle');
  const links = $('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// ── ORDER SUMMARY ─────────────────────────────────────────────────────────────
function renderOrderSummary() {
  const items = Cart.getItems(); // [{...product, qty}]
  const layout = $('checkoutLayout');
  const empty = $('checkoutEmpty');

  if (items.length === 0) {
    layout.style.display = 'none';
    empty.style.display = 'flex';
    return;
  }
  layout.style.display = 'grid';
  empty.style.display = 'none';

  const summaryItems = $('summaryItems');
  summaryItems.innerHTML = items.map(p => {
    const thumb = p.imgs ? p.imgs[0] : p.img;
    return `
    <div class="summary-item">
      <div class="summary-item-img"><img src="${thumb}" alt="${p.name}"/></div>
      <div class="summary-item-info">
        <strong>${p.name}</strong>
        <span class="summary-item-qty">Qty: ${p.qty}</span>
      </div>
      <div class="summary-item-price">${fmt(p.price * p.qty)}</div>
    </div>`;
  }).join('');

  const subtotal = Cart.total();
  const delivery = subtotal >= DELIVERY_FEE_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  $('sumSubtotal').textContent = fmt(subtotal);
  $('sumDelivery').textContent = delivery === 0 ? 'Free' : fmt(delivery);
  $('sumTotal').textContent = fmt(total);
}

// ── PAYMENT OPTIONS (visual selection only — demo checkout) ──────────────────
function bindPaymentOptions() {
  const options = document.querySelectorAll('.payment-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      opt.querySelector('input[type="radio"]').checked = true;
    });
  });
}

// ── FORM VALIDATION ───────────────────────────────────────────────────────────
function validateForm() {
  const fields = {
    fullName: { value: $('fullName').value.trim(), test: v => v.length >= 3, msg: 'Enter your full name' },
    phone: { value: $('phone').value.trim(), test: v => /^\d{10}$/.test(v), msg: 'Enter a valid 10-digit phone number' },
    email: { value: $('email').value.trim(), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address' },
    address: { value: $('address').value.trim(), test: v => v.length >= 5, msg: 'Enter your address' },
    city: { value: $('city').value.trim(), test: v => v.length >= 2, msg: 'Enter your city' },
    state: { value: $('state').value.trim(), test: v => v.length >= 2, msg: 'Enter your state' },
    pincode: { value: $('pincode').value.trim(), test: v => /^\d{6}$/.test(v), msg: 'Enter a valid 6-digit pincode' },
  };

  let valid = true;
  Object.entries(fields).forEach(([key, f]) => {
    const input = $(key);
    const errEl = $(`err-${key}`);
    const ok = f.test(f.value);
    if (!ok) valid = false;
    input.classList.toggle('invalid', !ok);
    if (errEl) errEl.textContent = ok ? '' : f.msg;
  });

  return { valid, values: Object.fromEntries(Object.entries(fields).map(([k, f]) => [k, f.value])) };
}

// ── PLACE ORDER ───────────────────────────────────────────────────────────────


function bindPlaceOrder() {
  $('btnPlaceOrder').addEventListener('click', () => {
    if (Cart.count() === 0) return;

    const { valid, values } = validateForm();
    if (!valid) {
      showToast('Please fix the highlighted fields');
      const firstInvalid = document.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const items = Cart.getItems().map(p => ({
      id: p.id, name: p.name, price: p.price, qty: p.qty,
    }));

    const btn = $('btnPlaceOrder');
    btn.disabled = true;
    btn.textContent = 'Starting payment...';

    // STEP 1: ask our backend to create a Razorpay order
    fetch(`${API_BASE}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not start payment');
        return res.json();
      })
      .then(data => {
        // STEP 2: open Razorpay's checkout popup
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Makebot',
          description: 'Order Payment',
          order_id: data.razorpayOrderId,
          prefill: {
            name: values.fullName,
            email: values.email,
            contact: values.phone,
          },
          handler: function (response) {
            // STEP 3: payment succeeded on Razorpay's side -- now verify it on our backend
            btn.textContent = 'Confirming order...';

            fetch(`${API_BASE}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                ...values,
                items,
              }),
            })
              .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                  const err = new Error(data.error || 'Verification failed');
                  err.paymentId = data.paymentId;
                  throw err;
                }
                return data;
              })
              .then(orderData => {
                $('successName').textContent = `, ${values.fullName.split(' ')[0]}`;
                $('successEmail').textContent = values.email;
                $('successOrderId').textContent = orderData.orderCode;
                $('successOverlay').classList.add('open');
                Cart.clear();
              })
              .catch((err) => {
                const refText = err.paymentId ? ` Payment ID: ${err.paymentId}` : '';
                showToast(`${err.message || 'Payment succeeded but we could not confirm your order.'}${refText}`, { critical: true });
              })
              .finally(() => {
                btn.disabled = false;
                btn.textContent = 'Place Order';
              });
          },
          modal: {
            ondismiss: function () {
              // user closed the popup without paying
              btn.disabled = false;
              btn.textContent = 'Place Order';
            },
          },
          theme: { color: '#C93590' },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      })
      .catch(() => {
        showToast('Could not start payment. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Place Order';
      });
  });
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(msg, opts = {}) {
  const t = document.createElement('div');
  t.className = 'toast' + (opts.critical ? ' toast-critical' : '');
  t.innerHTML = `<i class="fa fa-exclamation-circle" style="color:var(--pink)"></i> ${msg}`;
  $('toastContainer').appendChild(t);
  const duration = opts.critical ? 10000 : 2500; // critical errors stay 10s instead of 2.5s
  setTimeout(() => {
    t.style.transition = 'all 0.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(60px)';
    setTimeout(() => t.remove(), 300);
  }, duration);
}