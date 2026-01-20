"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateSessionToken } from "./lib/auth";
import bcrypt from "bcryptjs";

// Login action
export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ token: string; admin: { id: string; email: string; role: string } } | { error: string }> => {
    // Get admin by email
    const admin = await ctx.runQuery(internal.adminUsers.getAdminByEmail, {
      email: args.email,
    });

    if (!admin) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await bcrypt.compare(args.password, admin.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    // Create session
    const token = generateSessionToken();
    await ctx.runMutation(internal.adminUsers.createSession, {
      adminId: admin._id,
      token,
    });

    // Update last login
    await ctx.runMutation(internal.adminUsers.updateLastLogin, {
      adminId: admin._id,
    });

    return {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    };
  },
});

// Create initial super admin (only works if no admins exist)
export const createInitialAdmin = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // Check if any admin exists
    const hasAdmin = await ctx.runQuery(internal.adminUsers.hasAnyAdminInternal);
    if (hasAdmin) {
      return { success: false, error: "Admin already exists" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(args.password, 12);

    // Create admin
    await ctx.runMutation(internal.adminUsers.createAdminInternal, {
      email: args.email,
      passwordHash,
      role: "super_admin",
    });

    return { success: true };
  },
});

// Create new admin (super_admin only)
export const createAdmin = action({
  args: {
    token: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // Verify super admin
    const currentAdmin = await ctx.runQuery(internal.adminUsers.getAdminByToken, {
      token: args.token,
    });

    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      return { success: false, error: "Unauthorized" };
    }

    // Check if email already exists
    const emailExists = await ctx.runQuery(internal.adminUsers.checkEmailExists, {
      email: args.email,
    });

    if (emailExists) {
      return { success: false, error: "Email already exists" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(args.password, 12);

    // Create admin
    await ctx.runMutation(internal.adminUsers.createAdminInternal, {
      email: args.email,
      passwordHash,
      role: args.role,
    });

    return { success: true };
  },
});

// Change password
export const changePassword = action({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // Get current admin
    const admin = await ctx.runQuery(internal.adminUsers.getAdminByToken, {
      token: args.token,
    });

    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify current password
    const isValid = await bcrypt.compare(args.currentPassword, admin.passwordHash);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(args.newPassword, 12);

    // Update password
    await ctx.runMutation(internal.adminUsers.updatePassword, {
      adminId: admin._id,
      passwordHash,
    });

    return { success: true };
  },
});
