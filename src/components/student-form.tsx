"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Student } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "create" | "edit";

type StudentFormProps = {
  mode: Mode;
  initialData?: Student;
};

export function StudentForm({ mode, initialData }: StudentFormProps) {
  const router = useRouter();
  const [studentNo, setStudentNo] = useState(initialData?.studentNo ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [gender, setGender] = useState(initialData?.gender ?? "男");
  const [className, setClassName] = useState(initialData?.className ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [remark, setRemark] = useState(initialData?.remark ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      studentNo: studentNo.trim(),
      name: name.trim(),
      gender,
      className: className.trim(),
      phone: phone.trim(),
      remark: remark.trim(),
    };

    try {
      const res = await fetch(
        mode === "create" ? "/api/students" : `/api/students/${initialData?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message || "保存失败");
        return;
      }

      if (mode === "create") {
        router.push("/welcome?message=" + encodeURIComponent("添加学生信息成功"));
      } else {
        router.push("/welcome?message=" + encodeURIComponent("修改学生信息成功"));
      }
      router.refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentNo">学号</Label>
          <Input
            id="studentNo"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            placeholder="请输入学号"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">性别</Label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            required
          >
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="className">班级</Label>
          <Input
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="请输入班级"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入电话"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="remark">备注</Label>
          <textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="请输入备注"
            rows={4}
            className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : mode === "create" ? "添加学生" : "保存修改"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/welcome")}
          disabled={loading}
        >
          返回列表
        </Button>
      </div>
    </form>
  );
}
