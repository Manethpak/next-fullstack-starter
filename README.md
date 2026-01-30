# Next.js Fullstack Starter

A modern, type-safe fullstack starter for **Next.js 15**. This boilerplate comes pre-configured with a robust backend architecture, seamless authentication, and a high-performance API layer.

## 🚀 Overview

This starter kit is designed to bridge the gap between frontend and backend in Next.js applications. It provides a structured approach to building fullstack apps, ensuring end-to-end type safety and a superior developer experience.

### Key Features

- **Next.js 15 (App Router)**: The latest features of Next.js including React 19 support.
- **Better Auth**: A secure, flexible, and developer-friendly authentication solution.
- **Hono API**: High-performance API routes with excellent DX and middleware support.
- **Prisma ORM**: Type-safe database access with PostgreSQL.
- **Tailwind CSS v4**: The latest evolution of utility-first styling.
- **shadcn/ui**: Beautifully designed components built with Radix UI.
- **Type Safety**: End-to-end TypeScript integration from the database to the UI.

## 🛠️ Stack

| Technology                                  | Purpose           |
| :------------------------------------------ | :---------------- |
| [Next.js 15](https://nextjs.org/)           | Framework         |
| [React 19](https://react.dev/)              | UI Library        |
| [Better Auth](https://better-auth.com/)     | Authentication    |
| [Hono](https://hono.dev/)                   | API Framework     |
| [Prisma](https://www.prisma.io/)            | ORM               |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling           |
| [shadcn/ui](https://ui.shadcn.com/)         | Component Library |
| [Zod](https://zod.dev/)                     | Schema Validation |

## 🏁 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/manethpak/next-fullstack-starter.git
cd next-fullstack-starter
pnpm install
```

### 2. Environment Setup

Create a `.env` file based on `.example.env`:

```bash
cp .example.env .env
```

Ensure you update your `DATABASE_URL` with your PostgreSQL connection string.

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

```text
├── prisma/
│   ├── migrations/     # Database migration history
│   ├── data/           # Seed data and database files
│   └── schema.prisma   # Database schema definition
├── public/             # Static assets
├── src/
│   ├── app/           # Next.js app router pages and layouts
│   │   ├── api/       # API routes using Hono
│   │   └── auth/      # Authentication pages
│   ├── components/    # React components
│   │   ├── common/    # Shared components
│   │   ├── module/    # Feature-specific components
│   │   └── ui/        # shadcn/ui components
│   ├── generated/     # Generated Prisma client
│   ├── lib/           # Shared utilities (auth, prisma, etc.)
│   └── server/        # Server-side logic
│       ├── factory/   # Factory patterns for Hono
│       ├── middleware/# Global API middlewares
│       └── module/    # Server-side business logic
```

## 📜 Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint for code quality checks.
- `pnpm auth:gen`: Generates Better Auth client/server code.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by [Maneth Pak](https://github.com/manethpak)
