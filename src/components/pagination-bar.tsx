"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  q: string;
};

function buildHref(page: number, pageSize: number, q: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (q) params.set("q", q);
  return `/welcome?${params.toString()}`;
}

export function PaginationBar({
  page,
  totalPages,
  pageSize,
  total,
  q,
}: PaginationProps) {
  const router = useRouter();
  const pageSizeOptions = Array.from({ length: 20 }, (_, i) => i + 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-600">
        共 <span className="font-medium text-slate-900">{total}</span> 条记录，第{" "}
        <span className="font-medium text-slate-900">{page}</span> /
        <span className="font-medium text-slate-900"> {totalPages}</span> 页
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-slate-600">
            每页
          </label>
          <select
            id="pageSize"
            value={pageSize}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
            onChange={(e) => {
              const nextSize = Number(e.target.value);
              router.push(buildHref(1, nextSize, q));
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-sm text-slate-600">条</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(1, pageSize, q)}
              aria-disabled={!canPrev}
              className={!canPrev ? "pointer-events-none opacity-50" : undefined}
              tabIndex={canPrev ? 0 : -1}
            >
              第一页
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(Math.max(1, page - 1), pageSize, q)}
              aria-disabled={!canPrev}
              className={!canPrev ? "pointer-events-none opacity-50" : undefined}
              tabIndex={canPrev ? 0 : -1}
            >
              上一页
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(Math.min(totalPages, page + 1), pageSize, q)}
              aria-disabled={!canNext}
              className={!canNext ? "pointer-events-none opacity-50" : undefined}
              tabIndex={canNext ? 0 : -1}
            >
              下一页
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={buildHref(totalPages, pageSize, q)}
              aria-disabled={!canNext}
              className={!canNext ? "pointer-events-none opacity-50" : undefined}
              tabIndex={canNext ? 0 : -1}
            >
              最后一页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
