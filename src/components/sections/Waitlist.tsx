import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Loader2, ChevronRight, Sparkles, Scissors, ArrowLeft } from "lucide-react";
import { submitClientSignup } from "@/lib/client-signup.functions";
import { registerPro } from "@/lib/katalok-api";

type Role = "pro" | "client";


export function Waitlist() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash;
      if (h === "#waitlist-pro") setRole("pro");
      else if (h === "#waitlist-client") setRole("client");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  if (role === null) {
    return (
      <section id="waitlist" className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Join the waitlist — for pros and clients</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Join the <span className="italic text-mocha">Katalok waitlist</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick the option that fits you — we'll set you up at launch.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <button
            type="button"
            id="waitlist-pro"
            onClick={() => setRole("pro")}
            className="card-soft group flex flex-col items-start gap-3 p-6 text-left transition hover:border-primary hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Scissors className="h-5 w-5" />
            </span>
            <h3 className="text-lg">I'm a beauty professional</h3>
            <p className="text-sm text-muted-foreground">
              List your services and get booked by serious clients.
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Start pro signup <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            type="button"
            id="waitlist-client"
            onClick={() => setRole("client")}
            className="card-soft group flex flex-col items-start gap-3 p-6 text-left transition hover:border-primary hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-cocoa">
              <Sparkles className="h-5 w-5" />
            </span>
            <h3 className="text-lg">I'm a client</h3>
            <p className="text-sm text-muted-foreground">
              Find and book trusted beauty pros near you.
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Join client waitlist <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <div id="waitlist">
      <div className="container-page pt-10">
        <button
          type="button"
          onClick={() => {
            setRole(null);
            if (typeof window !== "undefined" && window.location.hash) {
              history.replaceState(null, "", window.location.pathname + window.location.search);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Change
        </button>
      </div>
      {role === "pro" ? <ProWaitlist /> : <ClientWaitlist />}
    </div>
  );
}

function ClientWaitlist() {
  const submit = useServerFn(submitClientSignup);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [quarter, setQuarter] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const schema = z.object({
    full_name: z.string().trim().min(2, "Enter your full name").max(100),
    phone: z.string().trim().min(6, "Enter your WhatsApp number").max(30),
    city: z.string().trim().min(2, "City required").max(80),
    quarter: z.string().trim().min(2, "Town / quarter required").max(80),
  });

  async function onSubmit() {
    setError(null);
    if (!consent) return setError("Please accept to continue");
    const r = schema.safeParse({ full_name: fullName, phone, city, quarter });
    if (!r.success) return setError(r.error.errors[0].message);
    setLoading(true);
    try {
      await submit({
        data: { full_name: fullName.trim(), phone: phone.trim(), city: city.trim(), quarter: quarter.trim(), consent: true },
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="container-page py-16 md:py-24">
        <div className="card-soft mx-auto max-w-xl p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl">You're on the list 🎉</h2>
          <p className="mt-3 text-muted-foreground">
            Thanks {fullName.split(" ")[0]}. We'll message you on{" "}
            <span className="font-medium text-foreground">{phone}</span> as soon as Katalok launches in your area.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">Client waitlist</span>
        <h2 className="mt-4 text-3xl sm:text-4xl">
          Get notified at <span className="italic text-mocha">launch</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Just a few details so we can let you know when pros near you are bookable.
        </p>
      </div>

      <div className="card-soft mx-auto mt-8 grid max-w-xl gap-5 p-6 sm:p-8">
        <Input label="Full name" value={fullName} onChange={setFullName} placeholder="Your full name" required />
        <Input label="WhatsApp number" value={phone} onChange={setPhone} type="tel" placeholder="+237 ..." required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="City" value={city} onChange={setCity} placeholder="Douala, Yaoundé…" required />
          <Input label="Town / quarter" value={quarter} onChange={setQuarter} placeholder="Bonamoussadi, Bastos…" required />
        </div>

        <button
          type="button"
          aria-pressed={consent}
          onClick={() => setConsent((v) => !v)}
          className="flex items-start gap-3 text-left text-sm text-muted-foreground"
        >
          <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${consent ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
            {consent && <CheckCircle2 className="h-3 w-3" />}
          </span>
          <span>I agree to be contacted by Katalok about early access and accept the privacy policy.</span>
        </button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="button" onClick={onSubmit} disabled={loading} className="btn-primary !px-5">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Submitting…" : "Join client waitlist"}
        </button>
      </div>
    </section>
  );
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

function ProWaitlist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) return setError("Please accept to continue");
    const r = schema.safeParse({ name, email, password });
    if (!r.success) return setError(r.error.errors[0].message);
    setLoading(true);
    try {
      await registerPro({ name: name.trim(), email: email.trim(), password });
      navigate({ to: "/onboarding" });
    } catch (err: any) {
      setError(err?.message ?? "Could not create your account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">Create your pro account</span>
        <h2 className="mt-4 text-3xl sm:text-4xl">
          Become a <span className="italic text-mocha">Katalok professional</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Create your account now. You'll add your bio, location and services on the next step.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card-soft mx-auto mt-8 grid max-w-xl gap-5 p-6 sm:p-8">
        <Input label="Full name" value={name} onChange={setName} placeholder="Your full name" required />
        <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
        <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" required />

        <button
          type="button"
          aria-pressed={consent}
          onClick={() => setConsent((v) => !v)}
          className="flex items-start gap-3 text-left text-sm text-muted-foreground"
        >
          <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${consent ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
            {consent && <CheckCircle2 className="h-3 w-3" />}
          </span>
          <span>I agree to the Katalok terms & privacy policy.</span>
        </button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary !px-5">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create pro account"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Your account is created directly in the Katalok platform — no separate app install needed.
        </p>
      </form>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</span>;
}

function Input({
  label, value, onChange, type = "text", placeholder, required, min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        min={min}
        required={required}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

