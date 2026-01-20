import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// List purchases with pagination (admin only)
export const list = query({
  args: {
    token: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("refunded")
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const page = args.page ?? 1;
    const limit = args.limit ?? 20;
    const offset = (page - 1) * limit;

    let purchasesQuery = ctx.db.query("purchases");

    if (args.status) {
      purchasesQuery = purchasesQuery.withIndex("by_status", (q) =>
        q.eq("status", args.status!)
      );
    } else {
      purchasesQuery = purchasesQuery.withIndex("by_createdAt");
    }

    const allPurchases = await purchasesQuery.order("desc").collect();

    const total = allPurchases.length;
    const paginatedPurchases = allPurchases.slice(offset, offset + limit);

    // Enrich with customer and product info
    const enrichedPurchases = await Promise.all(
      paginatedPurchases.map(async (purchase) => {
        const customer = await ctx.db.get(purchase.customerId);
        const product = await ctx.db.get(purchase.productId);

        return {
          ...purchase,
          customerEmail: customer?.email ?? "Unknown",
          customerName: customer?.name ?? null,
          productName: product?.name ?? "Unknown Product",
          productSlug: product?.slug ?? null,
          amountFormatted: `€${(purchase.amount / 100).toFixed(2)}`,
          createdAt: new Date(purchase.createdAt).toISOString(),
        };
      })
    );

    return {
      purchases: enrichedPurchases,
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

// Get a purchase by ID (admin only)
export const getById = query({
  args: {
    token: v.string(),
    id: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const purchase = await ctx.db.get(args.id);
    if (!purchase) {
      return null;
    }

    const customer = await ctx.db.get(purchase.customerId);
    const product = await ctx.db.get(purchase.productId);

    // Get email logs for this purchase
    const emailLogs = await ctx.db
      .query("emailLogs")
      .withIndex("by_purchaseId", (q) => q.eq("purchaseId", purchase._id))
      .collect();

    return {
      ...purchase,
      customerEmail: customer?.email ?? "Unknown",
      customerName: customer?.name ?? null,
      productName: product?.name ?? "Unknown Product",
      productSlug: product?.slug ?? null,
      amountFormatted: `€${(purchase.amount / 100).toFixed(2)}`,
      createdAt: new Date(purchase.createdAt).toISOString(),
      emailLogs: emailLogs.map((log) => ({
        ...log,
        createdAt: new Date(log.createdAt).toISOString(),
      })),
    };
  },
});

// Get recent purchases (admin only) - for real-time dashboard
export const getRecent = query({
  args: {
    token: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const limit = args.limit ?? 10;

    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);

    // Enrich with customer and product info
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase) => {
        const customer = await ctx.db.get(purchase.customerId);
        const product = await ctx.db.get(purchase.productId);

        return {
          ...purchase,
          customerEmail: customer?.email ?? "Unknown",
          customerName: customer?.name ?? null,
          productName: product?.name ?? "Unknown Product",
          amountFormatted: `€${(purchase.amount / 100).toFixed(2)}`,
          createdAt: new Date(purchase.createdAt).toISOString(),
        };
      })
    );

    return enrichedPurchases;
  },
});

// Update purchase status (admin only)
export const updateStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("purchases"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    await ctx.db.patch(args.id, {
      status: args.status,
    });

    return { success: true };
  },
});

// Mark email as sent (admin only)
export const markEmailSent = mutation({
  args: {
    token: v.string(),
    id: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    await ctx.db.patch(args.id, {
      emailSent: true,
    });

    return { success: true };
  },
});

// Internal: Create purchase from webhook
export const createFromWebhook = internalMutation({
  args: {
    customerId: v.id("customers"),
    productId: v.id("products"),
    amount: v.number(),
    currency: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    // Check for duplicate by stripePaymentIntentId
    if (args.stripePaymentIntentId) {
      const existing = await ctx.db
        .query("purchases")
        .withIndex("by_stripePaymentIntentId", (q) =>
          q.eq("stripePaymentIntentId", args.stripePaymentIntentId!)
        )
        .unique();

      if (existing) {
        return existing._id;
      }
    }

    return await ctx.db.insert("purchases", {
      customerId: args.customerId,
      productId: args.productId,
      amount: args.amount,
      currency: args.currency,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      status: args.status,
      emailSent: false,
      createdAt: Date.now(),
    });
  },
});

// Internal: Update purchase status from webhook
export const updateStatusFromWebhook = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_stripePaymentIntentId", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
      )
      .unique();

    if (purchase) {
      await ctx.db.patch(purchase._id, {
        status: args.status,
      });
      return purchase._id;
    }

    return null;
  },
});

// Internal: Get purchase by checkout session ID
export const getByCheckoutSession = internalMutation({
  args: {
    stripeCheckoutSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_stripeCheckoutSessionId", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId)
      )
      .unique();

    return purchase;
  },
});

// Internal: Mark email as sent (used by email action)
export const markEmailSentInternal = internalMutation({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.purchaseId, {
      emailSent: true,
    });
  },
});
