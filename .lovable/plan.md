## Changes to the waitlist form (Step 1)

1. **Remove** the "Profession" chip selector.
2. **Add** a "Where do you work?" selector with two options:
   - Home-based
   - Salon-based
   (Single-select chips, required.)
3. **Social link**: relabel from "Instagram / social link" to "Social media link (any platform)" with placeholder like `https://… (Instagram, TikTok, Facebook, etc.)`. Keep it optional, accept any URL.

## Files to update

- `src/components/sections/Waitlist.tsx` — replace profession chips with work-location chips; update form state, validation, and submit payload; relabel social link input + placeholder.
- `src/lib/waitlist.functions.ts` — Zod schema: drop `profession` enum, add `work_location: z.enum(["home", "salon"])`; loosen `social_link` to any trimmed string up to 255 chars (already permissive); pass `work_location` into both `waitlist_signups` and `pro_profiles` inserts instead of `profession`.

## Database migration

Add `work_location text` to both `waitlist_signups` and `pro_profiles`. Keep the existing `profession` columns nullable for backward compatibility (no data loss, no destructive change). New submissions will write `work_location` and leave `profession` null.

## Out of scope

- Editing `/onboarding` page (still references profession; can be addressed separately if needed).
- Removing the legacy `profession` column.
