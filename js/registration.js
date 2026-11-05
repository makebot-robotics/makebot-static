'use strict';
/* MAKEX REGISTRATION FORM -> Google Apps Script (Sheet + email) */

document.addEventListener('DOMContentLoaded', () => {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9AICak40ZJov8rxXvCkYGjKijVuSAeprihPSCUmo5mLYqC1r5sjn-7xP9srq2TJO8Ig/exec'
  const form = document.getElementById('regForm');
  if (!form) return;
  const submitBtn = form.querySelector('.reg-submit');

  const msg = document.createElement('p');
  msg.className = 'reg-message';
  msg.setAttribute('role', 'status');
  form.appendChild(msg);

  // hidden spam trap
  const bot = document.createElement('input');
  bot.type = 'checkbox';
  bot.name = 'botcheck';
  bot.style.display = 'none';
  bot.tabIndex = -1;
  bot.setAttribute('autocomplete', 'off');
  form.appendChild(bot);

  function showMessage(text, type) {
    msg.textContent = text;
    msg.className = 'reg-message ' + (type || '');
  }

  const val = (id) => {
    const el = document.getElementById(id);
    return el.tagName === 'SELECT' ? el.selectedOptions[0].text : el.value.trim();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('', '');

    const country = document.getElementById('country').value;
    const mobile = document.getElementById('mobile').value
      .replace(/[\s-]/g, '').replace(/^\+91/, '');
    if (country === 'India' && !/^\d{10}$/.test(mobile)) {
      showMessage('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    // These names must match the list in the Apps Script
    const payload = new URLSearchParams();
    payload.append('formType', 'registration');
    if (bot.checked) payload.append('botcheck', 'true');
    payload.append('Student Name', val('studentName'));
    payload.append('Email Address', val('email'));
    payload.append('Mobile Number', val('mobile'));
    payload.append('Address', val('address'));
    payload.append('Select Your Grade', val('grade'));
    payload.append('Select Your Country', val('country'));
    payload.append('Select Competition', document.getElementById('competition').value);
    payload.append('School Name', val('schoolName'));
    payload.append('City', val('city'));

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: payload });
      const text = await res.text();
      const json = JSON.parse(text);
      if (!json.success) throw new Error(json.message || 'Failed');

      form.reset();
      showMessage('Registration successful! We will contact you soon.', 'success');
    } catch (err) {
      console.error('Registration error:', err);
      showMessage('Something went wrong. Please try again or contact us.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    }
  });
});