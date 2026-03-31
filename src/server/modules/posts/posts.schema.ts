import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
});

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type Post = z.infer<typeof postSchema>;
