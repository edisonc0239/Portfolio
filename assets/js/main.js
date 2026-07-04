// Gallery pan, lightbox, AJAX contact form.
(function () {
  'use strict';

  // Mark JS active so reveal elements only start hidden when we can un-hide them.
  document.documentElement.classList.add('js');

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
  var lightbox = window.GLightbox ? GLightbox({ selector: '.work-card' }) : null;

  // --- Load more: show 3 projects, reveal 3 more per click ---
  var GALLERY_STEP = 3;
  var items = [].slice.call(document.querySelectorAll('#work-grid .work-item'));
  var moreBtn = document.getElementById('load-more');
  if (moreBtn && items.length) {
    var shown = GALLERY_STEP;
    var render = function () {
      items.forEach(function (it, i) { it.hidden = i >= shown; });
      moreBtn.hidden = shown >= items.length;
    };
    render();
    moreBtn.addEventListener('click', function () {
      shown = Math.min(shown + GALLERY_STEP, items.length);
      render();
      // Newly shown cards animate in immediately (user is looking at them).
      items.forEach(function (it) { if (!it.hidden) it.classList.add('is-visible'); });
      if (lightbox && lightbox.reload) lightbox.reload();
    });
  } else if (moreBtn) {
    moreBtn.hidden = true;
  }

  // --- Scroll reveal: fade-up as elements enter the viewport ---
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  var show = function (el) { el.classList.add('is-visible'); };
  var inView = function (el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
  };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(show);
  } else {
    // Reveal whatever is already on screen at load, observe the rest.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { if (inView(el)) { show(el); } else { io.observe(el); } });
    // Safety net: if anything is still hidden while sitting in the viewport
    // (e.g. an environment where IO never fires), reveal it on scroll.
    var sweep = function () { revealEls.forEach(function (el) { if (!el.classList.contains('is-visible') && inView(el)) show(el); }); };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('load', sweep);
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
