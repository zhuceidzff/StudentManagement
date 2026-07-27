# 学生信息管理系统

基于 **Next.js 15（App Router）**、**Shadcn UI + Tailwind CSS**、**Supabase（PostgreSQL）+ Drizzle ORM** 构建的学生信息管理系统。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 15（App Router，适配 PC + 移动端） |
| UI | Shadcn UI 风格组件 + Tailwind CSS 4 |
| 数据库 | Supabase / PostgreSQL（数据库名：`usermanagement`） |
| ORM | Drizzle ORM |
| 认证 | JWT（`jose`）+ Cookie 会话 + bcryptjs 密码哈希 |
| 校验 | Zod |

## 已实现功能

### 1. 登录功能

- 网站首页 `/` 显示登录页面
- 用户名和密码保存在数据库 `usermanagement` 的 `admin` 表中
- 登录成功后跳转到欢迎页面 `/welcome`
- 支持退出登录
- 未登录访问受保护页面会自动跳回登录页

### 2. 学生基本信息列表

- 登录成功页展示学生基本信息列表
- 字段：学号、姓名、性别、班级、电话、备注
- 数据来源：`usermanagement.student` 表

### 3. 模糊搜索

- 列表上方提供搜索框
- 支持在 **学号、姓名、班级** 字段中进行模糊查询

### 4. 添加学生

- 列表上方提供「添加学生」入口
- 打开新页面填写学生信息
- 添加成功后返回列表页，并显示「添加学生信息成功」
- 自动刷新表格内容

### 5. 删除学生

- 表格「操作」列提供「删除」按钮
- 确认后删除该行记录并刷新表格

### 6. 修改学生

- 「删除」按钮后提供「修改」按钮
- 打开编辑页面修改学生信息
- 保存后返回列表页并显示最新结果

### 7. 分页导航

- 表格下方提供分页导航栏
- 可设置每页显示条数（**1–20**）
- 提供：第一页、最后一页、上一页、下一页

## 数据库设计

### admin（管理员表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| username | varchar(64) | 用户名（唯一） |
| password | varchar(255) | bcrypt 哈希密码 |
| created_at | timestamptz | 创建时间 |

### student（学生表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | serial | 主键 |
| student_no | varchar(32) | 学号（唯一） |
| name | varchar(64) | 姓名 |
| gender | varchar(8) | 性别 |
| class_name | varchar(64) | 班级 |
| phone | varchar(32) | 电话 |
| remark | text | 备注 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写真实连接信息：

```bash
cp .env.example .env.local
```

环境变量说明：

```env
# PostgreSQL / Supabase 连接字符串（数据库名：usermanagement）
DATABASE_URL=postgresql://postgres:your-password@host:5432/usermanagement

# JWT 签名密钥（请使用足够长的随机字符串）
JWT_SECRET=your-long-random-secret

# 可选
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 请先在 Supabase / PostgreSQL 中创建名为 `usermanagement` 的数据库。

本地开发也可使用 Docker 快速启动 PostgreSQL：

```bash
docker run -d --name student-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=usermanagement \
  -p 5432:5432 \
  postgres:16-alpine
```

对应 `.env.local`：

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/usermanagement
JWT_SECRET=student-management-dev-secret-change-in-production-2026
```

### 3. 初始化数据表与默认管理员

```bash
npm run db:seed
```

默认管理员账号：

- 用户名：`admin`
- 密码：`admin123`

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 页面与接口

| 路径 | 说明 |
|------|------|
| `/` | 登录页 |
| `/welcome` | 欢迎页 + 学生列表 / 搜索 / 分页 |
| `/students/new` | 添加学生 |
| `/students/[id]/edit` | 修改学生 |
| `POST /api/auth/login` | 登录 |
| `POST /api/auth/logout` | 退出登录 |
| `GET /api/students` | 学生列表（支持 q / page / pageSize） |
| `POST /api/students` | 添加学生 |
| `GET /api/students/[id]` | 获取单个学生 |
| `PUT /api/students/[id]` | 修改学生 |
| `DELETE /api/students/[id]` | 删除学生 |

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run lint` | ESLint 检查 |
| `npm run db:seed` | 初始化表结构与默认数据 |
| `npm run db:generate` | 生成 Drizzle 迁移 |
| `npm run db:push` | 将 schema 推送到数据库 |

## 目录结构（核心）

```text
src/
  app/
    page.tsx                      # 首页登录
    welcome/page.tsx              # 欢迎页 + 学生列表
    students/new/page.tsx         # 添加学生
    students/[id]/edit/page.tsx   # 修改学生
    api/auth/login/               # 登录 API
    api/auth/logout/              # 退出登录 API
    api/students/                 # 学生 CRUD API
  components/
    login-form.tsx
    student-form.tsx
    student-table.tsx
    student-search-bar.tsx
    pagination-bar.tsx
    ui/                           # 基础 UI 组件
  db/
    schema.ts                     # Drizzle 表定义
    index.ts                      # 数据库连接
    seed.ts                       # 初始化脚本
  lib/
    auth.ts                       # 会话与密码工具
    students.ts                   # 学生数据访问
    validators.ts                 # 表单校验
    utils.ts
  middleware.ts                   # 路由鉴权
```

## Git 分支策略

每个功能独立分支开发，确认后合并到 `main` 并推送远程：

| 分支 | 功能 |
|------|------|
| `feature/login` | 登录功能 |
| `feature/student-list` | 学生列表、搜索、分页 |
| `feature/student-crud` | 学生增删改（可与列表分支一并交付） |

## 开发日志

### 2026-07-27

- 初始化 Next.js 15 项目
- 完成登录功能：首页登录、admin 表校验、JWT Cookie 会话、欢迎页跳转
- 编写数据库 schema（admin / student）与 seed 脚本
- 完成学生列表展示、模糊搜索、分页导航（每页 1–20 条）
- 完成学生添加 / 删除 / 修改，并在列表页展示操作结果提示
- 编写并持续更新中文 README

---

后续功能迭代时，请同步更新本文件的「已实现功能」与「开发日志」章节。
