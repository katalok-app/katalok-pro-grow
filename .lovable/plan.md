## Add client onboarding alongside professional waitlist

Right now the homepage waitlist flow only collects pros. We'll add a role choice at the top of the form so visitors pick **Professional** or **Client**, then show the right fields for each.

### User flow

1. In the Waitlist section, before Step 1, show two large cards:
   - **I'm a beauty professional** → existing multi-step pro flow (unchanged)
   - **I'm a client** → short single-step client form
2. A "Change" link lets them switch back to the role picker.

### Client form fields

- Full name
- WhatsApp number
- City
- Quarter / town
- Consent checkbox (same wording as pros)

On submit → success state ("You're on the client waitlist — we'll notify you at launch"). No onboarding step 2 for clients.

### Where data goes

New table `client_signups` (separate from `waitlist_signups` so pro pipeline stays clean):
- `full_name`, `phone`, `city`, `quarter`, `consent`, `status` (default `new`), timestamps
- RLS deny-all (same model as `waitlist_signups`); writes via a new `submitClientSignup` server function using `supabaseAdmin` with Zod validation

### Files touched

- New migration: create `client_signups` + GRANTs + RLS deny-all policy
- New `src/lib/client-signup.functions.ts` with `submitClientSignup` server fn
- `src/components/sections/Waitlist.tsx`: add role picker state, render either existing pro flow or new `ClientForm` subcomponent
- Update section heading/eyebrow copy to reflect "for pros and clients"

### Out of scope

- No auth, no client dashboard, no `/onboarding` step for clients
- No changes to existing pro flow fields, validation, or storage uploads
