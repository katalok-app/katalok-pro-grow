import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const clientSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  city: z.string().trim().min(2).max(80),
  quarter: z.string().trim().min(2).max(80),
  consent: z.literal(true),
});

export const submitClientSignup = createServerFn({ method: "POST" })
  .inputValidator((input) => clientSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("client_signups")
      .insert({
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        quarter: data.quarter,
        consent: data.consent,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { signup_id: row.id };
  });
