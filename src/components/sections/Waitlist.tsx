import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Plus, Trash2, Upload, ChevronLeft, ChevronRight, Sparkles, Scissors, ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import {
  ApiError,
  CATEGORY_LABEL_TO_ENUM,
  createService,
  register,
  updateMyProfessionalProfile,
  uploadPortfolioImage,
} from "@/lib/katalok-api";

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
          <span className="eyebrow">Join Katalok — for pros and clients</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Create your <span className="italic text-mocha">Katalok account</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick the option that fits you — we'll set you up right away.
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
              Create client account <ChevronRight className="h-3.5 w-3.5" />
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
      {role === "pro" ? <ProSignup /> : <ClientSignup />}
    </div>
  );
}

function ErrorList({ error }: { error: ApiError | Error | null }) {
  if (!error) return null;
  const details = error instanceof ApiError ? error.details : [];
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
      <p className="font-medium">{error.message}</p>
      {details.length > 0 && (
        <ul className="mt-1 list-disc pl-5">
          {details.map((d, i) => (
            <li key={i}>{d.field ? `${d.field}: ${d.message}` : d.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClientSignup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);

  async function onSubmit() {
    if (submittingRef.current || loading) return;
    setError(null);
    if (fullName.trim().length < 2) return setError(new Error("Enter your full name"));
    if (phone.trim().length < 7) return setError(new Error("Enter a valid WhatsApp number"));
    if (password.length < 8) return setError(new Error("Password must be at least 8 characters"));
    if (!consent) return setError(new Error("Please accept to continue"));
    submittingRef.current = true;
    setLoading(true);
    try {
      await register({
        name: fullName.trim(),
        phone: phone.trim(),
        password,
        role: "CLIENT",
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Something went wrong"));
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  if (success) {
    return (
      <section className="container-page py-16 md:py-24">
        <div className="card-soft mx-auto max-w-xl p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl">Welcome to Katalok 🎉</h2>
          <p className="mt-3 text-muted-foreground">
            You're signed in {fullName.split(" ")[0]}. Start exploring pros in your area.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">Client account</span>
        <h2 className="mt-4 text-3xl sm:text-4xl">
          Discover pros <span className="italic text-mocha">near you</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Create your account with your WhatsApp number and a password.
        </p>
      </div>

      <div className="card-soft mx-auto mt-8 grid max-w-xl gap-5 p-6 sm:p-8">
        <Input label="Full name" value={fullName} onChange={setFullName} placeholder="Your full name" required />
        <Input label="WhatsApp number" value={phone} onChange={setPhone} type="tel" placeholder="+237 6 ..." required />
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
          <span>I agree to the Katalok terms and privacy policy.</span>
        </button>

        <ErrorList error={error} />

        <button type="button" onClick={onSubmit} disabled={loading} className="btn-primary !px-5">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create client account"}
        </button>
      </div>
    </section>
  );
}

type DraftPost = {
  id: string;
  service_title: string;
  price: string;
  duration_minutes: string;
  description: string;
  files: File[];
};

type PostsByCategory = Record<string, DraftPost[]>;

function newDraft(): DraftPost {
  return {
    id: crypto.randomUUID(),
    service_title: "",
    price: "",
    duration_minutes: "",
    description: "",
    files: [],
  };
}

function ProSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [success, setSuccess] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [businessName, setBusinessName] = useState("");
  const [about, setAbout] = useState("");
  const [city, setCity] = useState("");
  const [quarter, setQuarter] = useState("");

  // Step 3
  const [services, setServices] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostsByCategory>({});
  const [consent, setConsent] = useState(false);

  function toggleService(cat: string) {
    setServices((prev) => {
      const has = prev.includes(cat);
      if (has) {
        setPosts((p) => {
          const next = { ...p };
          delete next[cat];
          return next;
        });
        return prev.filter((c) => c !== cat);
      }
      setPosts((p) => ({ ...p, [cat]: [newDraft()] }));
      return [...prev, cat];
    });
  }

  function updatePost(cat: string, id: string, patch: Partial<DraftPost>) {
    setPosts((p) => ({
      ...p,
      [cat]: (p[cat] ?? []).map((post) => (post.id === id ? { ...post, ...patch } : post)),
    }));
  }

  function addPost(cat: string) {
    setPosts((p) => ({ ...p, [cat]: [...(p[cat] ?? []), newDraft()] }));
  }

  function removePost(cat: string, id: string) {
    setPosts((p) => ({ ...p, [cat]: (p[cat] ?? []).filter((post) => post.id !== id) }));
  }

  function next() {
    setError(null);
    if (step === 1) {
      if (fullName.trim().length < 2) return setError(new Error("Enter your full name"));
      if (phone.trim().length < 7) return setError(new Error("Enter a valid WhatsApp number"));
      if (password.length < 8) return setError(new Error("Password must be at least 8 characters"));
    }
    if (step === 2) {
      if (businessName.trim().length < 2) return setError(new Error("Business name required"));
      if (about.trim().length < 2) return setError(new Error("Tell us about your work"));
      if (city.trim().length < 2) return setError(new Error("Town required"));
      if (quarter.trim().length < 2) return setError(new Error("Quarter / neighborhood required"));
    }
    setStep((s) => s + 1);
  }

  async function onSubmit() {
    setError(null);
    if (services.length === 0) return setError(new Error("Select at least one service you offer"));
    if (!consent) return setError(new Error("Please accept to continue"));

    setLoading(true);
    try {
      // 1) Register as PROFESSIONAL (returns JWT + stores it)
      setProgress("Creating your account…");
      await register({
        name: fullName.trim(),
        phone: phone.trim(),
        password,
        role: "PROFESSIONAL",
        plan: "STARTER",
      });

      // 2) Update professional profile with bio + location
      setProgress("Saving your profile…");
      const location = `${quarter.trim()}, ${city.trim()}`;
      const bio = `${businessName.trim()} — ${about.trim()}`;
      const { updateMyProfessionalProfile } = await import("@/lib/katalok-api");
      await updateMyProfessionalProfile({ bio, location });

      // 3) Create a Service for each portfolio post, uploading images
      for (const cat of services) {
        const categoryEnum = CATEGORY_LABEL_TO_ENUM[cat];
        if (!categoryEnum) continue;
        for (const p of posts[cat] ?? []) {
          const hasContent = p.service_title.trim() || p.files.length > 0 || p.price || p.duration_minutes || p.description.trim();
          if (!hasContent) continue;
          if (p.service_title.trim().length < 3) {
            throw new Error(`Each ${cat} post needs a service title of at least 3 characters`);
          }
          const priceNum = p.price ? Number(p.price) : 0;
          if (!priceNum || priceNum <= 0) {
            throw new Error(`Each ${cat} post needs a price greater than 0`);
          }

          setProgress(`Uploading images for ${cat}…`);
          let featuredImageUrl: string | undefined;
          const galleryImageUrls: string[] = [];
          for (const [i, f] of p.files.slice(0, 8).entries()) {
            if (f.size > 5 * 1024 * 1024) throw new Error(`${f.name} is larger than 5MB`);
            // Upload as portfolio image (also gives us a stable file URL)
            const up = await uploadPortfolioImage(f);
            if (i === 0) featuredImageUrl = up.fileUrl;
            else galleryImageUrls.push(up.fileUrl);
          }

          setProgress(`Creating service “${p.service_title.trim()}”…`);
          const durationMin = p.duration_minutes ? Number(p.duration_minutes) : 0;
          const durationHours = Math.floor(durationMin / 60);
          const durationMinutes = durationMin % 60;

          await createService({
            title: p.service_title.trim(),
            price: priceNum,
            category: categoryEnum,
            caption: p.description.trim() || p.service_title.trim(),
            description: p.description.trim() || undefined,
            durationHours: durationHours || undefined,
            durationMinutes: durationMinutes || undefined,
            brandName: businessName.trim(),
            town: city.trim(),
            location,
            status: "PUBLISHED",
            featuredImageUrl,
            galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : undefined,
          });
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error("Something went wrong"));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  if (success) {
    return (
      <section className="container-page py-20 md:py-28">
        <div className="card-soft mx-auto max-w-xl p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl">You're in 🎉</h2>
          <p className="mt-3 text-muted-foreground">
            Welcome to Katalok {fullName.split(" ")[0]} — your services are live. You can keep editing your profile
            and portfolio anytime.
          </p>
          <a href="/onboarding" className="btn-primary mt-6 inline-flex">
            Continue to your dashboard
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Professional signup</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Get started on <span className="italic text-mocha">Katalok</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about you, your business, and the services you offer. Add a few posts to publish your first services.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Stepper step={step} />

          <div className="card-soft mt-6 grid gap-5 p-6 sm:p-8">
            {step === 1 && (
              <>
                <h3 className="text-lg">Account</h3>
                <Input label="Full name" value={fullName} onChange={setFullName} placeholder="Your full name" required />
                <Input label="WhatsApp number" value={phone} onChange={setPhone} type="tel" placeholder="+237 6 ..." required />
                <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" required />
                <p className="text-xs text-muted-foreground">
                  You'll sign in with your WhatsApp number and this password.
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg">Professional profile</h3>
                <Input label="Business name" value={businessName} onChange={setBusinessName} placeholder="e.g. Glow by Ada" required />
                <div>
                  <Label>About your work<span className="ml-0.5 text-destructive">*</span></Label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={4}
                    maxLength={800}
                    placeholder="Tell clients about your craft, specialties, and what makes you different…"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Town" value={city} onChange={setCity} placeholder="Douala, Yaoundé…" required />
                  <Input label="Quarter / neighborhood" value={quarter} onChange={setQuarter} placeholder="Bonamoussadi, Bastos…" required />
                </div>
                <p className="text-xs text-muted-foreground">
                  Clients will use your quarter to find pros near them.
                </p>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg">Services & portfolio</h3>
                <div>
                  <Label>Which services do you offer? (select all that apply)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const active = services.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleService(c)}
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-primary bg-primary/10 text-foreground" : "border-input bg-background text-muted-foreground hover:bg-secondary"}`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {services.length > 0 && (
                  <div className="grid gap-5">
                    {services.map((cat) => (
                      <div key={cat} className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{cat}</h4>
                          <button
                            type="button"
                            onClick={() => addPost(cat)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add post
                          </button>
                        </div>

                        <div className="mt-3 grid gap-3">
                          {(posts[cat] ?? []).map((post, idx) => (
                            <div key={post.id} className="rounded-xl border border-border/70 bg-background p-3">
                              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Post {idx + 1}</span>
                                {(posts[cat]?.length ?? 0) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removePost(cat, post.id)}
                                    aria-label="Remove post"
                                    className="hover:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-3 py-4 text-xs text-muted-foreground hover:bg-secondary">
                                <Upload className="h-3.5 w-3.5" />
                                {post.files.length > 0 ? `${post.files.length} image(s) selected` : "Upload pictures (up to 8)"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) =>
                                    updatePost(cat, post.id, {
                                      files: Array.from(e.target.files ?? []).slice(0, 8),
                                    })
                                  }
                                />
                              </label>

                              <div className="mt-2 grid gap-2">
                                <Input
                                  label={`Service title (e.g. ${exampleFor(cat)})`}
                                  value={post.service_title}
                                  onChange={(v) => updatePost(cat, post.id, { service_title: v })}
                                  placeholder={exampleFor(cat)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    label="Price (XAF)"
                                    value={post.price}
                                    onChange={(v) => updatePost(cat, post.id, { price: v })}
                                    type="number"
                                    min={0}
                                    placeholder="25000"
                                  />
                                  <Input
                                    label="Duration (min)"
                                    value={post.duration_minutes}
                                    onChange={(v) => updatePost(cat, post.id, { duration_minutes: v })}
                                    type="number"
                                    min={1}
                                    placeholder="180"
                                  />
                                </div>
                                <div>
                                  <Label>Caption</Label>
                                  <textarea
                                    value={post.description}
                                    onChange={(e) => updatePost(cat, post.id, { description: e.target.value })}
                                    rows={2}
                                    maxLength={400}
                                    placeholder="Short caption…"
                                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  aria-pressed={consent}
                  onClick={() => setConsent((v) => !v)}
                  className="flex items-start gap-3 text-left text-sm text-muted-foreground"
                >
                  <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${consent ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                    {consent && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                  <span>I agree to the Katalok terms and privacy policy.</span>
                </button>
              </>
            )}

            {progress && (
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress}
              </p>
            )}

            <ErrorList error={error} />

            <div className="flex items-center justify-between gap-3 pt-1">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm hover:bg-secondary"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : <span />}

              {step < 3 ? (
                <button type="button" onClick={next} className="btn-primary !px-5">
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={onSubmit} disabled={loading} className="btn-primary !px-5">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Submitting…" : "Create my Katalok account"}
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Free during pre-launch. No payment required.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Account", "Profile", "Services"];
  return (
    <div className="flex items-center justify-center gap-2">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={l} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary text-foreground" : "border-input text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
            </span>
            <span className={`hidden text-xs sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>{l}</span>
            {n < labels.length && <span className="h-px w-6 bg-border sm:w-10" />}
          </div>
        );
      })}
    </div>
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
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function exampleFor(cat: string): string {
  const map: Record<string, string> = {
    "Braids": "Boho braids",
    "Nails": "French tips",
    "Make up": "Bridal makeup",
    "Hair Cut (Men)": "Fade + line up",
    "Hair Cut (Women)": "Layered cut",
    "Wig Installation": "Glueless frontal install",
    "Dreadlocks": "Retwist + style",
    "Natural Hair Styling": "Twist out",
    "Lash Extensions": "Hybrid set",
    "Micro Blading": "Powder brows",
    "Manicure & Pedicure": "Spa pedicure",
    "Hair Maintenance": "Wash & deep condition",
    "Hair Extensions": "Tape-in extensions",
    "Massage": "Swedish massage",
    "Facials": "Hydrating facial",
  };
  return map[cat] ?? "Service type";
}
