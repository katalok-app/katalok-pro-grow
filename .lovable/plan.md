## Goal
Merge the prelaunch onboarding flow into the waitlist form so professionals submit everything in one place: identity, business, location detail, the services they offer, and portfolio posts (with images) under each service.

## New waitlist form structure

A single multi-step form on the homepage `Waitlist` section (no more redirect to `/onboarding`).

**Step 1 — About you**
- Full name
- Phone
- Profession (existing chips)
- Years of experience (existing)
- Social link (existing)
- Consent (existing)

**Step 2 — Your business**
- Business name (new, required)
- City (existing)
- Quarter / neighborhood (new, required — free text, e.g. "Bonamoussadi")

**Step 3 — Services & portfolio**
- Multi-select chips of the 15 categories from `src/lib/categories.ts` (Braids, Nails, Make up, …).
- For each selected category, an expandable block lets the user add one or more **posts**:
  - Images (up to 6, uploaded to the existing `portfolio` storage bucket)
  - Service type / title (e.g. "Boho braids")
  - Price (XAF)
  - Duration (minutes)
  - Caption / description (optional)
- "Add another post" button per category. Posts can be removed before submit.
- At least one category required; posts are optional but encouraged with helper copy.

On submit: create the waitlist signup, the pro profile, and all portfolio posts in one server call. Show a success state ("You're in — we'll review your profile") instead of routing to `/onboarding`.

## Data model changes

Add columns via one migration:
- `waitlist_signups`: `business_name text`, `quarter text`, `services text[] default '{}'`
- `pro_profiles`: `business_name text`, `quarter text`
- `portfolio_posts`: already has everything needed (uses existing `service_title`, `price`, `duration_minutes`, `category`, `description`, `image_urls`).

No RLS changes — writes continue going through `supabaseAdmin` in server functions.

## Server function changes

Replace `createWaitlistSignup` in `src/lib/waitlist.functions.ts` with a single `submitWaitlistApplication` server fn that accepts:
```
{ signup fields, business_name, quarter, services[], posts: [{ category, service_title, price, duration_minutes, description, image_urls[] }] }
```
It inserts the signup, inserts the `pro_profiles` row linked by `signup_id`, then bulk-inserts all `portfolio_posts` linked to the new profile. Returns `{ signup_id }`.

Image uploads still happen client-side to the `portfolio` bucket (same pattern as today's `PortfolioForm`), then the resulting public URLs are passed into the server fn.

## Frontend changes

- Rewrite `src/components/sections/Waitlist.tsx` as a 3-step form with progress indicator, keeping existing visual tokens.
- Build a small `ServicePostsEditor` subcomponent that renders per-category accordion with nested post cards.
- Remove the "continue to /onboarding" redirect; show inline success.
- Keep `/onboarding` route file in place for now (still works for returning users), but homepage flow no longer depends on it.

## Validation
- Zod schema on both client and server: business_name 2–120, quarter 2–80, services min 1, each post requires service_title (2–120) and category; price/duration optional but numeric.
- Max 10 posts per submission to prevent abuse.

## Out of scope
- Editing posts after submit (still handled by `/onboarding` page).
- Admin approval UI.
