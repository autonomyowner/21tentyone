import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Internal query to get purchase details
export const getPurchaseDetails = internalQuery({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) return null;

    const customer = await ctx.db.get(purchase.customerId);
    const product = await ctx.db.get(purchase.productId);

    return {
      purchase,
      customer,
      product,
    };
  },
});

// Internal query to get email log by ID
export const getEmailLogById = internalQuery({
  args: {
    id: v.id("emailLogs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Internal: Schedule product delivery email (called from webhook)
export const sendProductDeliveryInternal = internalMutation({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    const { purchaseId } = args;

    // Mark that we're sending email
    const purchase = await ctx.db.get(purchaseId);
    if (!purchase) return;

    // Schedule the action to send the email
    const { internal } = await import("./_generated/api");
    await ctx.scheduler.runAfter(0, internal.email.sendProductDeliveryAction, {
      purchaseId,
    });
  },
});
