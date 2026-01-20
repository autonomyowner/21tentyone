import { QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export type AdminRole = "admin" | "super_admin";

// Session duration: 7 days
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Validate a session token and return the admin user if valid.
 */
export async function validateSession(
  ctx: QueryCtx | MutationCtx,
  token: string | null | undefined
): Promise<Doc<"adminUsers"> | null> {
  if (!token) {
    return null;
  }

  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    return null;
  }

  const adminUser = await ctx.db.get(session.adminId);
  return adminUser;
}

/**
 * Require a valid admin session.
 * Throws an error if the session is invalid or expired.
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string | null | undefined
): Promise<Doc<"adminUsers">> {
  const adminUser = await validateSession(ctx, token);
  if (!adminUser) {
    throw new Error("Unauthorized: Invalid or expired session");
  }
  return adminUser;
}

/**
 * Require the current user to be a super admin.
 * Throws an error if the user is not a super admin.
 */
export async function requireSuperAdmin(
  ctx: QueryCtx | MutationCtx,
  token: string | null | undefined
): Promise<Doc<"adminUsers">> {
  const adminUser = await requireAdmin(ctx, token);
  if (adminUser.role !== "super_admin") {
    throw new Error("Unauthorized: Super admin access required");
  }
  return adminUser;
}

/**
 * Check if a session is valid.
 */
export async function isValidSession(
  ctx: QueryCtx | MutationCtx,
  token: string | null | undefined
): Promise<boolean> {
  const adminUser = await validateSession(ctx, token);
  return adminUser !== null;
}

/**
 * Generate a random session token.
 */
export function generateSessionToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
