"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

// Initialize Resend client
function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

// Generate delivery email HTML
function generateDeliveryEmailHtml(params: {
  customerName: string;
  productName: string;
  fileUrl?: string;
  amount: number;
  currency: string;
}): string {
  const { customerName, productName, fileUrl, amount, currency } = params;
  const formattedAmount = new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Purchase from 21|Twenty One</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0;">21|Twenty One</h1>
    <p style="color: #666; margin: 5px 0 0;">Heal Your Attachment, Build Healthy Relationships</p>
  </div>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 15px;">Thank you for your purchase!</h2>
    <p style="margin: 0 0 15px;">Dear ${customerName},</p>
    <p style="margin: 0 0 15px;">Your order has been confirmed. Here are the details:</p>

    <div style="background: white; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px;"><strong>Product:</strong> ${productName}</p>
      <p style="margin: 0;"><strong>Amount:</strong> ${formattedAmount}</p>
    </div>

    ${
      fileUrl
        ? `
    <div style="text-align: center; margin: 25px 0;">
      <a href="${fileUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500;">Download Your Product</a>
    </div>
    `
        : ""
    }

    <p style="margin: 20px 0 0; font-size: 14px; color: #666;">If you have any questions, please don't hesitate to reach out to our support team.</p>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px;">
    <p style="margin: 0 0 10px;">21|Twenty One - Your Journey to Secure Attachment</p>
    <p style="margin: 0;">This email was sent to you because you made a purchase.</p>
  </div>
</body>
</html>
  `.trim();
}

// Send product delivery email (admin action)
export const sendProductDelivery = action({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const resend = getResend();
    const fromEmail = process.env.EMAIL_FROM || "noreply@21twentyone.com";

    // Get purchase details
    const details = await ctx.runQuery(internal.emailHelpers.getPurchaseDetails, {
      purchaseId: args.purchaseId,
    });

    if (!details || !details.customer || !details.product) {
      return { success: false, error: "Purchase details not found" };
    }

    const { customer, product, purchase } = details;

    // Create email content
    const subject = `Your purchase: ${product.name}`;
    const html = generateDeliveryEmailHtml({
      customerName: customer.name || "Valued Customer",
      productName: product.name,
      fileUrl: product.fileUrl,
      amount: purchase.amount,
      currency: purchase.currency,
    });

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject,
        html,
      });

      if (error) {
        // Log the failed email
        await ctx.runMutation(internal.emailLogs.create, {
          to: customer.email,
          subject,
          template: "product-delivery",
          status: "failed",
          errorMessage: error.message,
          purchaseId: args.purchaseId,
        });

        return { success: false, error: error.message };
      }

      // Log the sent email
      await ctx.runMutation(internal.emailLogs.create, {
        to: customer.email,
        subject,
        template: "product-delivery",
        resendId: data?.id,
        status: "sent",
        purchaseId: args.purchaseId,
      });

      // Mark purchase as email sent
      await ctx.runMutation(internal.purchases.markEmailSentInternal, {
        purchaseId: args.purchaseId,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      // Log the failed email
      await ctx.runMutation(internal.emailLogs.create, {
        to: customer.email,
        subject,
        template: "product-delivery",
        status: "failed",
        errorMessage,
        purchaseId: args.purchaseId,
      });

      return { success: false, error: errorMessage };
    }
  },
});

// Internal action to actually send the email
export const sendProductDeliveryAction = internalAction({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args): Promise<void> => {
    const resend = getResend();
    const fromEmail = process.env.EMAIL_FROM || "noreply@21twentyone.com";

    // Get purchase details
    const details = await ctx.runQuery(internal.emailHelpers.getPurchaseDetails, {
      purchaseId: args.purchaseId,
    });

    if (!details || !details.customer || !details.product) {
      console.error("Purchase details not found for email delivery");
      return;
    }

    const { customer, product, purchase } = details;

    // Create email content
    const subject = `Your purchase: ${product.name}`;
    const html = generateDeliveryEmailHtml({
      customerName: customer.name || "Valued Customer",
      productName: product.name,
      fileUrl: product.fileUrl,
      amount: purchase.amount,
      currency: purchase.currency,
    });

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject,
        html,
      });

      if (error) {
        // Log the failed email
        await ctx.runMutation(internal.emailLogs.create, {
          to: customer.email,
          subject,
          template: "product-delivery",
          status: "failed",
          errorMessage: error.message,
          purchaseId: args.purchaseId,
        });
        return;
      }

      // Log the sent email
      await ctx.runMutation(internal.emailLogs.create, {
        to: customer.email,
        subject,
        template: "product-delivery",
        resendId: data?.id,
        status: "sent",
        purchaseId: args.purchaseId,
      });

      // Mark purchase as email sent
      await ctx.runMutation(internal.purchases.markEmailSentInternal, {
        purchaseId: args.purchaseId,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      // Log the failed email
      await ctx.runMutation(internal.emailLogs.create, {
        to: customer.email,
        subject,
        template: "product-delivery",
        status: "failed",
        errorMessage,
        purchaseId: args.purchaseId,
      });
    }
  },
});

// Resend email (admin action)
export const resendEmail = action({
  args: {
    emailLogId: v.id("emailLogs"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    // Get the email log
    const emailLog = await ctx.runQuery(internal.emailHelpers.getEmailLogById, {
      id: args.emailLogId,
    });

    if (!emailLog) {
      return { success: false, error: "Email log not found" };
    }

    if (!emailLog.purchaseId) {
      return { success: false, error: "No purchase associated with this email" };
    }

    const resend = getResend();
    const fromEmail = process.env.EMAIL_FROM || "noreply@21twentyone.com";

    // Get purchase details
    const details = await ctx.runQuery(internal.emailHelpers.getPurchaseDetails, {
      purchaseId: emailLog.purchaseId,
    });

    if (!details || !details.customer || !details.product) {
      return { success: false, error: "Purchase details not found" };
    }

    const { customer, product, purchase } = details;

    // Create email content
    const subject = `Your purchase: ${product.name}`;
    const html = generateDeliveryEmailHtml({
      customerName: customer.name || "Valued Customer",
      productName: product.name,
      fileUrl: product.fileUrl,
      amount: purchase.amount,
      currency: purchase.currency,
    });

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject,
        html,
      });

      if (error) {
        await ctx.runMutation(internal.emailLogs.create, {
          to: customer.email,
          subject,
          template: "product-delivery",
          status: "failed",
          errorMessage: error.message,
          purchaseId: emailLog.purchaseId,
        });

        return { success: false, error: error.message };
      }

      await ctx.runMutation(internal.emailLogs.create, {
        to: customer.email,
        subject,
        template: "product-delivery",
        resendId: data?.id,
        status: "sent",
        purchaseId: emailLog.purchaseId,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },
});
