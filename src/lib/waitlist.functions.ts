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
  city: z.string().trim().min(2).max(80),
  quarter: z.string().trim().min(2).max(80),
  business_name: z.string().trim().min(2).max(120),
  profession: z.enum(["Hairstylist", "Barber", "Nail Technician", "Makeup Artist", "Other"]),
  social_link: z.string().trim().max(255).optional().or(z.literal("")),
  years_experience: z.number().int().min(0).max(80).nullable().optional(),
  services: z.array(z.string().min(1).max(60)).min(1).max(20),
  posts: z.array(postSchema).max(30).default([]),
  consent: z.literal(true),
});

export const submitWaitlistApplication = createServerFn({ method: "POST" })
  .inputValidator((input) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Waitlist signup
    const { data: signup, error: signupErr } = await supabaseAdmin
      .from("waitlist_signups")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        quarter: data.quarter,
        business_name: data.business_name,
        profession: data.profession,
        social_link: data.social_link || null,
        years_experience: data.years_experience ?? null,
        services: data.services,
        sample_work_urls: [],
        consent: data.consent,
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
        profession: data.profession,
        city: data.city,
        quarter: data.quarter,
        business_name: data.business_name,
        phone: data.phone,
        social_link: data.social_link || null,
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
