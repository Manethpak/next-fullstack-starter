import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome back, {session.user.name}</p>
    </div>
  );
}
