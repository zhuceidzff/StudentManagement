import { z } from "zod";

export const studentFormSchema = z.object({
  studentNo: z
    .string()
    .trim()
    .min(1, "请输入学号")
    .max(32, "学号不能超过 32 个字符"),
  name: z.string().trim().min(1, "请输入姓名").max(64, "姓名不能超过 64 个字符"),
  gender: z.enum(["男", "女"], { message: "请选择性别" }),
  className: z
    .string()
    .trim()
    .min(1, "请输入班级")
    .max(64, "班级不能超过 64 个字符"),
  phone: z.string().trim().max(32, "电话不能超过 32 个字符").default(""),
  remark: z.string().trim().max(500, "备注不能超过 500 个字符").default(""),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
