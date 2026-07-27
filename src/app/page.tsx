import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect("/welcome");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-50 px-4 py-10">
      <LoginForm />
    </div>
  );
}
