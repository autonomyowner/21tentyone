import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Customers table - stores customer information from Stripe
  customers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(), // Unix timestamp
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  // Products table - available products for purchase
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    price: v.number(), // Price in cents (2700 = €27)
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["active"]),

  // Purchases table - tracks all completed purchases
  purchases: defineTable({
    customerId: v.id("customers"),
    productId: v.id("products"),
    amount: v.number(), // Amount in cents
    currency: v.string(), // "eur", "usd", etc.
    stripePaymentIntentId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    emailSent: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_customerId", ["customerId"])
    .index("by_productId", ["productId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_stripePaymentIntentId", ["stripePaymentIntentId"])
    .index("by_stripeCheckoutSessionId", ["stripeCheckoutSessionId"]),

  // Email logs table - tracks all emails sent via Resend
  emailLogs: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_purchaseId", ["purchaseId"]),
});
