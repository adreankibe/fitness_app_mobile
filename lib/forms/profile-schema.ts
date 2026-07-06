import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(120, "Full name must be 120 characters or fewer"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
