import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/");
}

export default async function WelcomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              学生信息管理系统
            </h1>
            <p className="text-sm text-slate-500">
              当前用户：{session.username}
            </p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              退出登录
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>欢迎回来，{session.username}！</CardTitle>
            <CardDescription>
              登录成功。后续可在此管理学生基本信息。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              系统已完成身份验证。学生列表、搜索、分页及增删改功能将在后续迭代中提供。
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
