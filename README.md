# Bogri Solutions — website

Static marketing site for **Bogri Solutions DOOEL** (Скопје). Plain HTML/CSS/JS, no
build step, no framework. Bilingual: Macedonian (default) + English toggle.
Designed for **GitHub Pages** on the custom domain **bogrisolutions.com**.

---

## What's in here

```
index.html              Single page (all sections)
assets/
  css/styles.css        Styles (palette + type derived from the logo)
  js/main.js            Language toggle, quote form, UI behaviour
  img/                  Brand-styled placeholder photos (swap with your own)
  logo-*.png            Logo variants (header / footer / white)
  favicon*, apple-touch-icon.png, og-image.jpg
CNAME                   Custom domain (bogrisolutions.com)
.nojekyll               Tells Pages to serve files as-is
robots.txt, sitemap.xml SEO
CREDITS                 Image slot → filename map + photo sources
add-images.sh           Helper to drop real photos into a slot
```

The page is **one file split into self-contained sections** (hero, services, why,
coverage, about, contact, footer). All text lives in one dictionary in
`assets/js/main.js`, so splitting a section into its own page later means moving a
block — no rewrite.

---

## Preview locally

Any static server works. For example:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly via `file://` also works, but a server is closer to
how Pages serves it.)

---

## Deploy to GitHub Pages

1. **Create a repo** and push these files to the **root** (not inside a subfolder):

   ```bash
   cd site
   git init
   git add .
   git commit -m "Bogri Solutions website"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<your-repo>.git
   git push -u origin main
   ```

2. In the repo on GitHub: **Settings → Pages**
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)` → **Save**

3. Still on **Settings → Pages**, under **Custom domain**, enter
   `bogrisolutions.com` and **Save**. (The `CNAME` file already sets this; GitHub
   will verify it.)

4. Wait for the DNS check to pass (see below), then tick **Enforce HTTPS**.

---

## DNS records (set these at your domain registrar)

Point the **apex/root** domain `bogrisolutions.com` at GitHub Pages with four **A**
records and four **AAAA** records, and the **www** subdomain with a **CNAME**.

**A records** (host: `@`):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**AAAA records** (host: `@`):

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**CNAME record** (host: `www`):

```
<your-account>.github.io
```

DNS changes can take from a few minutes up to ~24h to propagate. Once GitHub shows
the domain as verified, enable **Enforce HTTPS**.

---

## Connect the quote form to n8n

Near the top of `assets/js/main.js`:

```js
const RFQ_ENDPOINT = "https://n8n.bogrisolutions.com/webhook/website-rfq";
```

Set this to your live n8n webhook URL. The form sends a **JSON POST** with this shape:

```json
{
  "contact_name": "", "company": "", "email": "", "phone": "",
  "origin": "", "destination": "",
  "mode": "sea_fcl | sea_lcl | air | air_charter | obc | road_ftl | road_ltl",
  "incoterm": "", "goods_description": "",
  "weight_kg": "", "volume_cbm": "", "dimensions": "",
  "container_type": "", "container_qty": "",
  "ready_date": "", "notes": "",
  "source": "website", "lang": "mk | en",
  "submitted_at": "ISO-8601", "page_url": ""
}
```

Notes:
- The n8n webhook must return **2xx** for the success message to show, and should
  send **CORS** headers allowing the site origin (e.g. `Access-Control-Allow-Origin`).
- If the request fails (network/CORS/non-2xx), the form shows an error with a
  **mailto fallback** to `office@bogrisolutions.com` containing the same details.
- A hidden honeypot field (`website_url`) silently drops bot submissions; it is never
  forwarded.
- This is a public static site — **no secrets/tokens** belong in `main.js`.

---

## Swap in real photos

The images in `assets/img/` are on-brand placeholders. To use your own, just
**overwrite the file with the same name** (e.g. replace `assets/img/sea-fcl.webp`).
No code changes needed. See `CREDITS` for the slot → filename map and royalty-free
photo sources (Unsplash, Pexels).

Helper:

```bash
./add-images.sh hero ~/Pictures/port.jpg      # regenerates hero.webp + hero.jpg
```

The small filename tags shown on each image are toggled by
`SHOW_IMAGE_SLOT_LABELS` in `assets/js/main.js` — set it to `false` to hide them
once you've added your photos.

---

## Edit text / translations

All copy is in the `I18N` dictionary (`mk` and `en`) in `assets/js/main.js`, keyed by
`data-i18n` attributes in `index.html`. The Macedonian text is also written inline in
`index.html` so the page reads correctly with JavaScript disabled and for search
engines. **When you change a Macedonian string, update it in both places** (the inline
HTML and the `mk` entry) so they stay in sync; English lives only in the `en` entry.

---

## Going multi-page later

Each section is a standalone block and all copy is shared from one dictionary. To make,
say, a dedicated `/uslugi/` page: copy `index.html`, keep the header/footer, drop the
sections you don't need, and reuse the same `styles.css` / `main.js`. Add the new URL
to `sitemap.xml`.
