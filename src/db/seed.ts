/**
 * 初始化 usermanagement 数据库中的 admin / student 表，并写入默认管理员账号。
 *
 * 使用方式：
 *   npx tsx src/db/seed.ts
 *
 * 默认管理员：
 *   用户名: admin
 *   密码: admin123
 */
import "dotenv/config";
import { config } from "dotenv";
import postgres from "postgres";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("缺少 DATABASE_URL，请先配置 .env.local");
  process.exit(1);
}

async function main() {
  const sql = postgres(DATABASE_URL!, { max: 1 });

  console.log("正在创建数据表...");

  await sql`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS student (
      id SERIAL PRIMARY KEY,
      student_no VARCHAR(32) NOT NULL UNIQUE,
      name VARCHAR(64) NOT NULL,
      gender VARCHAR(8) NOT NULL,
      class_name VARCHAR(64) NOT NULL,
      phone VARCHAR(32) NOT NULL DEFAULT '',
      remark TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const hashed = await bcrypt.hash("admin123", 10);

  await sql`
    INSERT INTO admin (username, password)
    VALUES ('admin', ${hashed})
    ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password
  `;

  const existingStudents = await sql`SELECT COUNT(*)::int AS count FROM student`;
  if (existingStudents[0].count === 0) {
    await sql`
      INSERT INTO student (student_no, name, gender, class_name, phone, remark)
      VALUES
        ('2024001', '张三', '男', '计算机2401', '13800000001', '班长'),
        ('2024002', '李四', '女', '计算机2401', '13800000002', ''),
        ('2024003', '王五', '男', '软件2402', '13800000003', '学习委员'),
        ('2024004', '赵六', '女', '软件2402', '13800000004', ''),
        ('2024005', '钱七', '男', '网络2401', '13800000005', '请假中')
    `;
    console.log("已写入示例学生数据 5 条");
  } else {
    console.log("student 表已有数据，跳过示例数据写入");
  }

  console.log("初始化完成。默认管理员：admin / admin123");
  await sql.end();
}

main().catch((err) => {
  console.error("初始化失败:", err);
  process.exit(1);
});
