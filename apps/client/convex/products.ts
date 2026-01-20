import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";

// List all products (public)
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

// Create a new product
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
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

// Update a product
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

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

// Toggle product active status
export const toggleActive = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
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

// Delete a product
export const remove = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
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
