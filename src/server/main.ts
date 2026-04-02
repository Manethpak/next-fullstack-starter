import { HonoFactory } from "./factory";
import { applySession } from "./middleware/auth";
import { auth } from "@/server/core/auth";
import { cors } from "hono/cors";
import { postsRouter } from "./modules/posts/posts.router";
import { usersRouter } from "./modules/users/users.router";
import { logger } from "hono/logger";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const app = HonoFactory.createApp()
  .basePath("/api")
  .use(logger())
  .use("*", applySession)
  .on(
    ["POST", "GET"],
    "/auth/*",
    (c) => {
      return auth.handler(c.req.raw);
    },
    cors({
      origin: baseUrl,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .get("/ping", (c) => {
    return c.json(
      {
        message: "Pong!",
      },
      200,
    );
  })
  .route("/posts", postsRouter)
  .route("/users", usersRouter);

export type AppHono = typeof app;

export default app;
