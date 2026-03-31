import type { z } from "zod";
import { HonoFactory } from "@/server/factory";
import { authGuard } from "@/server/middleware/auth";
import * as postService from "./posts.service";
import { createPostSchema, updatePostSchema } from "./posts.schema";

type CreatePostInput = z.infer<typeof createPostSchema>;
type UpdatePostInput = z.infer<typeof updatePostSchema>;

const postsRouter = HonoFactory.createApp()
  .use("*", authGuard)
  .get("/", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const posts = await postService.getPostsByAuthor(user.id);
    return c.json(posts, 200);
  })
  .get("/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const id = c.req.param("id");
    const post = await postService.getPostById(id, user.id);
    if (!post) return c.json({ message: "Post not found" }, 404);
    return c.json(post, 200);
  })
  .post("/", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const body = await c.req.json<CreatePostInput>();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "Invalid input", errors: parsed.error.issues }, 400);
    }

    const post = await postService.createPost(parsed.data, user.id);
    return c.json(post, 201);
  })
  .patch("/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const id = c.req.param("id");
    const body = await c.req.json<UpdatePostInput>();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "Invalid input", errors: parsed.error.issues }, 400);
    }

    const post = await postService.updatePost(id, parsed.data, user.id);
    return c.json(post, 200);
  })
  .delete("/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const id = c.req.param("id");
    await postService.deletePost(id, user.id);
    return c.json({ message: "Post deleted" }, 200);
  });

export { postsRouter };
