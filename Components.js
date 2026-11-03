Promise.all([
  fetch('Header.html').then(r => r.text()),
  fetch('Footer.html').then(r => r.text()),
  fetch('Cartdrawer.html').then(r => r.text())
]).then(([headerData, footerData, cartDrawerData]) => {
  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  const cartEl   = document.getElementById('cart-drawer-placeholder');

  if (headerEl) headerEl.innerHTML = headerData;
  if (footerEl) footerEl.innerHTML = footerData;
  if (cartEl)   cartEl.innerHTML   = cartDrawerData;

  document.dispatchEvent(new Event('componentsReady'));
});