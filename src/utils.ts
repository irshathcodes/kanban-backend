import { promisify } from "node:util";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { lucia } from "./lib/auth.js";
import { setCookie } from "hono/cookie";
import type { Context } from "hono";

const scryptPromise = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptPromise(password, salt, 64);
  return `${salt}:${(key as Buffer).toString("hex")}` as const;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const [salt, key] = hashedPassword.split(":");
  const keyBuffer = Buffer.from(key!, "hex");
  const derivedKey = await scryptPromise(password, salt!, 64);
  return timingSafeEqual(keyBuffer, derivedKey as Buffer);
}

export async function attachAuthCookie(userId: string, c: Context) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  setCookie(
    c,
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
