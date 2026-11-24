import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const sessionSecret = process.env.SESSION_SECRET || "development-only-change-this-session-secret";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  // Compatibilidade com usuários criados pelo seed antigo (SHA-256).
  if (!hashed.includes(":")) {
    const legacyHash = createHash("sha256").update(password).digest("hex");
    if (legacyHash.length !== hashed.length) return false;
    return timingSafeEqual(Buffer.from(legacyHash, "utf8"), Buffer.from(hashed, "utf8"));
  }

  const [salt, storedKey] = hashed.split(":");

  if (!salt || !storedKey) {
    return false;
  }

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(storedKey, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId }), "utf8").toString("base64url");
  const signature = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof decoded.userId === "string" ? { userId: decoded.userId } : null;
  } catch {
    return null;
  }
}
