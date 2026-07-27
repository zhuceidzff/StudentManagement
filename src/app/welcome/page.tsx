import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession, getSession } from "@/lib/auth";
import { listStudents } from "@/lib/students";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StudentSearchBar } from "@/components/student-search-bar";
import { StudentTable } from "@/components/student-table";
import { PaginationBar } from "@/components/pagination-bar";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/");
}

type WelcomePageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
    message?: string;
  }>;
};

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Number(params.page ?? "1") || 1;
  const pageSize = Number(params.pageSize ?? "10") || 10;
  const message = params.message?.trim() ?? "";

  const result = await listStudents({ q, page, pageSize });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              学生信息管理系统
            </h1>
            <p className="text-sm text-slate-500">当前用户：{session.username}</p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              退出登录
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>欢迎回来，{session.username}！</CardTitle>
            <CardDescription>登录成功，可在下方管理学生基本信息。</CardDescription>
          </CardHeader>
          {message ? (
            <CardContent>
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </p>
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">学生基本信息列表</CardTitle>
                <CardDescription>
                  数据来源于 usermanagement 数据库 student 表
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/students/new">添加学生</Link>
              </Button>
            </div>
            <Suspense fallback={<div className="h-10 animate-pulse rounded-md bg-slate-100" />}>
              <StudentSearchBar defaultQuery={q} />
            </Suspense>
          </CardHeader>
          <CardContent className="space-y-4">
            <StudentTable students={result.items} />
            <PaginationBar
              page={result.page}
              totalPages={result.totalPages}
              pageSize={result.pageSize}
              total={result.total}
              q={q}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
