# Make Katalok speak to clients without losing the pro focus

Pros stay the headline act. Clients get a clear, trustworthy second lane — no new pages, no restructure, just sharper copy and a visible entry point.

## What changes

### 1. Header
- Keep current nav as-is.
- Replace the single "Join Waitlist" button with two compact CTAs:
  - **Join as Pro** (primary, current style) → `#waitlist`
  - **Find a Pro** (ghost) → `#waitlist` (scrolls to role picker, preselects client)
- On mobile, collapse to one "Join Waitlist" that still lands at the role picker.

### 2. Hero (`src/components/sections/Hero.tsx`)
- Eyebrow stays "For beauty professionals" — pros-first signal preserved.
- Add a one-line sub-note under the existing CTAs:
  > "Looking for a stylist instead? **Join as a client →**" (anchor link to `#waitlist`)
- No layout/imagery changes.

### 3. New small section: "For clients" strip
- Insert a slim band between `Levels` and `Waitlist` (or right above `Waitlist`).
- Headline: **Discover trusted beauty pros near you.**
- Three short benefit lines (icon + label, no images):
  - Verified portfolios — see real work before you book
  - Pros in your city & quarter — no more endless DMs
  - Early access — first clients get priority at launch
- CTA: **Join as a client** → scrolls to role picker.
- Visually lighter than pro sections (muted background, smaller type) so pros remain the dominant story.

### 4. Waitlist section (`src/components/sections/Waitlist.tsx`)
- Role picker already exists — tighten the copy:
  - Pro card: "I'm a beauty professional — list my services and get booked."
  - Client card: "I'm a client — find and book trusted pros near me."
- Eyebrow above the picker: "Join the waitlist — for pros and clients."
- Support a hash like `#waitlist?role=client` (or a small `useEffect` reading `location.hash`) so the "Find a Pro" / client CTAs land directly on the client form.

### 5. Footer (`src/components/SiteFooter.tsx`)
- Add a two-link row: "Join as a Pro" · "Join as a Client" (both → `#waitlist`).
- Tagline copy stays.

### 6. SEO (`src/routes/index.tsx`)
- Update meta description to mention both audiences without burying pros:
  > "Katalok helps African beauty pros get discovered and booked — and helps clients find trusted hairstylists, nail techs, makeup artists & barbers nearby. Join the waitlist."
- Title unchanged.

## Out of scope (this round)
- No new routes (`/for-clients`, `/for-pros`).
- No new imagery or sections beyond the slim client strip.
- No changes to forms, fields, server functions, DB schema, or the pro flow itself.
- No nav restructure beyond the two header CTAs.

## Files touched
- `src/components/SiteHeader.tsx` — dual CTA
- `src/components/sections/Hero.tsx` — client sub-line
- `src/components/sections/ForClients.tsx` *(new, small)*
- `src/routes/index.tsx` — mount new section + meta tweak
- `src/components/sections/Waitlist.tsx` — copy tightening + hash-based role preselect
- `src/components/SiteFooter.tsx` — dual link
