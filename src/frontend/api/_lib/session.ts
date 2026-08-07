import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";

const COOKIE_NAME = "liza_dash_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

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

export function createSessionToken(): string {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeCompare(sig, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export function readCookie(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const prefix = `${COOKIE_NAME}=`;
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(prefix));
  return match?.slice(prefix.length);
}

export function isAuthenticated(req: VercelRequest): boolean {
  return verifySessionToken(readCookie(req.headers.cookie));
}

export function buildSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`;
}

export function buildClearCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
