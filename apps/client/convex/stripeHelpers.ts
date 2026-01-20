import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// Internal query to get product by slug (needed for action)
export const getProductBySlug = internalQuery({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});
