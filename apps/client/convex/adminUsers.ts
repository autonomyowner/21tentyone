import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import {
  validateSession,
  requireAdmin,
  requireSuperAdmin,
  SESSION_DURATION_MS,
} from "./lib/auth";

// ============ Queries ============

// Check if session is valid
export const validateSessionQuery = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const admin = await validateSession(ctx, args.token);
    if (!admin) return null;

    return {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };
  },
});

// Get current admin profile
export const me = query({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const admin = await validateSession(ctx, args.token);
    if (!admin) return null;

    return {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      createdAt: new Date(admin.createdAt).toISOString(),
      lastLoginAt: admin.lastLoginAt
        ? new Date(admin.lastLoginAt).toISOString()
        : null,
    };
  },
});

// List all admin users (super_admin only)
export const list = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx, args.token);

    const adminUsers = await ctx.db.query("adminUsers").collect();

    return adminUsers.map((user) => ({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: new Date(user.createdAt).toISOString(),
      lastLoginAt: user.lastLoginAt
        ? new Date(user.lastLoginAt).toISOString()
        : null,
    }));
  },
});

// Check if any admin exists (for initial setup)
export const hasAnyAdmin = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db.query("adminUsers").first();
    return admin !== null;
  },
});

// ============ Mutations ============

// Logout - invalidate session
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Delete admin (super_admin only)
export const remove = mutation({
  args: {
    token: v.string(),
    adminId: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    const currentAdmin = await requireSuperAdmin(ctx, args.token);

    // Prevent self-deletion
    if (args.adminId === currentAdmin._id) {
      throw new Error("Cannot delete yourself");
    }

    // Delete all sessions for this admin
    const sessions = await ctx.db
      .query("adminSessions")
      .withIndex("by_adminId", (q) => q.eq("adminId", args.adminId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete admin
    await ctx.db.delete(args.adminId);

    return { success: true };
  },
});

// Update admin role (super_admin only)
export const updateRole = mutation({
  args: {
    token: v.string(),
    adminId: v.id("adminUsers"),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    await requireSuperAdmin(ctx, args.token);

    await ctx.db.patch(args.adminId, {
      role: args.role,
    });

    return { success: true };
  },
});

// ============ Internal Functions ============

export const getAdminByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getAdminByToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    return await ctx.db.get(session.adminId);
  },
});

export const hasAnyAdminInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db.query("adminUsers").first();
    return admin !== null;
  },
});

export const createSession = internalMutation({
  args: {
    adminId: v.id("adminUsers"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("adminSessions", {
      adminId: args.adminId,
      token: args.token,
      expiresAt: now + SESSION_DURATION_MS,
      createdAt: now,
    });
  },
});

export const updateLastLogin = internalMutation({
  args: {
    adminId: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.adminId, {
      lastLoginAt: Date.now(),
    });
  },
});

export const createAdminInternal = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adminUsers", {
      email: args.email,
      passwordHash: args.passwordHash,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});

export const updatePassword = internalMutation({
  args: {
    adminId: v.id("adminUsers"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.adminId, {
      passwordHash: args.passwordHash,
    });
  },
});

export const checkEmailExists = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    return admin !== null;
  },
});
