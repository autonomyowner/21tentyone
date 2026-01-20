"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

// Initialize Stripe client
function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });
}

// Create a Stripe Checkout session
export const createCheckoutSession = action({
  args: {
    productSlug: v.string(),
    customerEmail: v.optional(v.string()),
    successUrl: v.optional(v.string()),
    cancelUrl: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ url: string; sessionId: string }> => {
    const stripe = getStripe();
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    // Get product from database
    const product = await ctx.runQuery(internal.stripeHelpers.getProductBySlug, {
      slug: args.productSlug,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.active) {
      throw new Error("Product is not available");
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: product.description || undefined,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        args.successUrl ||
        `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: args.cancelUrl || `${clientUrl}/checkout/cancel`,
      customer_email: args.customerEmail,
      metadata: {
        productSlug: args.productSlug,
        productId: product._id,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  },
});

// Handle Stripe webhook event (called from HTTP endpoint)
export const handleWebhookEvent = internalAction({
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args): Promise<{ received: boolean }> => {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET environment variable is not set");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      throw new Error(`Webhook signature verification failed: ${errorMessage}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(ctx, session);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await ctx.runMutation(internal.purchases.updateStatusFromWebhook, {
          stripePaymentIntentId: paymentIntent.id,
          status: "completed",
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await ctx.runMutation(internal.purchases.updateStatusFromWebhook, {
          stripePaymentIntentId: paymentIntent.id,
          status: "failed",
        });
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent && typeof charge.payment_intent === "string") {
          await ctx.runMutation(internal.purchases.updateStatusFromWebhook, {
            stripePaymentIntentId: charge.payment_intent,
            status: "refunded",
          });
        }
        break;
      }
      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  },
});

// Helper function to handle checkout.session.completed
async function handleCheckoutCompleted(
  ctx: { runMutation: typeof import("./_generated/server").ActionCtx["runMutation"] },
  session: Stripe.Checkout.Session
) {
  const customerEmail = session.customer_email;
  const customerName =
    session.customer_details?.name || undefined;
  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : undefined;
  const productSlug = session.metadata?.productSlug;
  const productId = session.metadata?.productId;

  if (!customerEmail) {
    console.error("No customer email in checkout session");
    return;
  }

  if (!productId) {
    console.error("No product ID in checkout session metadata");
    return;
  }

  // Create or get customer
  const customerId = await ctx.runMutation(internal.customers.getOrCreateByEmail, {
    email: customerEmail,
    name: customerName,
    stripeCustomerId,
  });

  // Create purchase record
  const purchaseId = await ctx.runMutation(internal.purchases.createFromWebhook, {
    customerId,
    productId: productId as any, // Product ID from metadata
    amount: session.amount_total || 0,
    currency: session.currency || "eur",
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : undefined,
    stripeCheckoutSessionId: session.id,
    status: "completed",
  });

  // Send delivery email
  await ctx.runMutation(internal.emailHelpers.sendProductDeliveryInternal, {
    purchaseId,
  });
}

// Get Stripe dashboard link for a payment (admin)
export const getPaymentDashboardLink = action({
  args: {
    paymentIntentId: v.string(),
  },
  handler: async (_, args): Promise<string> => {
    // Check if we're in live mode or test mode
    const isLiveMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live");
    const baseUrl = isLiveMode
      ? "https://dashboard.stripe.com"
      : "https://dashboard.stripe.com/test";

    return `${baseUrl}/payments/${args.paymentIntentId}`;
  },
});
