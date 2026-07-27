import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "参数错误" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const [user] = await db
      .select()
      .from(admin)
      .where(eq(admin.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json({ message: "用户名或密码错误" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ message: "用户名或密码错误" }, { status: 401 });
    }

    await createSession({ adminId: user.id, username: user.username });

    return NextResponse.json({ message: "登录成功" });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json(
      { message: "服务器错误，请检查数据库连接" },
      { status: 500 }
    );
  }
}
