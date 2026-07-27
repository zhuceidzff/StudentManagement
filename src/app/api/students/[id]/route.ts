import { NextResponse } from "next/server";
import {
  deleteStudent,
  getStudentById,
  studentNoExists,
  updateStudent,
} from "@/lib/students";
import { studentFormSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: idRaw } = await context.params;
    const id = Number(idRaw);
    if (!id) {
      return NextResponse.json({ message: "无效的学生 ID" }, { status: 400 });
    }

    const row = await getStudentById(id);
    if (!row) {
      return NextResponse.json({ message: "学生不存在" }, { status: 404 });
    }

    return NextResponse.json({ data: row });
  } catch (error) {
    console.error("获取学生失败:", error);
    return NextResponse.json({ message: "获取学生失败" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id: idRaw } = await context.params;
    const id = Number(idRaw);
    if (!id) {
      return NextResponse.json({ message: "无效的学生 ID" }, { status: 400 });
    }

    const existing = await getStudentById(id);
    if (!existing) {
      return NextResponse.json({ message: "学生不存在" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = studentFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (await studentNoExists(data.studentNo, id)) {
      return NextResponse.json({ message: "学号已存在" }, { status: 409 });
    }

    const row = await updateStudent(id, {
      studentNo: data.studentNo,
      name: data.name,
      gender: data.gender,
      className: data.className,
      phone: data.phone ?? "",
      remark: data.remark ?? "",
    });

    return NextResponse.json({ message: "修改学生信息成功", data: row });
  } catch (error) {
    console.error("修改学生失败:", error);
    return NextResponse.json({ message: "修改学生失败" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id: idRaw } = await context.params;
    const id = Number(idRaw);
    if (!id) {
      return NextResponse.json({ message: "无效的学生 ID" }, { status: 400 });
    }

    const row = await deleteStudent(id);
    if (!row) {
      return NextResponse.json({ message: "学生不存在" }, { status: 404 });
    }

    return NextResponse.json({ message: "删除成功", data: row });
  } catch (error) {
    console.error("删除学生失败:", error);
    return NextResponse.json({ message: "删除学生失败" }, { status: 500 });
  }
}
