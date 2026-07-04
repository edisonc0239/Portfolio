// Gallery pan, lightbox, AJAX contact form.
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;

  // --- Hover-scroll pan: slow, readable scroll through the full screenshot. ---
  // Duration scales with height but is clamped so short pages still feel slow
  // and very tall pages don't take over half a minute to pan.
  var SPEED_PX_PER_S = 120;
  var MIN_PAN_S = 5;
  var MAX_PAN_S = 20;
  function panDuration(travelPx) {
    return Math.min(Math.max(travelPx / SPEED_PX_PER_S, MIN_PAN_S), MAX_PAN_S);
  }

  document.querySelectorAll('.work-card').forEach(function (card) {
    var frame = card.querySelector('.work-frame');
    var img = frame.querySelector('img');
    var resetHandler = null;

    // Recomputed per interaction so resizes/breakpoint reflows never go stale.
    function travel() { return img.offsetHeight - frame.offsetHeight; }

    function setup() {
      if (reduceMotion) return;

      if (hasHover) {
        card.addEventListener('mouseenter', function () {
          var t = travel();
          if (t <= 0) return;
          if (resetHandler) {
            img.removeEventListener('transitionend', resetHandler);
            resetHandler = null;
          }
          img.style.transition = 'transform ' + panDuration(t) + 's linear';
          img.style.transform = 'translateY(-' + t + 'px)';
        });
        card.addEventListener('mouseleave', function () {
          img.style.transition = 'transform 0.6s ease';
          img.style.transform = 'translateY(0)';
          resetHandler = function () {
            img.style.transition = '';
            img.removeEventListener('transitionend', resetHandler);
            resetHandler = null;
          };
          img.addEventListener('transitionend', resetHandler);
        });
      } else {
        // Touch devices: gentle teaser pan when the card scrolls into view.
        var panned = false;
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !panned) {
              panned = true;
              var t = Math.min(travel(), 400);
              if (t <= 0) { obs.unobserve(card); return; }
              img.style.transition = 'transform 3s ease-in-out';
              img.style.transform = 'translateY(-' + t + 'px)';
              setTimeout(function () { img.style.transform = 'translateY(0)'; }, 3200);
              obs.unobserve(card);
            }
          });
        }, { threshold: 0.6 }).observe(card);
      }
    }

    if (img.complete) setup();
    else img.addEventListener('load', setup);
  });

  // --- Lightbox ---
  if (window.GLightbox) {
    GLightbox({ selector: '.work-card' });
  }

  // --- Footer year ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- AJAX contact form: no reload, inline status. ---
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated'); // Bootstrap validation styles
        return;
      }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      status.textContent = 'Sending…';
      status.className = 'form-status mt-3 mb-0';

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          if (data.success) {
            status.textContent = 'Thanks! I’ll reply within 24 hours.';
            status.classList.add('ok');
            form.reset();
            form.classList.remove('was-validated');
          } else {
            status.textContent = 'Something went wrong. Please email me directly.';
            status.classList.add('err');
          }
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please email me directly at jecortina13@gmail.com.';
          status.classList.add('err');
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
