# Next.js + Hono Fullstack Starter — Agent Reference

## Architecture Overview

This is a **Next.js 15 + Hono** fullstack starter with a **hard client/server boundary**. There are **no server actions** and **no RSC data fetching**. All data flows through:

```
Client (React) → TanStack Query → Typed Hono RPC Client → Hono Router → Service → Prisma → PostgreSQL
```

## Key Principles

1. **No `"use server"`** — all mutations and queries go through the Hono API
2. **No RSC data fetching** — pages are thin UI shells; data is fetched client-side via TanStack Query
3. **End-to-end type safety** — Hono RPC types flow from router → `hc()` client → query hooks
4. **Modular backend** — each feature is a self-contained module in `src/server/modules/`
5. **Convention over configuration** — module routers are auto-mounted via `registerModules()`

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/[[...route]]/         # Hono catch-all route handler
│   ├── (protected)/              # Auth-gated route group
│   └── auth/                     # Auth pages (sign-in, sign-up)
├── components/
│   ├── providers.tsx             # QueryClientProvider + ThemeProvider + Toaster
│   ├── module/                   # Feature-specific UI components
│   └── ui/                       # shadcn/ui primitives
├── features/                     # Frontend feature slices
│   └── [feature]/
│       ├── components/           # React components for this feature
│       ├── hooks/                # Custom React hooks
│       └── queries.ts            # TanStack Query definitions (useQuery, useMutation)
├── hooks/                        # Shared React hooks
├── lib/
│   ├── api-client.ts             # Typed Hono RPC client (hc<AppHono>)
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth React client
│   ├── prisma.ts                 # Prisma singleton
│   └── query-client.ts           # QueryClient singleton config
└── server/
    ├── factory.ts                # Hono typed context factory
    ├── router.ts                 # Exports AppHono type (union of all module routers)
    ├── middleware/               # Hono middlewares (auth, etc.)
    └── modules/                  # Feature-based backend modules
        ├── _index.ts             # Auto-mounts all module routers
        └── [feature]/
            ├── [feature].router.ts   # Hono router (validates, calls service, returns JSON)
            ├── [feature].service.ts  # Business logic (calls Prisma)
            └── [feature].schema.ts   # Zod schemas for input validation
```

## Module Convention

Every backend module follows a strict 3-file pattern:

### `[feature].schema.ts`

Zod schemas for input validation. Export both the schema and the inferred TypeScript type.

```ts
import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
```

### `[feature].service.ts`

Pure business logic. Takes validated input, calls Prisma, returns data. No HTTP concerns.

```ts
"server only";
import { prisma } from "@/lib/prisma";

export async function getItems() {
  return prisma.item.findMany();
}
```

### `[feature].router.ts`

Hono router. Validates input with Zod, calls service, returns JSON. Applies `authGuard` for protected routes.

```ts
"server only";
import { HonoFactory } from "@/server/factory";
import { authGuard } from "@/server/middleware/auth";
import * as itemService from "./item.service";
import { createItemSchema } from "./item.schema";

const itemRouter = HonoFactory.createApp()
  .use("*", authGuard)
  .get("/", async (c) => {
    const items = await itemService.getItems();
    return c.json(items, 200);
  })
  .post("/", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ message: "Unauthorized" }, 401);

    const body = await c.req.json();
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "Invalid input", errors: parsed.error.issues }, 400);
    }

    const item = await itemService.createItem(parsed.data);
    return c.json(item, 201);
  });

export { itemRouter };
```

### Registering a Module

Add the router to `src/server/modules/_index.ts`:

```ts
import { itemRouter } from "./item/item.router";

export function registerModules(app) {
  // existing modules...
  app.route("/items", itemRouter);
}
```

## Frontend: TanStack Query Pattern

### `features/[feature]/queries.ts`

Define query keys and hooks using the typed `apiClient`:

```ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const itemsKeys = {
  all: ["items"] as const,
  detail: (id: string) => ["items", id] as const,
};

export function useItems() {
  return useQuery({
    queryKey: itemsKeys.all,
    queryFn: async () => {
      const res = await apiClient.items.$get();
      if (!res.ok) throw new Error("Failed to fetch items");
      return res.json();
    },
  });
}

export function useCreateItem() {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiClient.items.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
  });
}
```

### Usage in Components

```tsx
"use client";
import { useItems, useCreateItem } from "@/features/items/queries";

function ItemsPage() {
  const { data: items, isLoading } = useItems();
  const createItem = useCreateItem();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {items?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={() => createItem.mutate({ name: "New Item" })}>Create</button>
    </div>
  );
}
```

## Auth Patterns

### Protecting API Routes

Apply `authGuard` middleware on the router. It requires `applySession` to have run first (which it does globally in `route.ts`).

```ts
const router = HonoFactory.createApp()
  .use("*", authGuard) // blocks unauthenticated requests
  .get("/", async (c) => {
    const user = c.get("user"); // typed, non-null after authGuard
    // ...
  });
```

### Protecting Pages

Use the `(protected)` route group in `src/app/`. The Next.js middleware at `src/app/middleware.ts` checks for the session cookie and redirects to `/auth/sign-in` if missing.

### Client-Side Auth

Use the re-exported helpers from `@/lib/auth-client`:

```ts
import { signIn, signOut, signUp, useSession } from "@/lib/auth-client";
```

## Environment Variables

| Variable              | Scope           | Purpose                               |
| --------------------- | --------------- | ------------------------------------- |
| `DATABASE_URL`        | Server          | PostgreSQL connection string          |
| `SHADOW_DATABASE_URL` | Server          | Prisma shadow database for migrations |
| `BASE_URL`            | Server          | Base URL for auth server and CORS     |
| `NEXT_PUBLIC_APP_URL` | Client + Server | Base URL for typed API client         |
| `BETTER_AUTH_SECRET`  | Server          | Better Auth session signing key       |

## Adding a New Feature — Checklist

1. **Database**: Add model(s) to `prisma/schema.prisma`
2. **Generate**: Run `npx prisma generate` (and `npx prisma db push` for new tables)
3. **Backend**: Create `src/server/modules/[feature]/` with `.schema.ts`, `.service.ts`, `.router.ts`
4. **Register**: Add router to `src/server/modules/_index.ts`
5. **Frontend**: Create `src/features/[feature]/queries.ts` with TanStack Query hooks
6. **UI**: Create components in `src/features/[feature]/components/`
7. **Pages**: Add route in `src/app/` that uses the feature components

## Important Notes

- **Zod v4**: Use `.error.issues` not `.error.errors` for validation errors
- **No server actions**: Do not use `"use server"` directives
- **No RSC fetching**: Do not fetch data in server components for dynamic content
- **Prisma**: Always import from `@/lib/prisma` (singleton pattern)
- **Hono routers**: Always use `HonoFactory.createApp()` for type-safe context
- **API client**: Always use `apiClient` from `@/lib/api-client` — never raw `fetch()`
- **Lint/format scope**: `pnpm lint`, `pnpm lint:fix`, `pnpm fmt`, and `pnpm fmt:check` target `src/` only
