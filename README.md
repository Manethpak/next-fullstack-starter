# Next.js + Hono Fullstack Starter

A modern, type-safe fullstack starter for **Next.js 15** with a **hard client/server boundary**. No server actions, no RSC data fetching — all data flows through a typed Hono API layer with TanStack Query.

## 🚀 Overview

This starter enforces a clean separation between client and server:

```
Client (React) → TanStack Query → Typed Hono RPC Client → Hono Router → Service → Prisma → PostgreSQL
```

### Key Features

- **Next.js 15 (App Router)**: Latest features with React 19 support
- **Hard Client/Server Boundary**: No server actions, no RSC data fetching
- **Hono API**: High-performance API routes with full type safety
- **TanStack Query**: Client-side data fetching with caching and invalidation
- **End-to-End Type Safety**: Hono RPC types flow from router → `hc()` client → query hooks
- **Better Auth**: Secure, flexible authentication
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Modular Backend**: Feature-based modules with schema → service → router pattern
- **Tailwind CSS v4**: Latest utility-first styling
- **shadcn/ui**: Beautifully designed components

## 🛠️ Stack

| Technology                                   | Purpose                 |
| :------------------------------------------- | :---------------------- |
| [Next.js 15](https://nextjs.org/)            | Framework               |
| [React 19](https://react.dev/)               | UI Library              |
| [Hono](https://hono.dev/)                    | API Framework           |
| [TanStack Query](https://tanstack.com/query) | Data Fetching & Caching |
| [Better Auth](https://better-auth.com/)      | Authentication          |
| [Prisma](https://www.prisma.io/)             | ORM                     |
| [Tailwind CSS v4](https://tailwindcss.com/)  | Styling                 |
| [shadcn/ui](https://ui.shadcn.com/)          | Component Library       |
| [Zod](https://zod.dev/)                      | Schema Validation       |

## 🏁 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/manethpak/next-fullstack-starter.git
cd next-fullstack-starter
pnpm install
```

### 2. Environment Setup

```bash
cp .example.env .env
```

Update your `DATABASE_URL` and generate a `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database Initialization

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development

```bash
pnpm dev
```

Your app will be available at `http://localhost:3000`.

## 📂 Project Structure

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
│       ├── components/           # React components
│       ├── hooks/                # Custom React hooks
│       └── queries.ts            # TanStack Query hooks
├── hooks/                        # Shared React hooks
├── lib/
│   ├── api-client.ts             # Typed Hono RPC client (hc<AppHono>)
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth React client
│   ├── prisma.ts                 # Prisma singleton
│   └── query-client.ts           # QueryClient singleton
└── server/
    ├── factory.ts                # Hono typed context factory
    ├── router.ts                 # Exports AppHono type
    ├── middleware/               # Hono middlewares
    └── modules/                  # Feature-based backend modules
        ├── _index.ts             # Auto-mounts all module routers
        └── [feature]/
            ├── [feature].router.ts   # Hono router
            ├── [feature].service.ts  # Business logic
            └── [feature].schema.ts   # Zod schemas
```

## 🔌 Adding a New Feature

1. **Database**: Add model(s) to `prisma/schema.prisma`
2. **Generate**: Run `npx prisma generate` (and `npx prisma db push` for new tables)
3. **Backend**: Create `src/server/modules/[feature]/` with `.schema.ts`, `.service.ts`, `.router.ts`
4. **Register**: Add router to `src/server/modules/_index.ts`
5. **Frontend**: Create `src/features/[feature]/queries.ts` with TanStack Query hooks
6. **UI**: Create components in `src/features/[feature]/components/`
7. **Pages**: Add route in `src/app/` that uses the feature components

## 📜 Scripts

| Script          | Description                              |
| :-------------- | :--------------------------------------- |
| `pnpm dev`      | Starts the development server            |
| `pnpm build`    | Builds the application for production    |
| `pnpm start`    | Starts the production server             |
| `pnpm lint`     | Runs ESLint for code quality checks      |
| `pnpm auth:gen` | Generates Better Auth client/server code |

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [Maneth Pak](https://github.com/manethpak)
