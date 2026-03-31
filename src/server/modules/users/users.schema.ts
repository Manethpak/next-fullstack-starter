import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
