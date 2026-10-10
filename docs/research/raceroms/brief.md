# Raceroms — page brief

Source: https://www.raceroms.com/ (redirects to https://raceroms.com/). Nuxt 3 SSR, Tailwind v3, shadcn-vue (reka-ui), Embla carousels, Greek (`lang="el"`), dark theme.

## Route map

| Source | Local | Files |
| --- | --- | --- |
| `https://raceroms.com/` | `/` | `src/app/page.tsx`, `src/components/sites/raceroms/*` |

Every other source route (services, projects, shop, blog, FAQ, equipment, about, videos, contact, privacy, warranty, brand pages such as `/car/alfa-romeo`, equipment pages, `/en`) still links to the live site.

## Files

- `site.ts`: navigation, social links, phone menu, languages
- `data.ts`: generated from the SSR payload (`__NUXT_DATA__`) and the rendered DOM. Holds 6 vehicle types / 205 brands, 5 specialty texts, 8 equipment items, 67 reviews, 9 FAQs, 5 stores
- `raceroms.css`: scoped theme tokens (the source's `.dark` HSL values), `.rr-container` (source `.container`), `.secondary-container`
- `fonts.css`: the source's `@font-face` rules (Audiowide, Outfit, Axiforma, Inter, plus the Audiowide metric-fallback faces), pointing at `public/sites/raceroms/fonts/`
- `icons.css`: the source's Iconify mask icons (heroicons, simple-icons, custom long arrows)
- Components: `Header`, `HeroBrands`, `Sections` (Specialty, Trust, Equipment, Reviews), `Faq`, `Footer`, `Notch`, `HomeCarousel`

## Sections (top to bottom)

1. Top bar: a notch that hangs from the top edge. Desktop shows the "Τηλέφωνα" and language menus (open on click); mobile shows social icons.
2. Nav: the desktop menu has hover/click dropdowns under "Tuning" and "Εταιρεία". On mobile, "Μενού" opens a 320px right-hand drawer with expandable groups and language links.
3. Hero: 680px (desktop) / 480px (mobile) image card, radius 42px / 24px, gradient overlay, logo, H1, CTA. The CTA smooth-scrolls to the brand section.
4. Brand selector: 6 tabs (cars, bikes, jetski, boats, tractors, trucks) over a 6/3-column logo grid. Volvo carries the green "Νέο" badge.
5. "Τι Κάνουμε / Ειδικότητα μας": Embla carousel with default options, white cards.
6. "Γιατί να μας εμπιστευτείς": Embla, 3 text slides.
7. "Νέος Εξοπλισμός": Embla, 8 equipment cards with a notch label.
8. "Πελάτες / Εμπειρίες πελατών": Embla with `{ loop: true }` and AutoHeight, 67 reviews.
9. FAQ: accordion, 9 items. The open title turns bold and the chevron rotates.
10. Footer: logo and legal links, 5 store rows (an accordion on mobile, a 4-column grid on desktop), back-to-top notch, socials, floating Viber button.

## Behaviour rules found

- Page container: 1400px max with a 0.8rem gutter. Sections use a 1312px max width.
- `--header-height` is 100px above 1024px and 0 at 1024px and below, so the nav row sits 12px lower on desktop.
- `.secondary-container { margin: 0 auto }` overrides the base `mt-8` on the FAQ list. Only `lg:mt-16` applies.
- Section headings use the Audiowide stack. Audiowide has no Greek glyphs, so Greek text falls back to the platform system font through the source's metric-adjusted fallback faces. The clone copies this stack exactly, so each platform renders the same as the source.

## Verification

- Pixel diff of full-page screenshots, Chromium at 1440px and 390px: 0 pixels differ by more than 40/255.
- Text positions match at 390, 768, 1024, 1440 and 1920px.
- Carousel snap positions after next/next/next/prev match the source within subpixel rounding, for all 4 carousels.
- Asset map: `asset-map.json` (API storage URL → local path). Two brand logos served as `.png` are actually WebP; browsers render them fine.
