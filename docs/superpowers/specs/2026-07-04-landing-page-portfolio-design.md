# Landing-Page Portfolio — Design Spec

**Date:** 2026-07-04
**Status:** Draft — awaiting user review
**Goal:** A portfolio that attracts paying clients for landing-page design/build work.

## Concept

A two-layer portfolio ("Both" model, confirmed by user):

1. **The Hub** — a single, high-converting landing page about *you*. It is itself the #1 proof of skill: if this page is stunning and fast, it sells before a word is read.
2. **Demo Gallery** — 4–6 fictional-but-realistic demo landing pages, one per niche, each a fully working page a prospect can click through. Each demo doubles as a template you can resell/adapt for real clients.

**Positioning line (draft):** "I build landing pages that turn clicks into customers." Every element of the site supports that one claim.

## Decisions taken by default (override any of these)

| Decision | Default | Why |
|---|---|---|
| Niches | Trades/local services, Health (dental/physio), SaaS launch, E-commerce product, Real estate, Restaurant/hospitality | Broad AU-relevant spread; trades + health are the highest-paying local lead-gen niches |
| Tech stack | PHP (.php pages) + CSS + vanilla JS, one folder per page | **User-confirmed: PHP, not HTML.** Same instant page speed as static, plus shared includes and native form handling |
| Hosting | Any PHP host (cPanel/shared hosting or small VPS), custom domain, HTTPS | PHP rules out Vercel/Netlify static free tiers; standard LAMP hosting is cheap and the user likely has agency hosting available |
| Conversion goal | "Book a free call" (Cal.com embed) + short contact form fallback | Lowest-friction path to a sales conversation |
| Branding | Personal brand (your name) | Freelance credibility; can rebrand later |

## Site structure

```
/index.php                     → The Hub (your portfolio landing page)
/demos/trades/index.php        → "Apex Plumbing" — emergency plumber lead-gen page
/demos/dental/index.php        → "Brightside Dental" — booking-focused clinic page
/demos/saas/index.php          → "Launchpad" — SaaS waitlist/launch page
/demos/ecommerce/index.php     → "Single-product" promo page
/demos/realestate/index.php    → Property/agent lead capture page
/demos/restaurant/index.php    → Booking + menu showcase page
/includes/                     → Hub-only shared partials (head meta, demo badge, form handler)
/contact.php                   → POST handler for the Hub contact form (PHPMailer)
```

All pages are `.php`. The Hub uses `/includes/` partials (`require`) for repeated chrome; each demo stays **self-contained in its own folder** (its own CSS/JS/images, no dependency on `/includes/`) so a demo can still be zipped and handed to a client as-is — only the shared "Demo by [you]" badge is injected via a tiny include that's trivially removable.

## The Hub — section-by-section

1. **Hero** — massive headline stating the outcome ("Landing pages that turn clicks into customers"), subline with who it's for, primary CTA "Book a free call", and a visual: an animated collage/carousel of the demo pages.
2. **Proof bar** — page-speed scores, "built in X days", conversion-focused stats. If no client logos yet, use metrics of the demos themselves (Lighthouse 100s).
3. **Demo gallery** — the core section. Card per project with a full-page screenshot in a fixed-height frame, niche label, and CTA.
   - **Hover (desktop):** the screenshot smoothly pans top-to-bottom through the entire page (~4–6s, CSS `translateY` on a tall image inside `overflow: hidden`; duration proportional to image height so all cards pan at the same speed). Prospects can "read" the whole design without leaving the hub.
   - **Click:** opens the **live demo page** when one exists — a real fast page is more convincing than any image. For image-only work (past client work, mockups with no live URL), click opens a lightbox instead (GLightbox preferred — MIT-licensed and lighter than lightGallery, which needs a paid commercial license).
   - **Mobile (no hover):** cards auto-pan gently when scrolled into view (IntersectionObserver); tap goes to live demo/lightbox. Respect `prefers-reduced-motion` — show a static top-of-page crop instead.
4. **Process** — 3–4 steps ("Brief → Design → Build → Launch in 7 days"). Reduces perceived risk.
5. **What's included / packages** — optional pricing anchors (e.g., "Landing page — from $X") or "packages" without prices. Prices filter tyre-kickers; decide later.
6. **About** — short, human, one photo. Clients buy from people.
7. **FAQ** — objections: timeline, revisions, hosting, ownership, cost.
8. **Final CTA** — repeat "Book a free call" + contact form fallback.

## Demo page requirements (each one)

- Fictional brand with its own mini-identity (name, palette, typography) so the gallery shows *range*, not one style six times.
- Complete conversion anatomy: hero with offer, social proof, benefits, objection handling, single strong CTA repeated. These demos teach prospects what a good landing page looks like — that's the sales pitch.
- Fully responsive, Lighthouse ≥95 across the board.
- A small floating badge/banner: "Demo by [Your Name] — get one like this" linking back to the Hub, so demos convert on their own.
- Each ships with an OG image so links shared on social/WhatsApp look professional.

## Design direction

- Hub: dark, premium, editorial-modern with restrained motion (scroll-triggered reveals, hover states) — the `taste-skill` / anti-generic standards apply.
- Demos: each intentionally different (one warm/local, one clinical/clean, one dark/tech, one bold/product). Range is the portfolio.
- No stock-template look, no lorem ipsum — realistic copy on every page, because copy is half of what clients are buying.

## Technical

- PHP pages (no framework — plain PHP templates), CSS and vanilla JS per page; demos are self-contained folders so any demo can be handed to a client as-is.
- Fonts self-hosted, images in AVIF/WebP with proper sizing, zero render-blocking third-party scripts (Cal.com embed lazy-loaded).
- Form handling: native PHP endpoint (`contact.php`) using PHPMailer via SMTP, with honeypot + rate-limit spam protection. No third-party form service needed.
- Local development: PHP built-in server (`php -S localhost:8000`) — no XAMPP required unless preferred.
- SEO on the Hub: title/meta targeting "landing page designer [city/AU]", Person + Service JSON-LD schema, sitemap, OG images. Demos set to `noindex` (they're fictional businesses — you don't want them ranking).
- Analytics: Plausible or GA4 to see which demos get attention.
- Git repo from day one; deploy on push.

## Client-attraction layer (beyond the site)

The site alone attracts no one; it converts traffic you send to it:
1. **Distribution assets** — each finished demo becomes a post ("I built a plumber landing page in 2 days — here's the before/after thinking") for LinkedIn/X/design communities.
2. **Outreach ammo** — send the matching-niche demo to prospects: "Here's what I'd build for you" beats any cold pitch.
3. **SEO** — Hub targets local + service keywords; slow burn but free.
4. **Marketplace listings** — the demos can be listed on template marketplaces for passive leads.

## Build phases

- **Phase 1 (ship first):** Hub + 2 strongest demos (trades + SaaS — one local, one modern). Live on a domain. A small live portfolio beats a big unfinished one.
- **Phase 2:** Remaining 4 demos, one at a time, each announced/distributed as it ships.
- **Phase 3:** Polish — testimonials as real clients arrive, case-study snippets, pricing experiments.

## Success criteria

- Hub loads < 1.5s, Lighthouse ≥95 all categories.
- Every demo indistinguishable from a real client project.
- At least one clear CTA visible at every scroll position on the Hub.
- You can send any single URL to a prospect and it sells without explanation.

## Out of scope (YAGNI)

- Blog/CMS, user accounts, custom backend, multi-language, dark/light toggle.
