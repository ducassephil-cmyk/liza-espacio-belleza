import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";

const COOKIE_NAME = "liza_dash_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

export type DashboardRole = "admin" | "worker";

export interface DashboardUser {
  id: string;
  displayName: string;
  role: DashboardRole;
}

const USERS: Array<DashboardUser & { passwordEnvVar: string }> = [
  { id: "philippe", displayName: "Philippe", role: "admin", passwordEnvVar: "DASHBOARD_PASSWORD_PHILIPPE" },
  { id: "socio", displayName: "Socio", role: "admin", passwordEnvVar: "DASHBOARD_PASSWORD_SOCIO" },
  { id: "nersa", displayName: "Nersa", role: "worker", passwordEnvVar: "DASHBOARD_PASSWORD_NERSA" },
  { id: "jennifer", displayName: "Jennifer", role: "worker", passwordEnvVar: "DASHBOARD_PASSWORD_JENNIFER" },
];

function getSecret(): string {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) throw new Error("DASHBOARD_SESSION_SECRET no está configurada");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function safeCompare(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

export function findUserByPassword(password: string): DashboardUser | null {
  for (const u of USERS) {
    const expected = process.env[u.passwordEnvVar];
    if (expected && safeCompare(password, expected)) {
      return { id: u.id, displayName: u.displayName, role: u.role };
    }
  }
  return null;
}

function findUserById(id: string): DashboardUser | null {
  const u = USERS.find((u) => u.id === id);
  return u ? { id: u.id, displayName: u.displayName, role: u.role } : null;
}

export function createSessionToken(userId: string): string {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const payload = `${userId}:${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): DashboardUser | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeCompare(sig, sign(payload))) return null;
  const [id, expiresStr] = payload.split(":");
  const expires = Number(expiresStr);
  if (!id || !Number.isFinite(expires) || expires <= Date.now()) return null;
  return findUserById(id);
}

export function readCookie(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const prefix = `${COOKIE_NAME}=`;
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(prefix));
  return match?.slice(prefix.length);
}

export function getSessionUser(req: VercelRequest): DashboardUser | null {
  return verifySessionToken(readCookie(req.headers.cookie));
}

export function buildSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export function buildClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
