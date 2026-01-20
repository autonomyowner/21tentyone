import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Stripe webhook endpoint
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const payload = await request.text();

    try {
      const result = await ctx.runAction(internal.stripe.handleWebhookEvent, {
        payload,
        signature,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Webhook error:", errorMessage);

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Resend webhook endpoint (for email status updates)
http.route({
  path: "/resend/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();

    // Resend webhook payload structure
    const { type, data } = body as {
      type: string;
      data: {
        email_id: string;
        to: string[];
        subject: string;
        created_at: string;
      };
    };

    try {
      // Map Resend event types to our status
      let status: "sent" | "delivered" | "failed" | "bounced" | "pending";
      switch (type) {
        case "email.sent":
          status = "sent";
          break;
        case "email.delivered":
          status = "delivered";
          break;
        case "email.delivery_delayed":
          status = "pending";
          break;
        case "email.complained":
        case "email.bounced":
          status = "bounced";
          break;
        default:
          // Unknown event type, acknowledge but don't process
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
      }

      // Update email log status
      await ctx.runMutation(internal.emailLogs.updateStatus, {
        resendId: data.email_id,
        status,
      });

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Resend webhook error:", errorMessage);

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        status: "ok",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http;
