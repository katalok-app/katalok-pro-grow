import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const waitlistSignupSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().min(2).max(80),
  profession: z.enum(["Hairstylist", "Barber", "Nail Technician", "Makeup Artist", "Other"]),
  social_link: z.string().trim().max(255).optional().or(z.literal("")),
  years_experience: z.number().int().min(0).max(80).nullable().optional(),
  sample_work_urls: z.array(z.string().url()).max(4).default([]),
  consent: z.literal(true),
});

export const createWaitlistSignup = createServerFn({ method: "POST" })
  .inputValidator((input) => waitlistSignupSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: signup, error } = await supabaseAdmin
      .from("waitlist_signups")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        profession: data.profession,
        social_link: data.social_link || null,
        years_experience: data.years_experience ?? null,
        sample_work_urls: data.sample_work_urls,
        consent: data.consent,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { id: signup.id };
  });