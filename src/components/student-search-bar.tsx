"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StudentSearchBar({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(defaultQuery);
  const [pending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const keyword = q.trim();
    if (keyword) {
      params.set("q", keyword);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/welcome?${params.toString()}`);
    });
  }

  function handleReset() {
    setQ("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");
    startTransition(() => {
      router.push(`/welcome?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:flex-row">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="按学号、姓名或班级模糊搜索"
        className="sm:max-w-md"
        aria-label="搜索学生"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "搜索中..." : "搜索"}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={pending}>
          重置
        </Button>
      </div>
    </form>
  );
}
