# Landing-Page Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page PHP portfolio landing page with a hover-scroll work gallery, lightbox, and inline AJAX contact form, per `docs/superpowers/specs/2026-07-04-landing-page-portfolio-design.md`.

**Architecture:** One visitor-facing page (`index.php`) rendering sections from a PHP data array; one invisible JSON endpoint (`contact.php`) for the form; validation logic isolated in `lib/validate.php` so it is unit-testable. All assets self-hosted. No framework, no build step.

**Tech Stack:** PHP 8+, vanilla JS, plain CSS, PHPMailer (Composer), GLightbox (self-hosted, MIT).

**Placeholders to confirm with user before/while executing:** personal brand name (default: "Edison"), city for SEO (default: "Sydney"), Cal.com booking URL, SMTP credentials, real work screenshots.

---

## File Structure

```
/index.php                    → the landing page (sections + $projects array at top)
/contact.php                  → JSON form endpoint (POST only; GET redirects to /)
/lib/validate.php             → pure function validating form input (testable)
/config.sample.php            → SMTP config template (copy to config.php, gitignored)
/assets/css/style.css         → all styles
/assets/js/main.js            → gallery pan, lightbox init, form fetch
/assets/vendor/glightbox/     → glightbox.min.css + glightbox.min.js (self-hosted)
/assets/img/work/             → tall full-page screenshots (webp)
/assets/img/                  → og.jpg, portrait, favicons
/tests/validate_test.php      → plain-PHP assertions for lib/validate.php
/.gitignore
```

---

### Task 1: Scaffold + config

**Files:**
- Create: `.gitignore`, `config.sample.php`, `assets/img/work/.gitkeep`

- [ ] **Step 1: Create `.gitignore`**

```gitignore
config.php
vendor/
node_modules/
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Create `config.sample.php`**

```php
<?php
// Copy to config.php and fill in. config.php is gitignored.
return [
    'smtp_host'   => 'smtp.example.com',
    'smtp_port'   => 587,
    'smtp_user'   => 'you@example.com',
    'smtp_pass'   => 'CHANGE-ME',
    'mail_to'     => 'edison@clickclickmedia.com.au',
    'mail_from'   => 'noreply@yourdomain.com',
    'site_url'    => 'https://yourdomain.com',
];
```

- [ ] **Step 3: Create empty dirs**

Run: `New-Item -ItemType Directory -Force assets/img/work, assets/css, assets/js, assets/vendor/glightbox, lib, tests; New-Item -ItemType File assets/img/work/.gitkeep`

- [ ] **Step 4: Install PHPMailer**

Run: `composer require phpmailer/phpmailer`
Expected: `vendor/phpmailer` exists. If Composer is unavailable on this machine, download the PHPMailer release zip and extract `src/` to `vendor/phpmailer/phpmailer/src/` with a manual autoload require in contact.php (note it in a comment).

- [ ] **Step 5: Download GLightbox**

Fetch `glightbox.min.js` and `glightbox.min.css` from the latest GitHub release (https://github.com/biati-digital/glightbox) into `assets/vendor/glightbox/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold project structure, PHPMailer, GLightbox"
```

---

### Task 2: Form validation library (TDD)

**Files:**
- Create: `lib/validate.php`
- Test: `tests/validate_test.php`

- [ ] **Step 1: Write the failing test**

```php
<?php // tests/validate_test.php
require __DIR__ . '/../lib/validate.php';

function check(bool $cond, string $msg): void {
    if (!$cond) { fwrite(STDERR, "FAIL: $msg\n"); exit(1); }
    echo "ok: $msg\n";
}

// Valid input passes
$r = validate_contact(['name' => 'Jane', 'email' => 'jane@x.com', 'message' => 'Need a landing page for my clinic.', 'website' => '']);
check($r['ok'] === true, 'valid input passes');

// Honeypot filled => silently rejected
$r = validate_contact(['name' => 'Bot', 'email' => 'b@x.com', 'message' => 'hi there friend', 'website' => 'http://spam']);
check($r['ok'] === false && $r['silent'] === true, 'honeypot rejected silently');

// Bad email
$r = validate_contact(['name' => 'Jane', 'email' => 'not-an-email', 'message' => 'hello hello hello', 'website' => '']);
check($r['ok'] === false && $r['field'] === 'email', 'bad email rejected');

// Empty name
$r = validate_contact(['name' => '  ', 'email' => 'j@x.com', 'message' => 'hello hello hello', 'website' => '']);
check($r['ok'] === false && $r['field'] === 'name', 'empty name rejected');

// Message too short
$r = validate_contact(['name' => 'Jane', 'email' => 'j@x.com', 'message' => 'hi', 'website' => '']);
check($r['ok'] === false && $r['field'] === 'message', 'short message rejected');

// Oversized fields rejected
$r = validate_contact(['name' => str_repeat('a', 300), 'email' => 'j@x.com', 'message' => 'hello hello hello', 'website' => '']);
check($r['ok'] === false && $r['field'] === 'name', 'oversized name rejected');

echo "ALL PASS\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php tests/validate_test.php`
Expected: fatal error — `validate.php` not found / `validate_contact` undefined.

- [ ] **Step 3: Write the implementation**

```php
<?php // lib/validate.php
declare(strict_types=1);

/**
 * Validate contact form input.
 * Returns ['ok' => true, 'data' => [...]] or
 * ['ok' => false, 'field' => ..., 'error' => ..., 'silent' => bool].
 * 'website' is a honeypot field — humans never fill it.
 */
function validate_contact(array $in): array
{
    $name    = trim((string)($in['name'] ?? ''));
    $email   = trim((string)($in['email'] ?? ''));
    $message = trim((string)($in['message'] ?? ''));
    $honey   = trim((string)($in['website'] ?? ''));

    if ($honey !== '') {
        return ['ok' => false, 'silent' => true, 'field' => 'website', 'error' => 'spam'];
    }
    if ($name === '' || mb_strlen($name) > 100) {
        return ['ok' => false, 'silent' => false, 'field' => 'name', 'error' => 'Please enter your name.'];
    }
    if (mb_strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'silent' => false, 'field' => 'email', 'error' => 'Please enter a valid email.'];
    }
    if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
        return ['ok' => false, 'silent' => false, 'field' => 'message', 'error' => 'Message must be 10–5000 characters.'];
    }
    return ['ok' => true, 'data' => ['name' => $name, 'email' => $email, 'message' => $message]];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `php tests/validate_test.php`
Expected: 6 `ok:` lines then `ALL PASS`, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add lib/validate.php tests/validate_test.php
git commit -m "feat: contact form validation with honeypot (TDD)"
```

---

### Task 3: contact.php endpoint

**Files:**
- Create: `contact.php`

- [ ] **Step 1: Write `contact.php`**

```php
<?php // contact.php — invisible form endpoint. Not a page.
declare(strict_types=1);
session_start();

// Direct browser visits (GET) bounce to the landing page.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /');
    exit;
}

require __DIR__ . '/lib/validate.php';
$config = require __DIR__ . '/config.php';

$isAjax = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

function respond(bool $ok, string $msg, bool $isAjax): void
{
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok, 'message' => $msg]);
    } else {
        // Non-JS fallback: back to the form anchor with a status flag.
        header('Location: /index.php?sent=' . ($ok ? '1' : '0') . '#contact');
    }
    exit;
}

// Rate limit: max 3 submissions per session per 10 minutes.
$now = time();
$_SESSION['contact_times'] = array_values(array_filter(
    $_SESSION['contact_times'] ?? [],
    fn($t) => $now - $t < 600
));
if (count($_SESSION['contact_times']) >= 3) {
    respond(false, 'Too many messages — please try again later or email me directly.', $isAjax);
}

$result = validate_contact($_POST);
if (!$result['ok']) {
    if (!empty($result['silent'])) {
        respond(true, 'Thanks — I will reply within 24 hours.', $isAjax); // fool bots
    }
    respond(false, $result['error'], $isAjax);
}

$_SESSION['contact_times'][] = $now;
$d = $result['data'];

require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $config['smtp_port'];
    $mail->setFrom($config['mail_from'], 'Portfolio Contact');
    $mail->addAddress($config['mail_to']);
    $mail->addReplyTo($d['email'], $d['name']);
    $mail->Subject = 'New portfolio enquiry from ' . $d['name'];
    $mail->Body    = "Name: {$d['name']}\nEmail: {$d['email']}\n\n{$d['message']}";
    $mail->send();
    respond(true, 'Thanks — I will reply within 24 hours.', $isAjax);
} catch (Exception $e) {
    error_log('Contact mail failed: ' . $mail->ErrorInfo);
    respond(false, 'Something went wrong — please email me directly.', $isAjax);
}
```

Note: `use` statements appear mid-file after `require` — PHP allows `use` only at top of file. **Place the two `use` lines directly under `declare(strict_types=1);` instead.** (Written here inline for reading order; the actual file must have them at top.)

- [ ] **Step 2: Lint**

Run: `php -l contact.php`
Expected: `No syntax errors detected`

- [ ] **Step 3: Smoke-test endpoint without SMTP**

Copy `config.sample.php` to `config.php`. Run `php -S localhost:8000` in background, then:

Run: `curl -s -X POST http://localhost:8000/contact.php -H "X-Requested-With: fetch" --data "name=&email=x&message=hi&website="`
Expected: `{"ok":false,"message":"Please enter your name."}`

Run: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:8000/contact.php`
Expected: `302` redirecting to `/` (GET bounce works).

(Real send is verified at deploy time with live SMTP creds.)

- [ ] **Step 4: Commit**

```bash
git add contact.php
git commit -m "feat: AJAX contact endpoint with rate limit and PHPMailer"
```

---

### Task 4: index.php skeleton + projects data

**Files:**
- Create: `index.php`

- [ ] **Step 1: Write `index.php`**

```php
<?php
declare(strict_types=1);
// ---- Work gallery data. Add a project = add an image + one entry here. ----
$projects = [
    [
        'title' => 'Project One',
        'niche' => 'Trades / Local services',
        'note'  => 'Lead-gen landing page — enquiry-focused',
        'img'   => 'assets/img/work/project-one.webp',
        'url'   => null, // live URL or null
    ],
    // more entries...
];
$sent = $_GET['sent'] ?? null; // non-JS form fallback flag
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Edison — Landing Pages That Turn Clicks Into Customers</title>
    <meta name="description" content="I design and build fast, conversion-focused landing pages for businesses in Sydney and across Australia.">
    <meta property="og:title" content="Edison — Landing Page Designer">
    <meta property="og:description" content="Fast, conversion-focused landing pages.">
    <meta property="og:image" content="/assets/img/og.jpg">
    <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/vendor/glightbox/glightbox.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Edison",
      "jobTitle": "Landing Page Designer & Developer",
      "email": "mailto:edison@clickclickmedia.com.au",
      "url": "https://yourdomain.com"
    }
    </script>
</head>
<body>
    <section id="hero">
        <h1>Landing pages that turn clicks into customers.</h1>
        <p>Design + build, conversion-first, launched fast.</p>
        <a class="cta" href="#contact">Book a free call</a>
    </section>

    <section id="proof" aria-label="Proof">
        <ul class="proof-bar">
            <li><strong>&lt;1.5s</strong> load times</li>
            <li><strong>95+</strong> Lighthouse scores</li>
            <li><strong>7-day</strong> typical turnaround</li>
        </ul>
    </section>

    <section id="work">
        <h2>Selected work</h2>
        <div class="gallery">
            <?php foreach ($projects as $p): ?>
            <a class="work-card"
               href="<?= htmlspecialchars($p['img']) ?>"
               data-glightbox="title: <?= htmlspecialchars($p['title']) ?>; description: <?= htmlspecialchars($p['note']) ?><?= $p['url'] ? ' — <a href=&quot;' . htmlspecialchars($p['url']) . '&quot; target=&quot;_blank&quot;>View live</a>' : '' ?>">
                <span class="work-frame">
                    <img src="<?= htmlspecialchars($p['img']) ?>" alt="<?= htmlspecialchars($p['title']) ?> — full page design" loading="lazy">
                </span>
                <span class="work-meta">
                    <span class="work-title"><?= htmlspecialchars($p['title']) ?></span>
                    <span class="work-niche"><?= htmlspecialchars($p['niche']) ?></span>
                </span>
            </a>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="process">
        <h2>How it works</h2>
        <ol class="steps">
            <li><h3>Brief</h3><p>A short call to understand your offer and customers.</p></li>
            <li><h3>Design</h3><p>A page built around one goal: getting you enquiries.</p></li>
            <li><h3>Build</h3><p>Hand-coded, fast, responsive. No bloated templates.</p></li>
            <li><h3>Launch</h3><p>Live on your domain, typically within 7 days.</p></li>
        </ol>
    </section>

    <section id="about">
        <h2>About</h2>
        <p><!-- short human bio + photo --></p>
    </section>

    <section id="faq">
        <h2>FAQ</h2>
        <!-- details/summary pairs: timeline, revisions, hosting, ownership, cost -->
    </section>

    <section id="contact">
        <h2>Let’s build yours</h2>
        <a class="cta" href="https://cal.com/CHANGE-ME" target="_blank" rel="noopener">Book a free call</a>
        <p class="or">or send a message:</p>
        <?php if ($sent === '1'): ?>
            <p class="form-status ok">Thanks — I’ll reply within 24 hours.</p>
        <?php elseif ($sent === '0'): ?>
            <p class="form-status err">Something went wrong — please email me directly.</p>
        <?php endif; ?>
        <form id="contact-form" method="post" action="/contact.php" novalidate>
            <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label>Name <input type="text" name="name" required maxlength="100"></label>
            <label>Email <input type="email" name="email" required maxlength="254"></label>
            <label>Message <textarea name="message" required minlength="10" maxlength="5000" rows="5"></textarea></label>
            <button type="submit">Send message</button>
            <p class="form-status" role="status" aria-live="polite"></p>
        </form>
    </section>

    <footer>
        <p>© <?= date('Y') ?> Edison · <a href="mailto:edison@clickclickmedia.com.au">edison@clickclickmedia.com.au</a></p>
    </footer>

    <script src="/assets/vendor/glightbox/glightbox.min.js" defer></script>
    <script src="/assets/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Lint and render check**

Run: `php -l index.php` → `No syntax errors detected`
Run (server still up): `curl -s http://localhost:8000/ | Select-String "Selected work"`
Expected: the heading appears; no PHP warnings in output.

- [ ] **Step 3: Commit**

```bash
git add index.php
git commit -m "feat: landing page skeleton with gallery data array"
```

---

### Task 5: Gallery hover-scroll + lightbox + form JS

**Files:**
- Create: `assets/js/main.js`
- Modify: `assets/css/style.css` (gallery rules — full file in Task 6)

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
        // Touch devices: gentle auto-pan when the card scrolls into view.
        var panned = false;
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !panned) {
              panned = true;
              var t = Math.min(travel, 400); // short teaser pan
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
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      status.textContent = 'Sending…';
      status.className = 'form-status';

      fetch(form.action, {
        method: 'POST',
        headers: { 'X-Requested-With': 'fetch' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          status.textContent = data.message;
          status.classList.add(data.ok ? 'ok' : 'err');
          if (data.ok) form.reset();
        })
        .catch(function () {
          status.textContent = 'Network error — please email me directly at edison@clickclickmedia.com.au.';
          status.classList.add('err');
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
```

- [ ] **Step 2: Manual verification (with server running and at least one tall test image in `assets/img/work/`)**

Open `http://localhost:8000`:
- Desktop: hovering a card pans the image bottom-ward at constant speed; leaving eases it back.
- Click a card: GLightbox opens the full screenshot; page does not navigate.
- Submit empty form: inline "Please enter your name." appears, no reload.
- Submit valid data (dummy SMTP will fail): inline error message appears, no reload.
- DevTools mobile emulation: cards teaser-pan on scroll into view.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: hover-scroll gallery, lightbox, AJAX form"
```

---

### Task 6: Full styling (design pass)

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Invoke a design skill for the visual system**

This step is executed WITH the `taste-skill` (or `soft-skill`) design standards loaded — dark, premium, editorial-modern per the spec. The CSS below is the required structural baseline the design layer builds on; the design skill dictates tokens (type scale, palette, spacing) and section art direction.

Required structural rules (must survive the design pass):

```css
/* Gallery — structure required by main.js */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}
.work-card { display: block; text-decoration: none; }
.work-frame {
  display: block;
  height: 420px;
  overflow: hidden;        /* the pan effect depends on this */
  border-radius: 12px;
}
.work-frame img {
  width: 100%;
  height: auto;            /* natural (tall) height — never crop with object-fit */
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

- [ ] **Step 2: Complete all section styling** (hero, proof bar, process, about, FAQ, contact, footer) per the design skill's system. Real copy, no lorem ipsum.

- [ ] **Step 3: Verify responsive + reduced motion**

- 375px, 768px, 1280px widths: no horizontal scroll, gallery reflows, form usable.
- Toggle prefers-reduced-motion in DevTools: images static.

- [ ] **Step 4: Commit**

```bash
git add assets/css/style.css index.php
git commit -m "feat: full visual design pass"
```

---

### Task 7: SEO, OG image, favicons, performance

**Files:**
- Create: `assets/img/og.jpg`, `assets/img/favicon.svg`
- Modify: `index.php` (head)

- [ ] **Step 1: Produce OG image (1200×630) and favicon**, drop into `assets/img/`.
- [ ] **Step 2: Convert all work screenshots to WebP ≤ 250KB each**, `loading="lazy"` confirmed on all gallery imgs.
- [ ] **Step 3: Run Lighthouse** (Chrome DevTools, or `npx unlighthouse` if preferred) against `http://localhost:8000`.
Expected: Performance/Accessibility/Best-Practices/SEO all ≥ 95. Fix regressions before proceeding.
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: SEO meta, OG image, favicons, perf pass"
```

---

### Task 8: Deploy

- [ ] **Step 1:** Upload all files except `tests/`, `docs/`, `.git/` to the PHP host (or set docroot accordingly). Create `config.php` on the server from `config.sample.php` with real SMTP creds.
- [ ] **Step 2:** Submit the live contact form once; confirm the email arrives and the inline success message shows.
- [ ] **Step 3:** Verify `https://domain/contact.php` in a browser redirects to `/`.
- [ ] **Step 4:** Run Lighthouse against the live URL. Expected ≥ 95 across categories.
- [ ] **Step 5:** Tag release:

```bash
git tag v1.0
```

---

## Self-Review Notes

- Spec coverage: hero/proof/gallery/process/about/FAQ/contact sections → Task 4; hover-scroll + lightbox + mobile pan + reduced motion → Task 5 + 6; AJAX no-reload form + non-JS fallback → Tasks 3–5; PHP-only stack → all; SEO/OG/schema → Tasks 4 + 7; performance criteria → Task 7 + 8. "What's included/packages" section from the spec is intentionally deferred (spec marks pricing as "decide later") — add as a section between #process and #about when the user decides.
- `use` statement placement flagged inline in Task 3.
- Types consistent: `validate_contact` return shape used identically in Task 2 and Task 3; `.work-frame`/`.work-card` class names match between Tasks 4, 5, 6.
