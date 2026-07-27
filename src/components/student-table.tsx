"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Student } from "@/db/schema";
import { Button } from "@/components/ui/button";

export function StudentTable({ students }: { students: Student[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`确认删除学生「${name}」吗？此操作不可恢复。`)) {
      return;
    }

    setError("");
    setPendingId(id);

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message || "删除失败");
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("网络异常，删除失败");
    } finally {
      setPendingId(null);
    }
  }

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        暂无学生数据
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-3 py-3 font-medium">学号</th>
              <th className="px-3 py-3 font-medium">姓名</th>
              <th className="px-3 py-3 font-medium">性别</th>
              <th className="px-3 py-3 font-medium">班级</th>
              <th className="px-3 py-3 font-medium">电话</th>
              <th className="px-3 py-3 font-medium">备注</th>
              <th className="px-3 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {students.map((item) => {
              const busy = pendingId === item.id || isPending;
              return (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-3 py-3 text-slate-900">
                    {item.studentNo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{item.name}</td>
                  <td className="whitespace-nowrap px-3 py-3">{item.gender}</td>
                  <td className="whitespace-nowrap px-3 py-3">{item.className}</td>
                  <td className="whitespace-nowrap px-3 py-3">{item.phone || "-"}</td>
                  <td className="max-w-[180px] truncate px-3 py-3" title={item.remark}>
                    {item.remark || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        {pendingId === item.id ? "删除中..." : "删除"}
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/students/${item.id}/edit`}>修改</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
