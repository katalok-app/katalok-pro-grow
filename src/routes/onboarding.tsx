import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Plus, Trash2, ArrowLeft, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  clearSession,
  createService,
  deleteService,
  getMyProfile,
  getStoredToken,
  getStoredUser,
  updateMyProfile,
  type KatalokService,
  type ProfessionalProfile,
} from "@/lib/katalok-api";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Your Katalok Pro Dashboard — Onboarding" },
      { name: "description", content: "Complete your Katalok pro profile and create your services." },
    ],
  }),
  component: OnboardingPage,
});

type Tab = "profile" | "services";

function OnboardingPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate({ to: "/" });
      return;
    }
    (async () => {
      try {
        const p = await getMyProfile();
        setProfile(p);
      } catch (err: any) {
        setError(err?.message ?? "Could not load your profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  function onLogout() {
    clearSession();
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const user = getStoredUser();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-10 md:py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to homepage
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Welcome{user ? `, ${user.name.split(" ")[0]}` : ""}</span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl">
              Your <span className="italic text-mocha">pro dashboard</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Set up your public profile and create the services clients can book.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-2 border-b border-border">
          {(["profile", "services"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm capitalize transition ${
                tab === t
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "profile" && profile && (
            <ProfileTab profile={profile} onSaved={setProfile} />
          )}
          {tab === "services" && profile && (
            <ServicesTab profile={profile} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- Profile Tab ---------------- */

const profileSchema = z.object({
  bio: z.string().trim().max(800).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});

function ProfileTab({
  profile,
  onSaved,
}: {
  profile: ProfessionalProfile;
  onSaved: (p: ProfessionalProfile) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const parsed = profileSchema.parse({
        bio: form.get("bio"),
        location: form.get("location"),
      });
      const updated = await updateMyProfile({
        bio: parsed.bio || null,
        location: parsed.location || null,
      });
      onSaved(updated);
      setSavedAt(Date.now());
    } catch (err: any) {
      setError(err?.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} className="card-soft grid gap-4 p-6 lg:col-span-3">
        <div>
          <h2 className="text-xl">Public profile</h2>
          <p className="text-sm text-muted-foreground">Shown to clients on your Katalok page.</p>
        </div>

        <Input
          label="Location"
          name="location"
          defaultValue={profile.location ?? ""}
          placeholder="Douala, Bonamoussadi"
        />

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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save profile"}
        </button>
        {savedAt && (
          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Saved
          </p>
        )}
      </form>

      <aside className="card-soft grid gap-3 p-6 lg:col-span-2">
        <h3 className="text-lg">Account</h3>
        <Row label="Name" value={profile.user.name} />
        <Row label="Email" value={profile.user.email} />
        <Row label="Role" value={profile.user.role} />
        <Row label="Status" value={profile.isActive ? "Active" : "Inactive"} />
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ---------------- Services Tab ---------------- */

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  description: z.string().trim().min(2, "Description is required").max(800),
  price: z.coerce.number().min(0, "Price must be 0 or more").max(10_000_000),
  duration: z.coerce.number().int().min(1).max(1440).optional(),
  category: z.string().trim().max(60).optional().or(z.literal("")),
});

function ServicesTab({ profile }: { profile: ProfessionalProfile }) {
  const [services, setServices] = useState<KatalokService[]>(profile.services ?? []);
  const [adding, setAdding] = useState(false);

  async function onDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err?.message ?? "Could not delete service");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl">Your services</h2>
          <p className="text-sm text-muted-foreground">
            Services are saved directly to the Katalok platform.
          </p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary !px-4 !py-2.5 text-xs">
            <Plus className="h-4 w-4" /> Add service
          </button>
        )}
      </div>

      {adding && (
        <ServiceForm
          onCancel={() => setAdding(false)}
          onCreated={(s) => {
            setServices((prev) => [s, ...prev]);
            setAdding(false);
          }}
        />
      )}

      {services.length === 0 && !adding ? (
        <div className="card-soft p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No services yet. Add your first service so clients can book you.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <article key={s.id} className="card-soft p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base">{s.title}</h3>
                  {s.category && (
                    <p className="text-xs text-muted-foreground">{s.category}</p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(s.id)}
                  aria-label="Delete service"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {s.description && (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{s.price.toLocaleString()} XAF</span>
                <span>{s.duration ? `${s.duration} min` : ""}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  onCreated,
  onCancel,
}: {
  onCreated: (s: KatalokService) => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const parsed = serviceSchema.parse({
        title: form.get("title"),
        description: form.get("description"),
        price: form.get("price"),
        duration: form.get("duration") || undefined,
        category: form.get("category"),
      });
      const created = await createService({
        title: parsed.title,
        description: parsed.description,
        price: parsed.price,
        duration: parsed.duration ?? null,
        category: parsed.category || null,
      });
      onCreated(created);
    } catch (err: any) {
      setError(err?.message ?? "Could not create service");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-soft grid gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">New service</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <Input label="Title" name="title" placeholder="Knotless braids — medium" required />

      <div>
        <Label>Description</Label>
        <textarea
          name="description"
          rows={3}
          maxLength={800}
          required
          placeholder="What's included, how long it takes, what to expect…"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Price (XAF)" name="price" type="number" min={0} placeholder="25000" required />
        <Input label="Duration (min)" name="duration" type="number" min={1} placeholder="180" />
        <Input label="Category" name="category" placeholder="Braids" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Create service"}
      </button>
    </form>
  );
}

/* ---------------- Small UI helpers ---------------- */

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</span>;
}

function Input({
  label, name, type = "text", placeholder, required, defaultValue, min,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  min?: number;
}) {
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
