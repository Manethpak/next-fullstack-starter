import { Database, Lock, Zap } from "lucide-react";
import WelcomeUser from "@/components/module/home/welcome-user";

export default function Home() {
  return (
    <div>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Next.js Fullstack starter Kit
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A fullstack starter kit built with Next.js, Tailwind CSS, Prisma for database,
                  better-auth for Authentication/Authorization and Hono for API router.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <WelcomeUser />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Prisma Integration</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Type-safe database access with Prisma ORM for efficient data management.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Better Auth</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Secure authentication system with session management and user roles.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Hono Integration</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Fast, lightweight web framework for building modern APIs and applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Next.js Starter Kit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
