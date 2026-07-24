(function () {
  'use strict';

  /* ---- Feature 1: Contact Form Validation & Submission ---- */

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var responseEl = document.getElementById('formResponse');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        showFormResponse(responseEl, 'Please fill in all fields.', false);
        return;
      }

      if (!emailRegex.test(email)) {
        showFormResponse(responseEl, 'Please enter a valid email address.', false);
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      showFormResponse(responseEl, 'Sending...', true, 'neutral');

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            showFormResponse(responseEl, result.data.message, true);
            form.reset();
          } else {
            showFormResponse(responseEl, result.data.message || 'Something went wrong.', false);
          }
        })
        .catch(function () {
          showFormResponse(responseEl, 'Network error. Please try again later.', false);
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  function showFormResponse(el, message, isSuccess, typeOverride) {
    if (!el) return;

    el.textContent = message;
    el.classList.add('visible');
    el.classList.remove('success', 'error');

    if (typeOverride === 'neutral') {
      el.style.background = '#e8f4fd';
      el.style.color = '#2c3e50';
      el.style.border = '1px solid #bde0fe';
    } else {
      el.style.background = '';
      el.style.color = '';
      el.style.border = '';
      el.classList.add(isSuccess ? 'success' : 'error');
    }
  }

  /* ---- Feature 2: Project Category Filter ---- */

  function initProjectFilter() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---- Feature 3: Image Modal / Lightbox ---- */

  function initImageModal() {
    var modal = document.getElementById('imageModal');
    var modalImage = document.getElementById('modalImage');
    var closeBtn = modal ? modal.querySelector('.modal-close') : null;
    var zoomableImages = document.querySelectorAll('.zoomable-img');

    if (!modal || !modalImage || zoomableImages.length === 0) return;

    zoomableImages.forEach(function (img) {
      img.addEventListener('click', function () {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modalImage.src = '';
    }
  }

  /* ---- Initialize all features on DOM ready ---- */

  document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initProjectFilter();
    initImageModal();
  });
})();
