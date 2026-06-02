import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CheckCircle2, ImagePlus, Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CATEGORIES } from "@/lib/categories";
import { createPortfolioPost, deletePortfolioPost, getOnboardingData, saveProProfile } from "@/lib/onboarding.functions";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Your Katalok Profile — Prelaunch Onboarding" },
      { name: "description", content: "Build your prelaunch Katalok profile and upload your portfolio." },
    ],
  }),
  component: OnboardingPage,
});

type ProfileRow = {
  id: string;
  signup_id: string;
  name: string;
  profession: string;
  city: string;
  phone: string;
  social_link: string | null;
  bio: string | null;
  status: string;
};

type PortfolioRow = {
  id: string;
  service_title: string;
  price: number | null;
  duration_minutes: number | null;
  category: string | null;
  description: string | null;
  image_urls: string[];
  status: string;
};

function OnboardingPage() {
  const navigate = useNavigate();
  const loadOnboardingData = useServerFn(getOnboardingData);
  const [signupId, setSignupId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [posts, setPosts] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("katalok.signup_id");
    if (!id) {
      navigate({ to: "/" });
      return;
    }
    setSignupId(id);
    (async () => {
      try {
        const data = await loadOnboardingData({ data: { signup_id: id } });
        setProfile(data.profile as ProfileRow | null);
        setPosts((data.posts as PortfolioRow[]) ?? []);
      } catch (err) {
        console.error(err);
        navigate({ to: "/" });
      } finally {
        setLoading(false);
      }
    })();
  }, [loadOnboardingData, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
            <span className="eyebrow">Step 2 of 2</span>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl">
              Build your <span className="italic text-mocha">prelaunch profile</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Seed your profile + portfolio now so the marketplace is ready to feature you on day one.
            </p>
          </div>
          {profile && (
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium text-cocoa">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> {profile.status === "approved" ? "Approved" : "Pending approval"}
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ProfileForm signupId={signupId!} profile={profile} onSaved={setProfile} />
          </div>
          <div className="lg:col-span-3">
            <PortfolioSection profile={profile} posts={posts} onChange={setPosts} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  profession: z.string().trim().min(2).max(60),
  city: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  social_link: z.string().trim().max(255).optional().or(z.literal("")),
  bio: z.string().trim().max(800).optional().or(z.literal("")),
});

function ProfileForm({
  signupId, profile, onSaved,
}: { signupId: string; profile: ProfileRow | null; onSaved: (p: ProfileRow) => void }) {
  const saveProfile = useServerFn(saveProProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const cached = (() => {
    try { return JSON.parse(localStorage.getItem("katalok.signup_data") ?? "{}"); } catch { return {}; }
  })();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const parsed = profileSchema.parse({
        name: form.get("name"),
        profession: form.get("profession"),
        city: form.get("city"),
        phone: form.get("phone"),
        social_link: form.get("social_link"),
        bio: form.get("bio"),
      });
      const data = await saveProfile({
        data: {
          profile_id: profile?.id ?? null,
          signup_id: signupId,
          name: parsed.name,
          profession: parsed.profession,
          city: parsed.city,
          phone: parsed.phone,
          social_link: parsed.social_link || null,
          bio: parsed.bio || null,
        },
      });
      onSaved(data as ProfileRow);
      setSavedAt(Date.now());
    } catch (err: any) {
      setError(err?.message ?? "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-soft sticky top-20 grid gap-4 p-6">
      <div>
        <h2 className="text-xl">Your profile</h2>
        <p className="text-sm text-muted-foreground">Visible on your future Katalok page.</p>
      </div>
      <Input label="Name" name="name" defaultValue={profile?.name ?? cached.name ?? ""} required />
      <Input label="Profession" name="profession" defaultValue={profile?.profession ?? cached.profession ?? ""} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="City" name="city" defaultValue={profile?.city ?? cached.city ?? ""} required />
        <Input label="Phone" name="phone" type="tel" defaultValue={profile?.phone ?? cached.phone ?? ""} required />
      </div>
      <Input label="Social link" name="social_link" defaultValue={profile?.social_link ?? cached.social_link ?? ""} placeholder="instagram.com/handle" />
      <div>
        <Label>Bio</Label>
        <textarea
          name="bio"
          defaultValue={profile?.bio ?? ""}
          rows={4}
          maxLength={800}
          placeholder="A few words on your craft, specialties, what makes you different…"
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : profile ? "Update profile" : "Create profile"}
      </button>
      {savedAt && (
        <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Saved
        </p>
      )}
    </form>
  );
}

function PortfolioSection({
  profile, posts, onChange,
}: { profile: ProfileRow | null; posts: PortfolioRow[]; onChange: (p: PortfolioRow[]) => void }) {
  const removePortfolioPost = useServerFn(deletePortfolioPost);
  const [adding, setAdding] = useState(false);

  if (!profile) {
    return (
      <div className="card-soft p-10 text-center">
        <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-xl">Portfolio</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your profile first to start uploading portfolio posts.
        </p>
      </div>
    );
  }

  async function deletePost(id: string) {
    await removePortfolioPost({ data: { id, profile_id: profile!.id } });
    onChange(posts.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl">Portfolio</h2>
          <p className="text-sm text-muted-foreground">Each post will be reviewed before going live.</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary !px-4 !py-2.5 text-xs">
          <Plus className="h-4 w-4" /> Add post
        </button>
      </div>

      {adding && (
        <PortfolioForm
          profileId={profile.id}
          onCancel={() => setAdding(false)}
          onCreated={(p) => { onChange([p, ...posts]); setAdding(false); }}
        />
      )}

      {posts.length === 0 && !adding ? (
        <div className="card-soft p-10 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No portfolio posts yet. Add your best work to get featured.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <article key={p.id} className="card-soft overflow-hidden">
              {p.image_urls[0] ? (
                <img src={p.image_urls[0]} alt={p.service_title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              ) : (
                <div className="aspect-[4/3] bg-secondary" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base">{p.service_title}</h3>
                    {p.category && <p className="text-xs text-muted-foreground">{p.category}</p>}
                  </div>
                  <button onClick={() => deletePost(p.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.price ? `${p.price.toLocaleString()} XAF` : "—"}</span>
                  <span>{p.duration_minutes ? `${p.duration_minutes} min` : "—"}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${p.status === "approved" ? "bg-accent/20 text-cocoa" : "bg-secondary text-muted-foreground"}`}>
                    {p.status}
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

const postSchema = z.object({
  service_title: z.string().trim().min(2).max(120),
  price: z.coerce.number().min(0).max(10_000_000).optional(),
  duration_minutes: z.coerce.number().int().min(1).max(1440).optional(),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().max(800).optional().or(z.literal("")),
});

function PortfolioForm({
  profileId, onCreated, onCancel,
}: { profileId: string; onCreated: (p: PortfolioRow) => void; onCancel: () => void }) {
  const submitPortfolioPost = useServerFn(createPortfolioPost);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const parsed = postSchema.parse({
        service_title: form.get("service_title"),
        price: form.get("price") || undefined,
        duration_minutes: form.get("duration_minutes") || undefined,
        category: form.get("category"),
        description: form.get("description"),
      });
      const image_urls: string[] = [];
      for (const f of files.slice(0, 6)) {
        const key = `posts/${profileId}/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(key, f);
        if (upErr) throw upErr;
        image_urls.push(supabase.storage.from("portfolio").getPublicUrl(key).data.publicUrl);
      }
      const data = await submitPortfolioPost({
        data: {
          profile_id: profileId,
          service_title: parsed.service_title,
          price: parsed.price ?? null,
          duration_minutes: parsed.duration_minutes ?? null,
          category: parsed.category || null,
          description: parsed.description || null,
          image_urls,
        },
      });
      onCreated(data as PortfolioRow);
    } catch (err: any) {
      setError(err?.message ?? "Could not save post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-soft grid gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">New portfolio post</h3>
        <button type="button" onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
      </div>

      <div>
        <Label>Images (up to 6)</Label>
        <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-3 py-8 text-sm text-muted-foreground hover:bg-secondary">
          <ImagePlus className="h-4 w-4" />
          {files.length > 0 ? `${files.length} image(s) selected` : "Tap to upload images"}
          <input type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 6))} />
        </label>
      </div>

      <Input label="Service title" name="service_title" placeholder="Knotless braids — medium" required />
      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Price (XAF)" name="price" type="number" min={0} placeholder="25000" />
        <Input label="Duration (min)" name="duration_minutes" type="number" min={1} placeholder="180" />
        <div>
          <Label>Category</Label>
          <select
            name="category"
            defaultValue=""
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <Label>Description (optional)</Label>
        <textarea name="description" rows={3} maxLength={800}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Submit post"}
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
      <Label>{label}</Label>
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
