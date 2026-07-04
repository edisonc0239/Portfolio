# Edison — Portfolio

A single-page static portfolio for web development work (landing pages, WooCommerce stores, business websites). Built with Bootstrap 5, vanilla JS, and self-hosted fonts. Hosted free on GitHub Pages.

**Live:** https://edisonc0239.github.io/Portfolio/

## Editing

Everything lives in `index.html` plus `assets/`. No build step — edit and push.

### Add a project to the gallery
1. Drop a **tall, full-page screenshot** into `assets/img/work/` (PNG or WebP, ~1000px wide, exported tall so the hover-scroll pans through the whole page).
2. In `index.html`, find the `WORK GALLERY` section and copy one `<div class="col-md-6 col-lg-4 reveal">…</div>` card block. Update:
   - the `href` and `<img src>` to your new image,
   - the `data-glightbox` title/description,
   - the `.work-title` and `.work-niche` text.

The current `project-one/two/three` images are **placeholders** — replace them with real screenshots.

### Turn on the contact form (required for email to work)
The form posts to [Web3Forms](https://web3forms.com) (free). It will not deliver email until you add a key:
1. Sign up at https://web3forms.com with **jecortina13@gmail.com** (that inbox receives enquiries).
2. Copy your **Access Key**.
3. In `index.html`, replace `WEB3FORMS-ACCESS-KEY` in the hidden `access_key` input with your key.

### Booking link
Replace `https://cal.com/CHANGE-ME` in the contact section with your real Cal.com / Calendly URL, or delete that "Book a free call" sentence.

### Replace placeholder assets
- `assets/img/portrait.png` — your photo (square).
- `assets/img/og.jpg` — social share image (1200×630).

## Local preview
Any static server works, e.g.:
```
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy
Push to `master` on GitHub; Pages serves from the repo root. The `.nojekyll` file keeps GitHub from processing the site with Jekyll.
