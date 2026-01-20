import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// List customers with pagination and search (admin only)
export const list = query({
  args: {
    token: v.string(),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const page = args.page ?? 1;
    const limit = args.limit ?? 20;
    const offset = (page - 1) * limit;

    let customers = await ctx.db.query("customers").order("desc").collect();

    // Apply search filter
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      customers = customers.filter(
        (c) =>
          c.email.toLowerCase().includes(searchLower) ||
          c.name?.toLowerCase().includes(searchLower)
      );
    }

    const total = customers.length;
    const paginatedCustomers = customers.slice(offset, offset + limit);

    // Enrich with purchase stats
    const enrichedCustomers = await Promise.all(
      paginatedCustomers.map(async (customer) => {
        const purchases = await ctx.db
          .query("purchases")
          .withIndex("by_customerId", (q) => q.eq("customerId", customer._id))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
        const purchaseCount = purchases.length;
        const lastPurchase = purchases[0]?.createdAt;

        return {
          ...customer,
          purchaseCount,
          totalSpent,
          totalSpentFormatted: `€${(totalSpent / 100).toFixed(2)}`,
          lastPurchase: lastPurchase
            ? new Date(lastPurchase).toISOString()
            : null,
          createdAt: new Date(customer.createdAt).toISOString(),
          updatedAt: new Date(customer.updatedAt).toISOString(),
        };
      })
    );

    return {
      customers: enrichedCustomers,
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

// Get a customer by ID with purchase history (admin only)
export const getById = query({
  args: {
    token: v.string(),
    id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const customer = await ctx.db.get(args.id);
    if (!customer) {
      return null;
    }

    // Get all purchases for this customer
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_customerId", (q) => q.eq("customerId", customer._id))
      .order("desc")
      .collect();

    // Enrich purchases with product info
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return {
          ...purchase,
          productName: product?.name ?? "Unknown Product",
          amountFormatted: `€${(purchase.amount / 100).toFixed(2)}`,
          createdAt: new Date(purchase.createdAt).toISOString(),
        };
      })
    );

    const totalSpent = purchases
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      ...customer,
      purchases: enrichedPurchases,
      totalSpent,
      totalSpentFormatted: `€${(totalSpent / 100).toFixed(2)}`,
      purchaseCount: purchases.filter((p) => p.status === "completed").length,
      createdAt: new Date(customer.createdAt).toISOString(),
      updatedAt: new Date(customer.updatedAt).toISOString(),
    };
  },
});

// Get a customer by email (admin only)
export const getByEmail = query({
  args: {
    token: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!customer) {
      return null;
    }

    return {
      ...customer,
      createdAt: new Date(customer.createdAt).toISOString(),
      updatedAt: new Date(customer.updatedAt).toISOString(),
    };
  },
});

// Create a new customer (admin only)
export const create = mutation({
  args: {
    token: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    // Check if email already exists
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      throw new Error("A customer with this email already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("customers", {
      email: args.email,
      name: args.name,
      stripeCustomerId: args.stripeCustomerId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a customer (admin only)
export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("customers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const { token, id, ...updates } = args;

    // If email is being updated, check for uniqueness
    if (updates.email) {
      const existing = await ctx.db
        .query("customers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .unique();

      if (existing && existing._id !== id) {
        throw new Error("A customer with this email already exists");
      }
    }

    // Filter out undefined values
    const patchData: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patchData[key] = value;
      }
    }

    await ctx.db.patch(id, patchData);
    return { success: true };
  },
});

// Internal: Create or get customer by email (used by Stripe webhook)
export const getOrCreateByEmail = internalMutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let customer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (customer) {
      // Update with new info if provided
      const updates: Record<string, unknown> = { updatedAt: Date.now() };
      if (args.name && !customer.name) {
        updates.name = args.name;
      }
      if (args.stripeCustomerId && !customer.stripeCustomerId) {
        updates.stripeCustomerId = args.stripeCustomerId;
      }

      if (Object.keys(updates).length > 1) {
        await ctx.db.patch(customer._id, updates);
      }

      return customer._id;
    }

    // Create new customer
    const now = Date.now();
    return await ctx.db.insert("customers", {
      email: args.email,
      name: args.name,
      stripeCustomerId: args.stripeCustomerId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Internal: Get customer by Stripe customer ID
export const getByStripeCustomerId = internalMutation({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();

    return customer;
  },
});
