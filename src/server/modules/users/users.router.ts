import { HonoFactory } from "@/server/factory";
import { authGuard } from "@/server/middleware/auth";
import * as userService from "./users.service";
import { updateProfileSchema } from "./users.schema";

const usersRouter = HonoFactory.createApp()
  .use("*", authGuard)
  .get("/me", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const profile = await userService.getUserById(user.id);
    if (!profile) return c.json({ message: "User not found" }, 404);
    return c.json(profile, 200);
  })
  .patch("/me", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const body = await c.req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "Invalid input", errors: parsed.error.issues }, 400);
    }

    const profile = await userService.updateProfile(user.id, parsed.data);
    return c.json(profile, 200);
  });

export { usersRouter };
