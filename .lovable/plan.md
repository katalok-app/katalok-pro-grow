## Align landing page with the Katalok Brand Bible

The brand bible gives us a clear identity — espresso/cedar/gold palette, Cormorant Garamond + Outfit type, and very specific voice ("Book fine. Show up. Be served.", "She's got you.", dignity / skill / reliability / aspiration). Right now the site uses generic warm cream/cocoa tokens, Fraunces+Inter fonts, and softer copy. I'll bring the page in line with the bible without rebuilding the structure.

### 1. Design tokens (`src/styles.css`)
Update CSS variables to the bible palette (converted to oklch):
- `--background` → linen `#FFF9F0`
- `--foreground` → ink `#1C0E05`
- `--primary` → espresso `#3D2B1F`, deep espresso for cocoa
- `--accent` → gold `#D4AF37` (was caramel orange)
- `--mocha` → cedar `#8B5E3C`, `--sand` → `#E6BE8A`
- `--muted-foreground` → muted `#7A6650`
- `--gradient-warm` keeps linen→sand→cedar feel
- `--gradient-cocoa` becomes espresso → espresso-deep
- Swap fonts: `--font-display` → `Cormorant Garamond`, `--font-sans` → `Outfit`. Update Google Fonts `<link>` in `src/routes/__root.tsx`.
- Headings: lighter italic accents (`em` in gold/cedar) to match bible styling.

### 2. Voice & copy updates
Rewrite section copy in the bible's tone (italic display lines, short declarative body):

- **Hero** (`Hero.tsx`):
  - Eyebrow: "Identity to Income™ · Cameroon"
  - H1: `Book fine. / Show up. / *Be served.*` (gold italic on the last line)
  - Sub: "Katalok is the beauty booking platform where skill is the only currency — and reliability is the standard. For every woman, every stylist, in Cameroon."
  - Note under CTAs: "Commission-only · Zero cost to join · MoMo deposits"

- **Problem** (`Problem.tsx`): keep structure, rephrase around the "Aunty, I'm coming" / no-show / WhatsApp-status-of-40-people language.

- **Offer** (`Offer.tsx`): re-anchor on the 4 brand values — Dignity First, Skill is the Currency, Reliability as a Love Language, Aspirational for Everyone.

- **HowItWorks** (`HowItWorks.tsx`): reframe around the deposit system — "50% via MoMo at booking · 50% on the day · Confirmed means confirmed."

- **Levels** (`Levels.tsx`): keep tiers, but use bible-style eyebrow + italic display headings.

- **Vision** (`Vision.tsx`): replace the current quote with the public manifesto line: *"Where skill is the only currency. Where she knows her price before she leaves the house. Where 'Book fine. Show up. Be served.' is not a tagline — it is a guarantee."* CTA stays "Reserve my spot".

- **Waitlist** (`Waitlist.tsx`): only copy/eyebrow tweaks. Pro card → "I'm a beauty professional — she's got you." Client card → "I'm a client — book fine, show up, be served." No flow/field changes.

- **SiteHeader / SiteFooter**: tagline under the logo becomes "Book fine. Show up. Be served." Footer tagline mirrors the bible motto.

- **`<head>` meta** (`src/routes/index.tsx`): title → "Katalok — Book fine. Show up. Be served." Description aligned with the bible's positioning sentence.

### 3. Visual treatments
- Section eyebrows: 9px, letter-spacing 0.28em, uppercase, gold or cedar (already close — tighten via `.eyebrow` utility).
- Display headings use Cormorant Garamond; italic `em` spans render in gold (on dark) or cedar (on cream), per bible.
- Dark sections (Vision, parts of HowItWorks/Levels) use espresso-deep background with gold accents to echo the bible's `.promise-block` feel — same components, just restyled via tokens, no layout rewrite.
- Add a thin marquee strip ("Dignity · Skill · Reliability · Aspiration · ") above the footer using the existing `marquee` keyframe.

### Out of scope
- No new sections or routes, no DB or server-function changes, no changes to imagery (keep existing hero photos), no logo replacement.
- Form fields, validation, server functions, and storage flow stay exactly as they are.

### Files touched
- `src/styles.css` (tokens + fonts)
- `src/routes/__root.tsx` (Google Fonts link)
- `src/routes/index.tsx` (meta)
- `src/components/sections/Hero.tsx`
- `src/components/sections/Problem.tsx`
- `src/components/sections/Offer.tsx`
- `src/components/sections/HowItWorks.tsx`
- `src/components/sections/Levels.tsx`
- `src/components/sections/Vision.tsx`
- `src/components/sections/Waitlist.tsx` (copy only)
- `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`
