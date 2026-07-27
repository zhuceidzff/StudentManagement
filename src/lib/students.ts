import { count, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "@/db";
import { student, type NewStudent, type Student } from "@/db/schema";

export type StudentListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export type StudentListResult = {
  items: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function normalizePageSize(pageSize?: number) {
  const n = Number(pageSize) || 10;
  return Math.min(20, Math.max(1, Math.floor(n)));
}

function normalizePage(page?: number) {
  const n = Number(page) || 1;
  return Math.max(1, Math.floor(n));
}

function buildSearchCondition(q?: string): SQL | undefined {
  const keyword = q?.trim();
  if (!keyword) return undefined;

  const like = `%${keyword}%`;
  return or(
    ilike(student.studentNo, like),
    ilike(student.name, like),
    ilike(student.className, like)
  );
}

/** 分页查询学生列表，支持学号/姓名/班级模糊搜索 */
export async function listStudents(
  params: StudentListParams = {}
): Promise<StudentListResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const where = buildSearchCondition(params.q);

  const [totalRow] = await db
    .select({ value: count() })
    .from(student)
    .where(where);

  const total = Number(totalRow?.value ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * pageSize;

  const items = await db
    .select()
    .from(student)
    .where(where)
    .orderBy(desc(student.id))
    .limit(pageSize)
    .offset(offset);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getStudentById(id: number) {
  const [row] = await db.select().from(student).where(eq(student.id, id)).limit(1);
  return row ?? null;
}

export async function createStudent(data: NewStudent) {
  const [row] = await db.insert(student).values(data).returning();
  return row;
}

export async function updateStudent(
  id: number,
  data: Partial<Omit<NewStudent, "id">>
) {
  const [row] = await db
    .update(student)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(student.id, id))
    .returning();
  return row ?? null;
}

export async function deleteStudent(id: number) {
  const [row] = await db.delete(student).where(eq(student.id, id)).returning();
  return row ?? null;
}

export async function studentNoExists(studentNo: string, excludeId?: number) {
  const rows = await db
    .select({ id: student.id })
    .from(student)
    .where(eq(student.studentNo, studentNo))
    .limit(5);

  if (excludeId) {
    return rows.some((r) => r.id !== excludeId);
  }

  return rows.length > 0;
}
