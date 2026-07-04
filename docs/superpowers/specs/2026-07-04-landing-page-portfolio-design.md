# Landing-Page Portfolio — Design Spec

**Date:** 2026-07-04
**Status:** Draft — awaiting user review
**Goal:** A portfolio that attracts paying clients for web development work — landing pages, WooCommerce stores, and full business websites (user-corrected 2026-07-04: he is a web developer, not landing-pages-only).

## Concept

**One single landing page** (user-confirmed — no demo sub-pages, no multi-page site). The page itself is the #1 proof of skill: if it's stunning and fast, it sells before a word is read. Proof of work comes from a **gallery of images/screenshots of your existing projects**, browsed via hover-scroll previews and a lightbox — visitors never leave the page.

**Positioning line:** "Websites that turn clicks into customers." Subline names the three offerings: landing pages, WooCommerce stores, full business websites. Every element of the page supports that claim.

## Decisions taken by default (override any of these)

| Decision | Default | Why |
|---|---|---|
| Tech stack | Static HTML + **Bootstrap 5+** + vanilla JS | **User-confirmed (supersedes earlier PHP decision):** free GitHub Pages hosting requires static; Bootstrap 5+ explicitly requested |
| Hosting | **GitHub Pages** (free, HTTPS), optional custom domain via CNAME | User-confirmed. $0, fast CDN-backed hosting, deploy = git push |
| Contact email | Web3Forms free tier (Formspree as alternative) via `fetch()` | Static hosting can't send email itself; free tier covers a portfolio's volume |
| Conversion goal | "Book a free call" (Cal.com embed) + short contact form fallback | Lowest-friction path to a sales conversation |
| Branding | Personal brand (your name) | Freelance credibility; can rebrand later |

## Site structure

```
/index.html                  → The entire portfolio landing page
/assets/css/custom.css       → Custom styles + Bootstrap overrides
/assets/js/main.js           → Gallery hover-scroll, lightbox, form fetch
/assets/vendor/bootstrap/    → Bootstrap 5 dist (self-hosted CSS + JS bundle)
/assets/vendor/glightbox/    → GLightbox (self-hosted)
/assets/img/work/            → Full-page screenshots of your projects (tall images)
/assets/img/                 → Photo, OG image, favicons
/CNAME                       → Custom domain (only if/when one is connected)
```

One HTML page total. The contact email is handled by Web3Forms (free): the form `fetch()`es their API with a public access key — no backend of ours exists anywhere. Adding new work means dropping in an image and copying one gallery card block.

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
8. **Final CTA + contact form** — embedded at the bottom of the landing page (user-confirmed: no separate contact page, ever). "Book a free call" button plus a short form (name, email, message). The form submits via `fetch()` to the Web3Forms API — **no page reload, no redirect**: on success the form swaps inline to a "Thanks — I'll reply within 24h" message; on error it shows an inline retry message with a `mailto:` fallback. Honeypot field (Web3Forms `botcheck`) for spam. With JS disabled, the form falls back to a normal POST to Web3Forms with a redirect back to `index.html#contact`.

## Work image requirements (each gallery entry)

- Full-page screenshot of the real project, captured at desktop width, exported tall (AVIF/WebP, lazy-loaded, ~1000px wide).
- Consistent capture settings across all entries so the gallery looks curated, not scrapbooked.
- Each entry has: screenshot, project/niche label, one-line result or role note, optional live URL.

## Design direction

- Dark, premium, editorial-modern with restrained motion (scroll-triggered reveals, hover states) — the `taste-skill` / anti-generic standards apply.
- No stock-template look, no lorem ipsum — real copy throughout, because copy is half of what clients are buying.

## Technical

- Static HTML with **Bootstrap 5+** (self-hosted dist files, not CDN) for grid/components, heavily themed via CSS custom properties so it doesn't look like stock Bootstrap. One custom stylesheet, one JS file.
- Fonts self-hosted, images in AVIF/WebP with proper sizing and lazy loading, zero render-blocking third-party scripts (Cal.com embed lazy-loaded).
- Form handling: Web3Forms free tier via `fetch()` with honeypot (`botcheck`) spam protection. The access key is public by design — safe to commit.
- Local development: any static server (`npx serve` or `python -m http.server`).
- SEO: title/meta targeting "landing page designer [city/AU]", Person + Service JSON-LD schema, OG image, favicon set.
- Analytics: Plausible or GA4 to see which work gets attention.
- Git repo from day one; **deploy = push to GitHub, served by GitHub Pages** (free, HTTPS). No secrets exist in this project at all.

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
