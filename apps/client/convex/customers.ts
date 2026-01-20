import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// List customers with pagination and search
export const list = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
