# Landing-Page Portfolio Implementation Plan (Static + Bootstrap 5 + GitHub Pages)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single static landing page portfolio with a hover-scroll work gallery, lightbox, and inline AJAX contact form, hosted free on GitHub Pages, per `docs/superpowers/specs/2026-07-04-landing-page-portfolio-design.md`.

**Architecture:** One `index.html` built on Bootstrap 5 (self-hosted, custom-themed), one custom stylesheet, one JS file. Contact email is sent by Web3Forms' API via `fetch()` — no backend of ours exists. Deploy = `git push` to GitHub with Pages enabled.

**Tech Stack:** HTML5, Bootstrap 5.3+, vanilla JS, GLightbox (MIT, self-hosted), Web3Forms free tier, GitHub Pages.

**Placeholders to confirm with user during execution:** brand name on page (default "Edison"), city for SEO (default "Sydney"), Cal.com booking URL, Web3Forms access key (user signs up free with their email — takes 1 minute), real work screenshots.

---

## File Structure

```
/index.html                          → the entire landing page
/assets/css/custom.css               → Bootstrap overrides + all custom styles
/assets/js/main.js                   → gallery pan, lightbox init, form fetch
/assets/vendor/bootstrap/bootstrap.min.css
/assets/vendor/bootstrap/bootstrap.bundle.min.js
/assets/vendor/glightbox/glightbox.min.css
/assets/vendor/glightbox/glightbox.min.js
/assets/img/work/                    → tall full-page screenshots (webp)
/assets/img/                         → og.jpg, portrait.webp, favicon.svg
/.gitignore
/.nojekyll                           → tells GitHub Pages to skip Jekyll processing
```

No secrets exist anywhere in this project — the Web3Forms access key is public by design.

---

### Task 1: Scaffold + vendor assets

**Files:**
- Create: `.gitignore`, `.nojekyll`, vendor files, folder structure

- [ ] **Step 1: Create `.gitignore`**

```gitignore
node_modules/
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Create folders and `.nojekyll`**

Run: `New-Item -ItemType Directory -Force assets/css, assets/js, assets/vendor/bootstrap, assets/vendor/glightbox, assets/img/work; New-Item -ItemType File .nojekyll`

- [ ] **Step 3: Download Bootstrap 5.3+ dist files**

From https://github.com/twbs/bootstrap/releases/latest download the compiled dist zip; copy `css/bootstrap.min.css` and `js/bootstrap.bundle.min.js` into `assets/vendor/bootstrap/`.

- [ ] **Step 4: Download GLightbox**

From https://github.com/biati-digital/glightbox (latest release) copy `glightbox.min.css` and `glightbox.min.js` into `assets/vendor/glightbox/`.

- [ ] **Step 5: Verify files exist**

Run: `Get-ChildItem -Recurse assets/vendor | Select-Object Name`
Expected: the four vendor files listed above.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold static structure, Bootstrap 5, GLightbox"
```

---

### Task 2: index.html — full page skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write `index.html`**

Bootstrap grid/utilities for layout; every section present; gallery cards are plain HTML blocks (adding work = copy a card). Complete file:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edison — Landing Pages That Turn Clicks Into Customers</title>
    <meta name="description" content="I design and build fast, conversion-focused landing pages for businesses in Sydney and across Australia.">
    <meta property="og:title" content="Edison — Landing Page Designer">
    <meta property="og:description" content="Fast, conversion-focused landing pages.">
    <meta property="og:image" content="https://USERNAME.github.io/portfolio/assets/img/og.jpg">
    <meta property="og:type" content="website">
    <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="assets/vendor/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="assets/vendor/glightbox/glightbox.min.css">
    <link rel="stylesheet" href="assets/css/custom.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Edison",
      "jobTitle": "Landing Page Designer & Developer",
      "email": "mailto:jecortina13@gmail.com",
      "url": "https://USERNAME.github.io/portfolio/"
    }
    </script>
</head>
<body>

    <!-- HERO -->
    <header id="hero" class="d-flex align-items-center min-vh-100">
        <div class="container text-center">
            <h1 class="display-1 fw-bold">Landing pages that turn<br>clicks into customers.</h1>
            <p class="lead mt-3">Design + build, conversion-first, launched fast.</p>
            <a class="btn btn-primary btn-lg mt-4" href="#contact">Book a free call</a>
        </div>
    </header>

    <!-- PROOF BAR -->
    <section id="proof" class="py-4 border-top border-bottom">
        <div class="container">
            <div class="row text-center gy-3">
                <div class="col-md-4"><strong>&lt;1.5s</strong> load times</div>
                <div class="col-md-4"><strong>95+</strong> Lighthouse scores</div>
                <div class="col-md-4"><strong>7-day</strong> typical turnaround</div>
            </div>
        </div>
    </section>

    <!-- WORK GALLERY -->
    <section id="work" class="py-5">
        <div class="container">
            <h2 class="mb-5">Selected work</h2>
            <div class="row g-4">
                <!-- One card per project. To add work: copy this column block. -->
                <div class="col-md-6 col-lg-4">
                    <a class="work-card d-block"
                       href="assets/img/work/project-one.webp"
                       data-glightbox="title: Project One; description: Lead-gen landing page — Trades">
                        <span class="work-frame d-block overflow-hidden rounded-3">
                            <img src="assets/img/work/project-one.webp"
                                 alt="Project One — full page design" loading="lazy">
                        </span>
                        <span class="d-flex justify-content-between mt-2">
                            <span class="work-title">Project One</span>
                            <span class="work-niche text-secondary">Trades</span>
                        </span>
                    </a>
                </div>
                <!-- more cards... -->
            </div>
        </div>
    </section>

    <!-- PROCESS -->
    <section id="process" class="py-5">
        <div class="container">
            <h2 class="mb-5">How it works</h2>
            <div class="row g-4">
                <div class="col-md-3"><h3 class="h5">1. Brief</h3><p>A short call to understand your offer and customers.</p></div>
                <div class="col-md-3"><h3 class="h5">2. Design</h3><p>A page built around one goal: getting you enquiries.</p></div>
                <div class="col-md-3"><h3 class="h5">3. Build</h3><p>Hand-coded, fast, responsive. No bloated templates.</p></div>
                <div class="col-md-3"><h3 class="h5">4. Launch</h3><p>Live on your domain, typically within 7 days.</p></div>
            </div>
        </div>
    </section>

    <!-- ABOUT -->
    <section id="about" class="py-5">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-md-4">
                    <img src="assets/img/portrait.webp" alt="Edison" class="img-fluid rounded-3" loading="lazy">
                </div>
                <div class="col-md-8">
                    <h2>About</h2>
                    <p><!-- short human bio, first person, 3-4 sentences --></p>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-5">
        <div class="container">
            <h2 class="mb-4">FAQ</h2>
            <div class="accordion" id="faq-acc">
                <!-- Bootstrap accordion items: timeline, revisions, hosting, ownership, cost.
                     Copy this item per question: -->
                <div class="accordion-item">
                    <h3 class="accordion-header">
                        <button class="accordion-button collapsed" type="button"
                                data-bs-toggle="collapse" data-bs-target="#faq-1">
                            How long does a landing page take?
                        </button>
                    </h3>
                    <div id="faq-1" class="accordion-collapse collapse" data-bs-parent="#faq-acc">
                        <div class="accordion-body">Typically 7 days from brief to launch.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="py-5">
        <div class="container" style="max-width: 640px;">
            <h2 class="text-center">Let’s build yours</h2>
            <div class="text-center my-4">
                <a class="btn btn-primary btn-lg" href="https://cal.com/CHANGE-ME" target="_blank" rel="noopener">Book a free call</a>
                <p class="text-secondary mt-3">or send a message:</p>
            </div>
            <form id="contact-form" method="POST" action="https://api.web3forms.com/submit" novalidate>
                <input type="hidden" name="access_key" value="WEB3FORMS-ACCESS-KEY">
                <input type="hidden" name="subject" value="New portfolio enquiry">
                <input type="hidden" name="redirect" value="https://USERNAME.github.io/portfolio/#contact">
                <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
                <div class="mb-3">
                    <label class="form-label" for="cf-name">Name</label>
                    <input class="form-control" type="text" id="cf-name" name="name" required maxlength="100">
                </div>
                <div class="mb-3">
                    <label class="form-label" for="cf-email">Email</label>
                    <input class="form-control" type="email" id="cf-email" name="email" required maxlength="254">
                </div>
                <div class="mb-3">
                    <label class="form-label" for="cf-message">Message</label>
                    <textarea class="form-control" id="cf-message" name="message" required minlength="10" maxlength="5000" rows="5"></textarea>
                </div>
                <button class="btn btn-primary w-100" type="submit">Send message</button>
                <p class="form-status mt-3 mb-0" role="status" aria-live="polite"></p>
            </form>
        </div>
    </section>

    <footer class="py-4 text-center">
        <p class="mb-0">© 2026 Edison · <a href="mailto:jecortina13@gmail.com">jecortina13@gmail.com</a></p>
    </footer>

    <script src="assets/vendor/bootstrap/bootstrap.bundle.min.js" defer></script>
    <script src="assets/vendor/glightbox/glightbox.min.js" defer></script>
    <script src="assets/js/main.js" defer></script>
</body>
</html>
```

Notes:
- All asset paths are **relative** (no leading `/`) so the site works at `https://USERNAME.github.io/portfolio/` (project Pages serve from a subpath).
- `WEB3FORMS-ACCESS-KEY`: user signs up free at https://web3forms.com with their email; the key is public by design, safe to commit.
- With JS disabled the form still works: plain POST to Web3Forms, which honors the `redirect` field back to `#contact`.

- [ ] **Step 2: Serve and render check**

Run: `npx serve .` (or `python -m http.server 8000`), open the local URL.
Expected: all sections render, Bootstrap accordion opens/closes, no console 404s except missing images.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: landing page skeleton with Bootstrap 5"
```

---

### Task 3: JavaScript — gallery pan, lightbox, AJAX form

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Write `assets/js/main.js`**

```js
// Gallery pan, lightbox, AJAX contact form.
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasHover = window.matchMedia('(hover: hover)').matches;

  // --- Hover-scroll pan: constant speed regardless of image height. ---
  var SPEED_PX_PER_S = 350;

  document.querySelectorAll('.work-card').forEach(function (card) {
    var frame = card.querySelector('.work-frame');
    var img = frame.querySelector('img');

    function setup() {
      var travel = img.offsetHeight - frame.offsetHeight;
      if (travel <= 0 || reduceMotion) return;
      img.style.transition = 'transform ' + (travel / SPEED_PX_PER_S) + 's linear';

      if (hasHover) {
        card.addEventListener('mouseenter', function () {
          img.style.transform = 'translateY(-' + travel + 'px)';
        });
        card.addEventListener('mouseleave', function () {
          img.style.transition = 'transform 0.6s ease';
          img.style.transform = 'translateY(0)';
          img.addEventListener('transitionend', function reset() {
            img.style.transition = 'transform ' + (travel / SPEED_PX_PER_S) + 's linear';
            img.removeEventListener('transitionend', reset);
          });
        });
      } else {
        // Touch devices: gentle teaser pan when the card scrolls into view.
        var panned = false;
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !panned) {
              panned = true;
              var t = Math.min(travel, 400);
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
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            status.textContent = 'Thanks — I’ll reply within 24 hours.';
            status.classList.add('ok');
            form.reset();
            form.classList.remove('was-validated');
          } else {
            status.textContent = 'Something went wrong — please email me directly.';
            status.classList.add('err');
          }
        })
        .catch(function () {
          status.textContent = 'Network error — please email me directly at jecortina13@gmail.com.';
          status.classList.add('err');
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
```

Note: GLightbox intercepts card clicks, so the lightbox opens instead of navigating to the image URL; the `href` remains a working no-JS fallback.

- [ ] **Step 2: Manual verification (server running, at least one tall test image in `assets/img/work/`)**

- Desktop: hovering a card pans the image at constant speed; leaving eases it back.
- Click a card: GLightbox opens; page does not navigate.
- Submit empty form: Bootstrap validation messages show inline, nothing sent.
- Submit valid data with a real access key: inline "Thanks" appears, no reload, email arrives.
- DevTools mobile emulation: cards teaser-pan when scrolled into view.
- DevTools reduced-motion emulation: no panning at all.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: hover-scroll gallery, lightbox, AJAX form"
```

---

### Task 4: Full styling (design pass)

**Files:**
- Create: `assets/css/custom.css`
- Modify: `index.html` (classes/markup refinements as the design demands)

- [ ] **Step 1: Load the `taste-skill` (or `soft-skill`) design standards** and design the visual system: dark, premium, editorial-modern per the spec. Theme Bootstrap via CSS custom properties (`--bs-body-bg`, `--bs-primary`, font stacks, etc.) so nothing looks like stock Bootstrap.

Required structural rules that must survive the design pass:

```css
/* Gallery — structure required by main.js */
.work-frame {
  height: 420px;
  overflow: hidden;          /* the pan effect depends on this */
}
.work-frame img {
  width: 100%;
  height: auto;              /* natural (tall) height — never crop with object-fit */
  display: block;
  will-change: transform;
}
.hp { position: absolute; left: -9999px; }   /* honeypot off-screen */
.form-status.ok { color: var(--ok, #4ade80); }
.form-status.err { color: var(--err, #f87171); }
@media (prefers-reduced-motion: reduce) {
  .work-frame img { transition: none !important; transform: none !important; }
}
```

- [ ] **Step 2: Style every section** (hero, proof bar, gallery, process, about, FAQ accordion, contact, footer) with real copy — no lorem ipsum. Self-host any custom font (woff2, `font-display: swap`).

- [ ] **Step 3: Verify responsive + reduced motion**

- 375px, 768px, 1280px widths: no horizontal scroll, gallery reflows (1 / 2 / 3 columns), form usable.
- Reduced-motion emulation: images static.

- [ ] **Step 4: Commit**

```bash
git add assets/css/custom.css index.html
git commit -m "feat: full visual design pass"
```

---

### Task 5: SEO, OG image, favicons, performance

**Files:**
- Create: `assets/img/og.jpg` (1200×630), `assets/img/favicon.svg`
- Modify: `index.html` (head)

- [ ] **Step 1: Produce OG image and favicon**, drop into `assets/img/`; confirm `<head>` references resolve.
- [ ] **Step 2: Convert all work screenshots to WebP ≤ 250KB each**; confirm `loading="lazy"` on all gallery images.
- [ ] **Step 3: Run Lighthouse** (Chrome DevTools) against the local server.
Expected: Performance/Accessibility/Best-Practices/SEO all ≥ 95. If Bootstrap's unused CSS drags Performance down, consider swapping `bootstrap.min.css` for a trimmed build — only if needed.
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: SEO meta, OG image, favicons, perf pass"
```

---

### Task 6: Deploy to GitHub Pages

- [ ] **Step 1: Create the GitHub repo and push**

```bash
gh repo create portfolio --public --source . --push
```

(Private repos can use Pages only on paid plans — public is the free path. The repo contains no secrets.)

- [ ] **Step 2: Enable Pages**

```bash
gh api repos/{owner}/portfolio/pages -X POST -f "source[branch]=master" -f "source[path]=/"
```

Or via github.com → repo → Settings → Pages → Deploy from branch → `master` / root.

- [ ] **Step 3: Update absolute URLs**

Replace `USERNAME.github.io/portfolio` placeholders in `index.html` (OG image URL, JSON-LD url, form redirect) with the real Pages URL. Commit and push.

- [ ] **Step 4: Verify live**

- Open the live URL: all sections render, gallery pans, lightbox opens.
- Submit the contact form once for real: email arrives at jecortina13@gmail.com, inline success shows.
- Run Lighthouse against the live URL. Expected ≥ 95 across categories.

- [ ] **Step 5: (Optional, when ready) custom domain**

Add `CNAME` file with the domain, configure DNS (CNAME → `USERNAME.github.io`), enable "Enforce HTTPS" in Pages settings, and update the absolute URLs again.

- [ ] **Step 6: Tag release**

```bash
git tag v1.0
git push --tags
```

---

## Self-Review Notes

- Spec coverage: hero/proof/gallery/process/about/FAQ/contact sections → Task 2; hover-scroll + lightbox + mobile pan + reduced motion → Task 3 + 4; AJAX no-reload form + no-JS fallback + honeypot → Tasks 2–3; Bootstrap 5+ (user-requested) → Tasks 1, 2, 4; free GitHub Pages hosting (user-confirmed) → Task 6; SEO/OG/schema → Tasks 2 + 5; performance criteria → Tasks 5 + 6. "Packages/pricing" section intentionally deferred per spec ("decide later").
- No PHP anywhere — prior plan's PHP tasks fully removed (user switched to static for free hosting).
- Type/name consistency: `.work-card`/`.work-frame`/`.form-status` classes match across Tasks 2, 3, 4; form field names (`name`, `email`, `message`, `botcheck`, `access_key`) match Web3Forms' API.
- No placeholders except user-owned values (access key, booking URL, username, screenshots), each flagged in the header.
