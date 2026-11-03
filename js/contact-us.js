'use strict';
/* ============================================================
   MAKEBOT CONTACT PAGE
   Handles validation, submit UX, and success/error states for
   the form on Contact-us.html (#contactForm).
   Submission goes to a Google Apps Script web app, which saves
   a row in the Google Sheet and emails the enquiry.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9AICak40ZJov8rxXvCkYGjKijVuSAeprihPSCUmo5mLYqC1r5sjn-7xP9srq2TJO8Ig/exec';

  const form           = document.getElementById('contactForm');
  const submitBtn      = document.getElementById('contactSubmit');
  const submitText     = document.getElementById('contactSubmitText');
  const spinner        = document.getElementById('contactSpinner');
  const successBox     = document.getElementById('contactSuccess');
  const toastContainer = document.getElementById('toastContainer');
  if (!form || !submitBtn) return;

  const fields = {
    name:    { el: document.getElementById('cName'),    err: document.getElementById('err-cName') },
    phone:   { el: document.getElementById('cPhone'),   err: document.getElementById('err-cPhone') },
    email:   { el: document.getElementById('cEmail'),   err: document.getElementById('err-cEmail') },
    reason:  { el: document.getElementById('cReason'),  err: document.getElementById('err-cReason') },
    message: { el: document.getElementById('cMessage'), err: document.getElementById('err-cMessage') },
  };
  const orgField = document.getElementById('cOrg');

  const phoneRe = /^[6-9]\d{9}$/;                 // 10-digit Indian mobile
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, msg) {
    const f = fields[key];
    if (!f) return;
    if (f.err) f.err.textContent = msg || '';
    if (f.el) f.el.classList.toggle('has-error', !!msg);
  }

  function clearErrors() {
    Object.keys(fields).forEach(key => setError(key, ''));
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!fields.name.el.value.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    }

    const phoneVal = fields.phone.el.value.trim();
    if (!phoneVal) {
      setError('phone', 'Please enter your phone number.');
      valid = false;
    } else if (!phoneRe.test(phoneVal)) {
      setError('phone', 'Enter a valid 10-digit mobile number.');
      valid = false;
    }

    const emailVal = fields.email.el.value.trim();
    if (!emailVal) {
      setError('email', 'Please enter your email address.');
      valid = false;
    } else if (!emailRe.test(emailVal)) {
      setError('email', 'Enter a valid email address.');
      valid = false;
    }

    if (!fields.reason.el.value) {
      setError('reason', 'Please select a reason.');
      valid = false;
    }

    if (!fields.message.el.value.trim()) {
      setError('message', 'Please enter a message.');
      valid = false;
    }

    return valid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    if (submitText) submitText.textContent = isLoading ? 'Sending...' : 'Send Message';
  }

  function showToast(message, type) {
    if (!toastContainer) { alert(message); return; }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type || 'info'}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // ---- Sends the enquiry to Google Apps Script (Sheet + email) ----
  function submitContactForm(data) {
    const reasonLabel = fields.reason.el.selectedOptions[0]
      ? fields.reason.el.selectedOptions[0].text
      : data.reason;

    // These names must match the contact list in the Apps Script
    const payload = new URLSearchParams();
    payload.append('formType', 'contact');
    payload.append('Full Name', data.name);
    payload.append('Phone Number', data.phone);
    payload.append('Email Address', data.email);
    payload.append('School / Organization', data.organization || '-');
    payload.append('What can we help with?', reasonLabel);
    payload.append('Message', data.message);

    return fetch(SCRIPT_URL, { method: 'POST', body: payload })
      .then(r => r.text().then(text => {
        console.log('Status:', r.status, 'Response:', text);
        return JSON.parse(text);
      }))
      .then(json => {
        if (!json.success) throw new Error(json.message || 'Request failed');
      });
  }
  // ------------------------------------------------------------------

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: fields.name.el.value.trim(),
      phone: fields.phone.el.value.trim(),
      email: fields.email.el.value.trim(),
      organization: orgField ? orgField.value.trim() : '',
      reason: fields.reason.el.value,
      message: fields.message.el.value.trim(),
    };

    setLoading(true);
    submitContactForm(data)
      .then(() => {
        setLoading(false);
        form.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
      })
      .catch((err) => {
        console.error('Contact form error:', err);
        setLoading(false);
        showToast('Something went wrong. Please try again.', 'error');
      });
  });

  // Clear a field's error as soon as the user fixes it
  Object.keys(fields).forEach(key => {
    const el = fields[key].el;
    if (!el) return;
    el.addEventListener('input', () => setError(key, ''));
    el.addEventListener('change', () => setError(key, ''));
  });
});