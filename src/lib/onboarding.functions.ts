import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const uuidSchema = z.string().uuid();

const profileSchema = z.object({
  profile_id: uuidSchema.nullable().optional(),
  signup_id: uuidSchema,
  name: z.string().trim().min(2).max(100),
  profession: z.string().trim().min(2).max(60),
  city: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  social_link: z.string().trim().max(255).nullable().optional(),
  bio: z.string().trim().max(800).nullable().optional(),
});

const postSchema = z.object({
  profile_id: uuidSchema,
  service_title: z.string().trim().min(2).max(120),
  price: z.number().min(0).max(10_000_000).nullable().optional(),
  duration_minutes: z.number().int().min(1).max(1440).nullable().optional(),
  category: z.string().trim().max(60).nullable().optional(),
  description: z.string().trim().max(800).nullable().optional(),
  image_urls: z.array(z.string().url()).max(6).default([]),
});

export const getOnboardingData = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ signup_id: uuidSchema }).parse(input))
  .handler(async ({ data }) => {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("pro_profiles")
      .select("*")
      .eq("signup_id", data.signup_id)
      .maybeSingle();

    if (profileError) throw new Error(profileError.message);

    if (!profile) return { profile: null, posts: [] };

    const { data: posts, error: postsError } = await supabaseAdmin
      .from("portfolio_posts")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (postsError) throw new Error(postsError.message);

    return { profile, posts: posts ?? [] };
  });

export const saveProProfile = createServerFn({ method: "POST" })
  .inputValidator((input) => profileSchema.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      signup_id: data.signup_id,
      name: data.name,
      profession: data.profession,
      city: data.city,
      phone: data.phone,
      social_link: data.social_link || null,
      bio: data.bio || null,
      updated_at: new Date().toISOString(),
    };

    const query = data.profile_id
      ? supabaseAdmin
          .from("pro_profiles")
          .update(payload)
          .eq("id", data.profile_id)
          .eq("signup_id", data.signup_id)
      : supabaseAdmin.from("pro_profiles").insert(payload);

    const { data: profile, error } = await query.select("*").single();
    if (error) throw new Error(error.message);
    return profile;
  });

export const createPortfolioPost = createServerFn({ method: "POST" })
  .inputValidator((input) => postSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: post, error } = await supabaseAdmin
      .from("portfolio_posts")
      .insert({
        profile_id: data.profile_id,
        service_title: data.service_title,
        price: data.price ?? null,
        duration_minutes: data.duration_minutes ?? null,
        category: data.category || null,
        description: data.description || null,
        image_urls: data.image_urls,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return post;
  });

export const deletePortfolioPost = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: uuidSchema, profile_id: uuidSchema }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("portfolio_posts")
      .delete()
      .eq("id", data.id)
      .eq("profile_id", data.profile_id);

    if (error) throw new Error(error.message);
    return { id: data.id };
  });