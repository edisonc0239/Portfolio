// Gallery pan, lightbox, AJAX contact form.
(function () {
  'use strict';

  // Mark JS active so reveal elements only start hidden when we can un-hide them.
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Theme toggle (light/dark, persisted) ---
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // --- Preloader: count up, then reveal the page ---
  var pre = document.getElementById('preloader');
  if (pre) {
    var dismiss = function () {
      pre.classList.add('done');
      setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 700);
    };
    if (reduceMotion) {
      setTimeout(dismiss, 250);
    } else {
      var countEl = pre.querySelector('.preloader-count');
      var n = 0;
      var iv = setInterval(function () {
        n = Math.min(100, n + Math.floor(Math.random() * 9) + 5);
        if (countEl) countEl.textContent = n + '%';
        if (n >= 100) { clearInterval(iv); setTimeout(dismiss, 220); }
      }, 70);
    }
  }
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

  // --- Custom cursor: dot follows exactly, ring lags and grows on hover.
  //     Desktop / fine-pointer only; off for touch and reduced-motion. ---
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-cursor');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, sc = 1, targetSc = 1, on = false;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      if (!on) { on = true; dot.classList.add('on'); ring.classList.add('on'); }
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; sc += (targetSc - sc) * 0.2;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) scale(' + sc + ')';
      requestAnimationFrame(loop);
    })();
    var hoverSel = 'a, button, .work-card, input, textarea, label, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(hoverSel)) { ring.classList.add('is-hover'); targetSc = 1.5; }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(hoverSel)) { ring.classList.remove('is-hover'); targetSc = 1; }
    });
    document.addEventListener('mouseleave', function () { dot.classList.remove('on'); ring.classList.remove('on'); });
    document.addEventListener('mouseenter', function () { dot.classList.add('on'); ring.classList.add('on'); });
  }
})();
