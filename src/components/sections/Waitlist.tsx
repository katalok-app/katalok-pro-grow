import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createWaitlistSignup } from "@/lib/waitlist.functions";

const PROFESSIONS = ["Hairstylist", "Barber", "Nail Technician", "Makeup Artist", "Other"];

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().min(2).max(80),
  profession: z.enum(["Hairstylist", "Barber", "Nail Technician", "Makeup Artist", "Other"]),
  social_link: z.string().trim().max(255).optional().or(z.literal("")),
  years_experience: z.coerce.number().int().min(0).max(80).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});

export function Waitlist() {
  const navigate = useNavigate();
  const submitWaitlistSignup = useServerFn(createWaitlistSignup);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [profession, setProfession] = useState("");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const parsed = schema.parse({
        full_name: form.get("full_name"),
        phone: form.get("phone"),
        city: form.get("city"),
        profession: form.get("profession"),
        social_link: form.get("social_link"),
        years_experience: form.get("years_experience") || undefined,
        consent,
      });

      // Upload sample work to storage first
      const sample_work_urls: string[] = [];
      for (const f of files.slice(0, 4)) {
        const key = `samples/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(key, f, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("portfolio").getPublicUrl(key);
        sample_work_urls.push(data.publicUrl);
      }

      const data = await submitWaitlistSignup({
        data: {
          full_name: parsed.full_name,
          phone: parsed.phone,
          city: parsed.city,
          profession: parsed.profession,
          social_link: parsed.social_link || null,
          years_experience: parsed.years_experience ?? null,
          sample_work_urls,
          consent: parsed.consent,
        },
      });

      // Store signup id locally so the user can continue onboarding
      localStorage.setItem("katalok.signup_id", data.id);
      localStorage.setItem(
        "katalok.signup_data",
        JSON.stringify({
          name: parsed.full_name,
          phone: parsed.phone,
          city: parsed.city,
          profession: parsed.profession,
          social_link: parsed.social_link ?? "",
        }),
      );
      setSuccess(data.id);
      setTimeout(() => navigate({ to: "/onboarding" }), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section id="waitlist" className="container-page py-20 md:py-28">
        <div className="card-soft mx-auto max-w-xl p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl">You're in 🎉</h2>
          <p className="mt-3 text-muted-foreground">
            Taking you to your prelaunch profile so you can start uploading your work…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Early access</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Be among the <span className="italic text-mocha">first professionals</span> on Katalok
          </h2>
          <p className="mt-4 text-muted-foreground">
            We're onboarding beauty professionals ahead of launch. Reserve your spot.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="card-soft mx-auto mt-10 grid max-w-2xl gap-4 p-6 sm:p-8"
        >
          <Field label="Full name" name="full_name" placeholder="Your full name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number" name="phone" type="tel" placeholder="+237 ..." required />
            <Field label="City" name="city" placeholder="Douala, Yaoundé…" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Profession</Label>
              <input type="hidden" name="profession" value={profession} />
              <div className="mt-1.5 grid gap-2">
                {PROFESSIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={profession === p}
                    onClick={() => setProfession(p)}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 text-left text-sm text-foreground transition hover:bg-secondary aria-pressed:border-primary aria-pressed:bg-primary/10"
                  >
                    <span className={`h-4 w-4 rounded-full border ${profession === p ? "border-primary bg-primary shadow-[inset_0_0_0_4px_var(--background)]" : "border-input"}`} />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Years of experience" name="years_experience" type="number" min={0} placeholder="3" />
          </div>
          <Field label="Instagram / Social link" name="social_link" placeholder="instagram.com/yourhandle" />

          <div>
            <Label>Sample work (optional, up to 4 images)</Label>
            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-3 py-6 text-sm text-muted-foreground hover:bg-secondary">
              <Upload className="h-4 w-4" />
              {files.length > 0 ? `${files.length} file(s) selected` : "Tap to upload images"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 4))}
              />
            </label>
          </div>

          <button
            type="button"
            aria-pressed={consent}
            onClick={() => setConsent((value) => !value)}
            className="flex items-start gap-3 text-left text-sm text-muted-foreground"
          >
            <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${consent ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
              {consent && <CheckCircle2 className="h-3 w-3" />}
            </span>
            <span>I agree to be contacted by Katalok about early access and accept the privacy policy.</span>
          </button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Reserving your spot…" : "Reserve my spot"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Free during pre-launch. No payment required.
          </p>
        </form>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</span>;
}

function Field({
  label, name, type = "text", placeholder, required, min,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; min?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
