import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const postSchema = z.object({
  category: z.string().trim().min(1).max(60),
  service_title: z.string().trim().min(2).max(120),
  price: z.number().min(0).max(10_000_000).nullable().optional(),
  duration_minutes: z.number().int().min(1).max(1440).nullable().optional(),
  description: z.string().trim().max(800).nullable().optional(),
  image_urls: z.array(z.string().url()).max(6).default([]),
});

const applicationSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  password: z.string().min(8).max(128),
  business_name: z.string().trim().min(2).max(120),
  about: z.string().trim().min(2).max(800),
  city: z.string().trim().min(2).max(80),
  quarter: z.string().trim().min(2).max(80),
  services: z.array(z.string().min(1).max(60)).min(1).max(20),
  posts: z.array(postSchema).max(30).default([]),
  consent: z.literal(true),
});

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100_000;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pw),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2$${iterations}$${toB64(salt)}$${toB64(new Uint8Array(bits))}`;
}

export const submitWaitlistApplication = createServerFn({ method: "POST" })
  .inputValidator((input) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const password_hash = await hashPassword(data.password);

    // 1. Waitlist signup
    const { data: signup, error: signupErr } = await supabaseAdmin
      .from("waitlist_signups")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        quarter: data.quarter,
        business_name: data.business_name,
        services: data.services,
        sample_work_urls: [],
        consent: data.consent,
        password_hash,
      })
      .select("id")
      .single();

    if (signupErr) throw new Error(signupErr.message);

    // 2. Pro profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("pro_profiles")
      .insert({
        signup_id: signup.id,
        name: data.full_name,
        city: data.city,
        quarter: data.quarter,
        business_name: data.business_name,
        phone: data.phone,
        bio: data.about,
      })
      .select("id")
      .single();

    if (profileErr) throw new Error(profileErr.message);

    // 3. Portfolio posts
    if (data.posts.length > 0) {
      const rows = data.posts.map((p) => ({
        profile_id: profile.id,
        category: p.category,
        service_title: p.service_title,
        price: p.price ?? null,
        duration_minutes: p.duration_minutes ?? null,
        description: p.description || null,
        image_urls: p.image_urls,
      }));
      const { error: postsErr } = await supabaseAdmin.from("portfolio_posts").insert(rows);
      if (postsErr) throw new Error(postsErr.message);
    }

    return { signup_id: signup.id, profile_id: profile.id };
  });
