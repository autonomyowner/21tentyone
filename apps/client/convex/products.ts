import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// List all products (public - no auth required)
export const list = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products;

    if (args.includeInactive) {
      products = await ctx.db.query("products").collect();
    } else {
      products = await ctx.db
        .query("products")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect();
    }

    return products.map((product) => ({
      ...product,
      priceFormatted: `€${(product.price / 100).toFixed(2)}`,
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString(),
    }));
  },
});

// List products with sales statistics (admin only)
export const listWithStats = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const products = await ctx.db.query("products").collect();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const purchases = await ctx.db
          .query("purchases")
          .withIndex("by_productId", (q) => q.eq("productId", product._id))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        const salesCount = purchases.length;
        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        return {
          ...product,
          priceFormatted: `€${(product.price / 100).toFixed(2)}`,
          salesCount,
          totalRevenue,
          totalRevenueFormatted: `€${(totalRevenue / 100).toFixed(2)}`,
          createdAt: new Date(product.createdAt).toISOString(),
          updatedAt: new Date(product.updatedAt).toISOString(),
        };
      })
    );

    return productsWithStats;
  },
});

// Get a product by slug (public)
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!product) {
      return null;
    }

    return {
      ...product,
      priceFormatted: `€${(product.price / 100).toFixed(2)}`,
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString(),
    };
  },
});

// Get a product by ID (admin only)
export const getById = query({
  args: {
    token: v.string(),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const product = await ctx.db.get(args.id);
    if (!product) {
      return null;
    }

    return {
      ...product,
      priceFormatted: `€${(product.price / 100).toFixed(2)}`,
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString(),
    };
  },
});

// Create a new product (admin only)
export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    slug: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    // Check if slug already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("A product with this slug already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("products", {
      name: args.name,
      slug: args.slug,
      price: args.price,
      description: args.description,
      fileUrl: args.fileUrl,
      active: args.active ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a product (admin only)
export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const { token, id, ...updates } = args;

    // If slug is being updated, check for uniqueness
    if (updates.slug) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .unique();

      if (existing && existing._id !== id) {
        throw new Error("A product with this slug already exists");
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

// Toggle product active status (admin only)
export const toggleActive = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Product not found");
    }

    await ctx.db.patch(args.id, {
      active: !product.active,
      updatedAt: Date.now(),
    });

    return { success: true, active: !product.active };
  },
});

// Delete a product (admin only)
export const remove = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    // Check if there are any purchases for this product
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_productId", (q) => q.eq("productId", args.id))
      .first();

    if (purchases) {
      throw new Error(
        "Cannot delete product with existing purchases. Deactivate it instead."
      );
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
