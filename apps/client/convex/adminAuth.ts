"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

// Simple login - checks against environment variables
export const login = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (_, args): Promise<{ success: boolean; error?: string }> => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return { success: false, error: "Admin credentials not configured" };
    }

    if (args.username === adminUsername && args.password === adminPassword) {
      return { success: true };
    }

    return { success: false, error: "Invalid username or password" };
  },
});
