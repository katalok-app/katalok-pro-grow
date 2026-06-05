import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const uploadSchema = z.object({
  filename: z.string().min(1).max(200),
  content_type: z.string().min(1).max(100),
  data_base64: z.string().min(1).max(Math.ceil((MAX_SIZE * 4) / 3) + 100),
  folder: z.enum(["waitlist", "onboarding"]),
  profile_id: z.string().uuid().optional(),
});

export const uploadPortfolioImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data }) => {
    if (!ALLOWED_TYPES.includes(data.content_type)) {
      throw new Error("Unsupported image type");
    }

    const buf = Buffer.from(data.data_base64, "base64");
    if (buf.byteLength === 0 || buf.byteLength > MAX_SIZE) {
      throw new Error("Invalid image size");
    }

    const safeName = data.filename.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
    const prefix =
      data.folder === "onboarding" && data.profile_id
        ? `posts/${data.profile_id}`
        : `waitlist`;
    const key = `${prefix}/${crypto.randomUUID()}-${safeName}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("portfolio")
      .upload(key, buf, {
        cacheControl: "3600",
        upsert: false,
        contentType: data.content_type,
      });
    if (error) throw new Error(error.message);

    const url = supabaseAdmin.storage.from("portfolio").getPublicUrl(key).data.publicUrl;
    return { url, key };
  });
