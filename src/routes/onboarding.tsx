import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2, Plus, Trash2, ArrowLeft, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CATEGORIES } from "@/lib/categories";
import {
  ApiError,
  CATEGORY_ENUM_TO_LABEL,
  CATEGORY_LABEL_TO_ENUM,
  clearAuth,
  createService,
  deleteService,
  getMe,
  getMyProfessionalProfile,
  getServicesForProfessional,
  getTokens,
  ProfessionalProfile,
  KatalokService,
  updateMyProfile,
  updateMyProfessionalProfile,
  uploadPortfolioImage,
  ApiUser,
} from "@/lib/katalok-api";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Your Katalok Dashboard" },
      { name: "description", content: "Manage your Katalok profile, services, and portfolio." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [services, setServices] = useState<KatalokService[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens) {
      navigate({ to: "/login" });
      return;
    }
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
        if (me.role !== "PROFESSIONAL") {
          setLoadError("This dashboard is for professional accounts.");
          setLoading(false);
          return;
        }
        const pro = await getMyProfessionalProfile();
        setProfile(pro);
        const svcs = await getServicesForProfessional(pro.id);
        setServices(svcs);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuth();
          navigate({ to: "/login" });
          return;
        }
        setLoadError(err instanceof Error ? err.message : "Could not load your account");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  function onLogout() {
    clearAuth();
    navigate({ to: "/login" });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container-page py-16 text-center">
          <p className="text-destructive">{loadError}</p>
          <Link to="/" className="btn-primary mt-6 inline-flex">Back to homepage</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-10 md:py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to homepage
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Your dashboard</span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl">
              Hi <span className="italic text-mocha">{user?.name?.split(" ")[0] ?? "there"}</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Update your profile, add new services, and manage your portfolio.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {profile && (
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium text-cocoa">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {profile.subscriptionPlan}
              </span>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {user && profile && (
              <ProfileForm
                user={user}
                profile={profile}
                onSaved={(u, p) => { setUser(u); setProfile(p); }}
              />
            )}
          </div>
          <div className="lg:col-span-3">
            {profile && (
              <ServicesSection
                profile={profile}
                services={services}
                onChange={setServices}
              />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
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

function ProfileForm({
  user, profile, onSaved,
}: { user: ApiUser; profile: ProfessionalProfile; onSaved: (u: ApiUser, p: ProfessionalProfile) => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") ?? "").trim();
      const phone = String(form.get("phone") ?? "").trim();
      const email = String(form.get("email") ?? "").trim();
      const bio = String(form.get("bio") ?? "").trim();
      const location = String(form.get("location") ?? "").trim();

      const updatedUser = await updateMyProfile({
        name: name || undefined,
        phone: phone || undefined,
        email: email || undefined,
      });
      const updatedProfile = await updateMyProfessionalProfile({
        bio: bio || undefined,
        location: location || undefined,
      });
      onSaved(updatedUser, updatedProfile);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Could not save profile"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-soft sticky top-20 grid gap-4 p-6">
      <div>
        <h2 className="text-xl">Your profile</h2>
        <p className="text-sm text-muted-foreground">Visible on your Katalok page.</p>
      </div>
      <Input label="Name" name="name" defaultValue={user.name} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Phone" name="phone" type="tel" defaultValue={user.phone} required />
        <Input label="Email" name="email" type="email" defaultValue={user.email ?? ""} />
      </div>
      <Input label="Location" name="location" defaultValue={profile.location ?? ""} placeholder="Bonamoussadi, Douala" />
      <div>
        <Label>Bio</Label>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          rows={5}
          maxLength={800}
          placeholder="A few words on your craft, specialties, what makes you different…"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <ErrorList error={error} />
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save profile"}
      </button>
      {savedAt && (
        <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Saved
        </p>
      )}
    </form>
  );
}

function ServicesSection({
  profile, services, onChange,
}: { profile: ProfessionalProfile; services: KatalokService[]; onChange: (p: KatalokService[]) => void }) {
  const [adding, setAdding] = useState(false);

  async function onDelete(id: string) {
    try {
      await deleteService(id);
      onChange(services.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl">Services</h2>
          <p className="text-sm text-muted-foreground">Each service is a post clients can book.</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary !px-4 !py-2.5 text-xs">
          <Plus className="h-4 w-4" /> Add service
        </button>
      </div>

      {adding && (
        <ServiceForm
          professionalId={profile.id}
          onCancel={() => setAdding(false)}
          onCreated={(s) => { onChange([s, ...services]); setAdding(false); }}
        />
      )}

      {services.length === 0 && !adding ? (
        <div className="card-soft p-10 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No services yet. Add your first one to publish.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <article key={s.id} className="card-soft overflow-hidden">
              {s.featuredImageUrl ? (
                <img src={s.featuredImageUrl} alt={s.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              ) : (
                <div className="aspect-[4/3] bg-secondary" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{CATEGORY_ENUM_TO_LABEL[s.category] ?? s.category}</p>
                  </div>
                  <button onClick={() => onDelete(s.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{s.price.toLocaleString()} XAF</span>
                  <span>
                    {(s.durationHours ?? 0) > 0 && `${s.durationHours}h `}
                    {(s.durationMinutes ?? 0) > 0 && `${s.durationMinutes}m`}
                    {!s.durationHours && !s.durationMinutes && "—"}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider">
                    {s.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  professionalId, onCreated, onCancel,
}: { professionalId: string; onCreated: (s: KatalokService) => void; onCancel: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const title = String(form.get("title") ?? "").trim();
      const priceRaw = String(form.get("price") ?? "").trim();
      const durMinRaw = String(form.get("duration_minutes") ?? "").trim();
      const categoryLabel = String(form.get("category") ?? "").trim();
      const caption = String(form.get("caption") ?? "").trim();

      if (title.length < 3) throw new Error("Title must be at least 3 characters");
      const price = Number(priceRaw);
      if (!price || price <= 0) throw new Error("Price must be greater than 0");
      const categoryEnum = CATEGORY_LABEL_TO_ENUM[categoryLabel];
      if (!categoryEnum) throw new Error("Pick a valid category");
      if (caption.length < 2) throw new Error("Add a short caption");

      const durMin = durMinRaw ? Number(durMinRaw) : 0;
      const durationHours = Math.floor(durMin / 60);
      const durationMinutes = durMin % 60;

      let featuredImageUrl: string | undefined;
      const galleryImageUrls: string[] = [];
      for (const [i, f] of files.slice(0, 8).entries()) {
        if (f.size > 5 * 1024 * 1024) throw new Error(`${f.name} is larger than 5MB`);
        setProgress(`Uploading image ${i + 1}/${files.length}…`);
        const up = await uploadPortfolioImage(f);
        if (i === 0) featuredImageUrl = up.fileUrl;
        else galleryImageUrls.push(up.fileUrl);
      }

      setProgress("Creating service…");
      const svc = await createService({
        title,
        price,
        category: categoryEnum,
        caption,
        description: caption,
        durationHours: durationHours || undefined,
        durationMinutes: durationMinutes || undefined,
        status: "PUBLISHED",
        featuredImageUrl,
        galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : undefined,
      });
      onCreated(svc);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Could not save service"));
    } finally {
      setSaving(false);
      setProgress(null);
    }
    void professionalId;
  }

  return (
    <form onSubmit={onSubmit} className="card-soft grid gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">New service</h3>
        <button type="button" onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
      </div>

      <div>
        <Label>Images (up to 8)</Label>
        <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-3 py-8 text-sm text-muted-foreground hover:bg-secondary">
          <ImagePlus className="h-4 w-4" />
          {files.length > 0 ? `${files.length} image(s) selected` : "Tap to upload images"}
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 8))} />
        </label>
      </div>

      <Input label="Title" name="title" placeholder="Knotless braids — medium" required />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Price (XAF)" name="price" type="number" min={1} placeholder="25000" required />
        <Input label="Duration (min)" name="duration_minutes" type="number" min={1} placeholder="180" />
        <div>
          <Label>Category</Label>
          <select
            name="category"
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            defaultValue=""
            required
          >
            <option value="" disabled>Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label>Caption</Label>
        <textarea name="caption" rows={3} maxLength={800} required
          placeholder="Short caption clients will see…"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {progress && (
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress}
        </p>
      )}
      <ErrorList error={error} />

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Publish service"}
      </button>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</span>;
}

function Input({
  label, name, type = "text", placeholder, required, defaultValue, min,
}: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string | number; min?: number }) {
  return (
    <div>
      <Label>{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue as string | number | undefined}
        min={min}
        className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
