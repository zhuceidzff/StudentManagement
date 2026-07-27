import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStudentById } from "@/lib/students";
import { StudentForm } from "@/components/student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EditStudentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!id) {
    notFound();
  }

  const student = await getStudentById(id);
  if (!student) {
    notFound();
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
            <CardTitle>修改学生信息</CardTitle>
            <CardDescription>
              正在编辑：{student.name}（{student.studentNo}）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm mode="edit" initialData={student} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
