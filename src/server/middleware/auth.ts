import { auth } from "@/lib/auth";
import { HonoFactory } from "../factory";

export const applySession = HonoFactory.createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const authGuard = HonoFactory.createMiddleware(async (c, next) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: "Unauthorized",
      },
      401,
    );
  }

  return next();
});
