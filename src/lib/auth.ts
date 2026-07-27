import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "sm_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("缺少环境变量 JWT_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  adminId: number;
  username: string;
};

/** 创建登录会话 Cookie */
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({
    adminId: payload.adminId,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** 读取并校验当前会话 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const adminId = Number(payload.adminId);
    const username = String(payload.username ?? "");
    if (!adminId || !username) return null;
    return { adminId, username };
  } catch {
    return null;
  }
}

/** 销毁会话 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** 密码哈希 */
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

/** 校验密码 */
export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export { COOKIE_NAME };
