import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { StudentForm } from "@/components/student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function NewStudentPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/welcome">返回列表</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>添加学生</CardTitle>
            <CardDescription>填写学生基本信息，保存后返回列表页。</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
