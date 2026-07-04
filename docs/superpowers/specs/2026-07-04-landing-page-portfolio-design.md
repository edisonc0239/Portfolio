# Landing-Page Portfolio — Design Spec

**Date:** 2026-07-04
**Status:** Draft — awaiting user review
**Goal:** A portfolio that attracts paying clients for landing-page design/build work.

## Concept

**One single landing page** (user-confirmed — no demo sub-pages, no multi-page site). The page itself is the #1 proof of skill: if it's stunning and fast, it sells before a word is read. Proof of work comes from a **gallery of images/screenshots of your existing projects**, browsed via hover-scroll previews and a lightbox — visitors never leave the page.

**Positioning line (draft):** "I build landing pages that turn clicks into customers." Every element of the page supports that one claim.

## Decisions taken by default (override any of these)

| Decision | Default | Why |
|---|---|---|
| Tech stack | PHP (single `index.php`) + CSS + vanilla JS | **User-confirmed: PHP, not HTML.** Instant page speed, native form handling |
| Hosting | Any PHP host (cPanel/shared hosting or small VPS), custom domain, HTTPS | PHP rules out Vercel/Netlify static free tiers; standard LAMP hosting is cheap and the user likely has agency hosting available |
| Conversion goal | "Book a free call" (Cal.com embed) + short contact form fallback | Lowest-friction path to a sales conversation |
| Branding | Personal brand (your name) | Freelance credibility; can rebrand later |

## Site structure

```
/index.php          → The entire portfolio landing page
/contact.php        → Invisible form endpoint (PHPMailer) — NOT a page; receives the
                      form POST and returns JSON. Direct browser visits redirect to /
/assets/css/        → Stylesheet
/assets/js/         → Gallery hover-scroll, lightbox, interactions
/assets/img/work/   → Full-page screenshots of your projects (tall images)
/assets/img/        → Photo, OG image, favicons
```

Two PHP files total. Project screenshots are data, not pages — adding a new piece of work means dropping in an image and adding one gallery entry.

## The page — section-by-section

1. **Hero** — massive headline stating the outcome ("Landing pages that turn clicks into customers"), subline with who it's for, primary CTA "Book a free call", and a visual teaser of the work gallery.
2. **Proof bar** — page-speed scores, projects shipped, turnaround time — conversion-focused stats.
3. **Work gallery** — the core section. Card per project with a full-page screenshot in a fixed-height frame and a niche/type label.
   - **Hover (desktop):** the screenshot smoothly pans top-to-bottom through the entire page (~4–6s, CSS `translateY` on a tall image inside `overflow: hidden`; duration proportional to image height so all cards pan at the same speed). Prospects can "read" the whole design without leaving the page.
   - **Click:** opens a **lightbox** with the full screenshot, scrollable/zoomable (GLightbox preferred — MIT-licensed and lighter than lightGallery, which needs a paid commercial license). If a project has a live URL, the lightbox caption links out to it.
   - **Mobile (no hover):** cards auto-pan gently when scrolled into view (IntersectionObserver); tap opens the lightbox. Respect `prefers-reduced-motion` — show a static top-of-page crop instead.
4. **Process** — 3–4 steps ("Brief → Design → Build → Launch in 7 days"). Reduces perceived risk.
5. **What's included / packages** — optional pricing anchors (e.g., "Landing page — from $X") or "packages" without prices. Prices filter tyre-kickers; decide later.
6. **About** — short, human, one photo. Clients buy from people.
7. **FAQ** — objections: timeline, revisions, hosting, ownership, cost.
8. **Final CTA + contact form** — embedded at the bottom of the landing page (user-confirmed: no separate contact page, ever). "Book a free call" button plus a short form (name, email, message). The form submits via `fetch()` to the invisible `contact.php` endpoint — **no page reload, no redirect**: on success the form swaps inline to a "Thanks — I'll reply within 24h" message; on error it shows an inline retry message with a `mailto:` fallback. With JS disabled, the form falls back to a normal POST that redirects back to `index.php#contact?sent=1`.

## Work image requirements (each gallery entry)

- Full-page screenshot of the real project, captured at desktop width, exported tall (AVIF/WebP, lazy-loaded, ~1000px wide).
- Consistent capture settings across all entries so the gallery looks curated, not scrapbooked.
- Each entry has: screenshot, project/niche label, one-line result or role note, optional live URL.

## Design direction

- Dark, premium, editorial-modern with restrained motion (scroll-triggered reveals, hover states) — the `taste-skill` / anti-generic standards apply.
- No stock-template look, no lorem ipsum — real copy throughout, because copy is half of what clients are buying.

## Technical

- Plain PHP (no framework), one stylesheet, one JS file. Gallery entries defined as a PHP array at the top of `index.php` — adding work = one array item + one image.
- Fonts self-hosted, images in AVIF/WebP with proper sizing and lazy loading, zero render-blocking third-party scripts (Cal.com embed lazy-loaded).
- Form handling: native PHP endpoint (`contact.php`) using PHPMailer via SMTP, with honeypot + rate-limit spam protection. No third-party form service needed.
- Local development: PHP built-in server (`php -S localhost:8000`) — no XAMPP required unless preferred.
- SEO: title/meta targeting "landing page designer [city/AU]", Person + Service JSON-LD schema, OG image, favicon set.
- Analytics: Plausible or GA4 to see which work gets attention.
- Git repo from day one.

## Client-attraction layer (beyond the site)

The page alone attracts no one; it converts traffic you send to it:
1. **Distribution assets** — each piece of work in the gallery becomes a post ("How I approached this plumber landing page") for LinkedIn/X/design communities, linking back to the portfolio.
2. **Outreach ammo** — link the portfolio (or a specific gallery piece) in cold outreach: "Here's what I build" beats any pitch deck.
3. **SEO** — the page targets local + service keywords; slow burn but free.

## Build phases

- **Phase 1 (ship first):** the complete landing page with whatever work images you have today. Live on a domain. Done beats perfect.
- **Phase 2:** add work images as projects finish; testimonials as real clients arrive; pricing experiments.

## Success criteria

- Page loads < 1.5s, Lighthouse ≥95 all categories.
- At least one clear CTA visible at every scroll position.
- You can send the URL to a prospect and it sells without explanation.

## Out of scope (YAGNI)

- Demo sub-pages / multi-page site (explicitly cut — user wants ONE landing page), blog/CMS, user accounts, custom backend, multi-language, dark/light toggle.
