import { NextResponse } from "next/server";
import { studentFormSchema } from "@/lib/validators";
import { createStudent, listStudents, studentNoExists } from "@/lib/students";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const result = await listStudents({ q, page, pageSize });
    return NextResponse.json(result);
  } catch (error) {
    console.error("查询学生失败:", error);
    return NextResponse.json({ message: "查询学生失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (await studentNoExists(data.studentNo)) {
      return NextResponse.json({ message: "学号已存在" }, { status: 409 });
    }

    const row = await createStudent({
      studentNo: data.studentNo,
      name: data.name,
      gender: data.gender,
      className: data.className,
      phone: data.phone ?? "",
      remark: data.remark ?? "",
    });

    return NextResponse.json({ message: "添加学生信息成功", data: row }, { status: 201 });
  } catch (error) {
    console.error("添加学生失败:", error);
    return NextResponse.json({ message: "添加学生失败" }, { status: 500 });
  }
}
