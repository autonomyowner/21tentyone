import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// List email logs with pagination (admin only)
export const list = query({
  args: {
    token: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("sent"),
        v.literal("delivered"),
        v.literal("failed"),
        v.literal("bounced")
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const page = args.page ?? 1;
    const limit = args.limit ?? 20;
    const offset = (page - 1) * limit;

    let emailsQuery = ctx.db.query("emailLogs");

    if (args.status) {
      emailsQuery = emailsQuery.withIndex("by_status", (q) =>
        q.eq("status", args.status!)
      );
    } else {
      emailsQuery = emailsQuery.withIndex("by_createdAt");
    }

    const allEmails = await emailsQuery.order("desc").collect();

    const total = allEmails.length;
    const paginatedEmails = allEmails.slice(offset, offset + limit);

    return {
      emails: paginatedEmails.map((email) => ({
        ...email,
        createdAt: new Date(email.createdAt).toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total,
      },
    };
  },
});

// Get email log statistics (admin only)
export const getStats = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const allEmails = await ctx.db.query("emailLogs").collect();

    const stats = {
      total: allEmails.length,
      sent: 0,
      delivered: 0,
      failed: 0,
      bounced: 0,
      pending: 0,
    };

    for (const email of allEmails) {
      switch (email.status) {
        case "sent":
          stats.sent++;
          break;
        case "delivered":
          stats.delivered++;
          break;
        case "failed":
          stats.failed++;
          break;
        case "bounced":
          stats.bounced++;
          break;
        case "pending":
          stats.pending++;
          break;
      }
    }

    const deliveryRate =
      stats.total > 0
        ? (((stats.delivered + stats.sent) / stats.total) * 100).toFixed(1)
        : "0";
    const failureRate =
      stats.total > 0
        ? (((stats.failed + stats.bounced) / stats.total) * 100).toFixed(1)
        : "0";

    return {
      ...stats,
      deliveryRate: parseFloat(deliveryRate),
      failureRate: parseFloat(failureRate),
    };
  },
});

// Get email log by ID (admin only)
export const getById = query({
  args: {
    token: v.string(),
    id: v.id("emailLogs"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const emailLog = await ctx.db.get(args.id);
    if (!emailLog) {
      return null;
    }

    // If there's a purchaseId, get purchase details
    let purchase = null;
    if (emailLog.purchaseId) {
      const purchaseDoc = await ctx.db.get(emailLog.purchaseId);
      if (purchaseDoc) {
        const customer = await ctx.db.get(purchaseDoc.customerId);
        const product = await ctx.db.get(purchaseDoc.productId);
        purchase = {
          id: purchaseDoc._id,
          customerEmail: customer?.email ?? "Unknown",
          productName: product?.name ?? "Unknown Product",
          amount: purchaseDoc.amount,
          amountFormatted: `€${(purchaseDoc.amount / 100).toFixed(2)}`,
        };
      }
    }

    return {
      ...emailLog,
      createdAt: new Date(emailLog.createdAt).toISOString(),
      purchase,
    };
  },
});

// Internal: Create email log entry
export const create = internalMutation({
  args: {
    to: v.string(),
    subject: v.string(),
    template: v.string(),
    resendId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("bounced")
    ),
    errorMessage: v.optional(v.string()),
    purchaseId: v.optional(v.id("purchases")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailLogs", {
      to: args.to,
      subject: args.subject,
      template: args.template,
      resendId: args.resendId,
      status: args.status,
      errorMessage: args.errorMessage,
      purchaseId: args.purchaseId,
      createdAt: Date.now(),
    });
  },
});

// Internal: Update email log status (e.g., from webhook)
export const updateStatus = internalMutation({
  args: {
    resendId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("bounced")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find by resendId - need to scan since we don't have an index
    const allLogs = await ctx.db.query("emailLogs").collect();
    const emailLog = allLogs.find((log) => log.resendId === args.resendId);

    if (emailLog) {
      await ctx.db.patch(emailLog._id, {
        status: args.status,
        errorMessage: args.errorMessage,
      });
      return emailLog._id;
    }

    return null;
  },
});
