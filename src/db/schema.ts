import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** 管理员表：存放登录用户名和密码 */
export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** 学生基本信息表 */
export const student = pgTable("student", {
  id: serial("id").primaryKey(),
  /** 学号 */
  studentNo: varchar("student_no", { length: 32 }).notNull().unique(),
  /** 姓名 */
  name: varchar("name", { length: 64 }).notNull(),
  /** 性别 */
  gender: varchar("gender", { length: 8 }).notNull(),
  /** 班级 */
  className: varchar("class_name", { length: 64 }).notNull(),
  /** 电话 */
  phone: varchar("phone", { length: 32 }).notNull().default(""),
  /** 备注 */
  remark: text("remark").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Admin = typeof admin.$inferSelect;
export type NewAdmin = typeof admin.$inferInsert;
export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;
