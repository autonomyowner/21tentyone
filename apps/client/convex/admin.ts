import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

// Get dashboard metrics (admin only)
export const getMetrics = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Get all customers
    const allCustomers = await ctx.db.query("customers").collect();
    const recentCustomers = allCustomers.filter(
      (c) => c.createdAt >= thirtyDaysAgo
    );
    const previousCustomers = allCustomers.filter(
      (c) => c.createdAt >= sixtyDaysAgo && c.createdAt < thirtyDaysAgo
    );

    // Get all completed purchases
    const allPurchases = await ctx.db
      .query("purchases")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const recentPurchases = allPurchases.filter(
      (p) => p.createdAt >= thirtyDaysAgo
    );
    const previousPurchases = allPurchases.filter(
      (p) => p.createdAt >= sixtyDaysAgo && p.createdAt < thirtyDaysAgo
    );

    // Calculate metrics
    const totalCustomers = allCustomers.length;
    const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amount, 0);
    const recentRevenue = recentPurchases.reduce((sum, p) => sum + p.amount, 0);
    const previousRevenue = previousPurchases.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // Growth calculations
    const customerGrowth =
      previousCustomers.length > 0
        ? ((recentCustomers.length - previousCustomers.length) /
            previousCustomers.length) *
          100
        : 100;

    const revenueGrowth =
      previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 100;

    const purchaseGrowth =
      previousPurchases.length > 0
        ? ((recentPurchases.length - previousPurchases.length) /
            previousPurchases.length) *
          100
        : 100;

    // Get products count
    const activeProducts = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();

    return {
      totalCustomers,
      totalRevenue,
      totalRevenueFormatted: `€${(totalRevenue / 100).toFixed(2)}`,
      totalPurchases: allPurchases.length,
      recentPurchases: recentPurchases.length,
      activeProducts: activeProducts.length,
      customerGrowth: parseFloat(customerGrowth.toFixed(1)),
      revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
      purchaseGrowth: parseFloat(purchaseGrowth.toFixed(1)),
      averageOrderValue:
        allPurchases.length > 0 ? totalRevenue / allPurchases.length : 0,
      averageOrderValueFormatted:
        allPurchases.length > 0
          ? `€${(totalRevenue / allPurchases.length / 100).toFixed(2)}`
          : "€0.00",
    };
  },
});

// Get revenue breakdown by period (admin only)
export const getRevenue = query({
  args: {
    token: v.string(),
    period: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const now = Date.now();
    const periodMs =
      args.period === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : args.period === "30d"
          ? 30 * 24 * 60 * 60 * 1000
          : 90 * 24 * 60 * 60 * 1000;

    const startDate = now - periodMs;

    const purchases = await ctx.db
      .query("purchases")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "completed"),
          q.gte(q.field("createdAt"), startDate)
        )
      )
      .collect();

    // Group by day
    const dailyRevenue: Record<string, number> = {};
    const dailyOrders: Record<string, number> = {};

    for (const purchase of purchases) {
      const date = new Date(purchase.createdAt).toISOString().split("T")[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + purchase.amount;
      dailyOrders[date] = (dailyOrders[date] || 0) + 1;
    }

    // Generate array of dates for the period
    const days = args.period === "7d" ? 7 : args.period === "30d" ? 30 : 90;
    const revenueHistory = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const revenue = dailyRevenue[dateStr] || 0;
      const orders = dailyOrders[dateStr] || 0;

      revenueHistory.push({
        date: dateStr,
        dateFormatted: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue,
        revenueFormatted: `€${(revenue / 100).toFixed(2)}`,
        orders,
      });
    }

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalOrders = purchases.length;

    return {
      period: args.period,
      totalRevenue,
      totalRevenueFormatted: `€${(totalRevenue / 100).toFixed(2)}`,
      totalOrders,
      averageOrderValue:
        totalOrders > 0 ? totalRevenue / totalOrders : 0,
      averageOrderValueFormatted:
        totalOrders > 0
          ? `€${(totalRevenue / totalOrders / 100).toFixed(2)}`
          : "€0.00",
      revenueHistory,
    };
  },
});

// Get sales by product (admin only)
export const getSalesByProduct = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const products = await ctx.db.query("products").collect();

    const salesByProduct = await Promise.all(
      products.map(async (product) => {
        const purchases = await ctx.db
          .query("purchases")
          .withIndex("by_productId", (q) => q.eq("productId", product._id))
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect();

        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        return {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          priceFormatted: `€${(product.price / 100).toFixed(2)}`,
          salesCount: purchases.length,
          totalRevenue,
          totalRevenueFormatted: `€${(totalRevenue / 100).toFixed(2)}`,
          active: product.active,
        };
      })
    );

    // Sort by revenue descending
    return salesByProduct.sort((a, b) => b.totalRevenue - a.totalRevenue);
  },
});

// Get customer growth chart data (admin only)
export const getCustomerGrowth = query({
  args: {
    token: v.string(),
    period: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);

    const now = Date.now();
    const days = args.period === "7d" ? 7 : args.period === "30d" ? 30 : 90;
    const startDate = now - days * 24 * 60 * 60 * 1000;

    const customers = await ctx.db.query("customers").collect();

    // Count customers created each day
    const dailyNewCustomers: Record<string, number> = {};

    for (const customer of customers) {
      if (customer.createdAt >= startDate) {
        const date = new Date(customer.createdAt).toISOString().split("T")[0];
        dailyNewCustomers[date] = (dailyNewCustomers[date] || 0) + 1;
      }
    }

    // Calculate cumulative customers
    const customersBeforeStart = customers.filter(
      (c) => c.createdAt < startDate
    ).length;

    const growthData = [];
    let runningTotal = customersBeforeStart;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const newCustomers = dailyNewCustomers[dateStr] || 0;
      runningTotal += newCustomers;

      growthData.push({
        date: dateStr,
        dateFormatted: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        newCustomers,
        totalCustomers: runningTotal,
      });
    }

    return {
      period: args.period,
      totalCustomers: customers.length,
      newCustomersInPeriod: customers.filter((c) => c.createdAt >= startDate)
        .length,
      growthData,
    };
  },
});
