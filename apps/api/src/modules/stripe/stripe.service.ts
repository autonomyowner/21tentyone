import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;
  private webhookSecret: string | undefined;
  private clientUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia',
      });
      this.logger.log('Stripe initialized successfully');
    } else {
      this.logger.warn('Stripe secret key not configured - payments disabled');
    }
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    this.clientUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';
  }

  isConfigured(): boolean {
    return this.stripe !== null;
  }

  async createCheckoutSession(params: {
    productSlug: string;
    email: string;
  }): Promise<{ url: string } | null> {
    if (!this.stripe) {
      this.logger.warn('Stripe not configured - cannot create checkout session');
      return null;
    }

    // Get product from database
    const product = await this.prisma.product.findUnique({
      where: { slug: params.productSlug },
    });

    if (!product) {
      this.logger.error(`Product not found: ${params.productSlug}`);
      return null;
    }

    if (product.price === 0) {
      // Free product - skip payment, just create customer and send email
      await this.handleFreeProduct(params.email, product);
      return { url: `${this.clientUrl}/success?product=${params.productSlug}` };
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment', // One-time payment, not subscription
        payment_method_types: ['card'],
        customer_email: params.email,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: product.name,
                description: product.description || undefined,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        metadata: {
          productSlug: params.productSlug,
          customerEmail: params.email,
        },
        success_url: `${this.clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.clientUrl}/checkout?product=${params.productSlug}`,
      });

      this.logger.log(`Created checkout session for ${params.email}: ${product.name}`);
      return { url: session.url! };
    } catch (error) {
      this.logger.error('Failed to create Stripe checkout session:', error);
      throw error;
    }
  }

  private async handleFreeProduct(email: string, product: { id: string; name: string; slug: string; fileUrl: string | null }) {
    // Create or find customer
    let customer = await this.prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await this.prisma.customer.create({
        data: { email },
      });
    }

    // Create purchase record (amount = 0 for free)
    await this.prisma.purchase.create({
      data: {
        customerId: customer.id,
        productId: product.id,
        amount: 0,
        status: 'completed',
        emailSent: true,
      },
    });

    // Send email with product
    await this.emailService.sendProductDelivery(email, product);
    this.logger.log(`Delivered free product ${product.name} to ${email}`);
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    if (!this.webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.processSuccessfulPayment(session);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        this.logger.warn(`Payment failed for: ${failedPayment.id}`);
        break;

      default:
        this.logger.log(`Unhandled webhook event: ${event.type}`);
    }
  }

  private async processSuccessfulPayment(session: Stripe.Checkout.Session) {
    const productSlug = session.metadata?.productSlug;
    const customerEmail = session.metadata?.customerEmail || session.customer_email;

    if (!productSlug || !customerEmail) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    this.logger.log(`Processing payment for ${customerEmail}: ${productSlug}`);

    // Get product
    const product = await this.prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) {
      this.logger.error(`Product not found: ${productSlug}`);
      return;
    }

    // Create or find customer
    let customer = await this.prisma.customer.findUnique({
      where: { email: customerEmail },
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          email: customerEmail,
          stripeId: session.customer as string || null,
        },
      });
    } else if (session.customer && !customer.stripeId) {
      // Update stripe ID if we didn't have it before
      await this.prisma.customer.update({
        where: { id: customer.id },
        data: { stripeId: session.customer as string },
      });
    }

    // Create purchase record
    const purchase = await this.prisma.purchase.create({
      data: {
        customerId: customer.id,
        productId: product.id,
        amount: session.amount_total || product.price,
        stripePaymentId: session.payment_intent as string,
        status: 'completed',
      },
    });

    // Send product delivery email
    try {
      await this.emailService.sendProductDelivery(customerEmail, product);
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { emailSent: true },
      });
      this.logger.log(`Product delivered to ${customerEmail}: ${product.name}`);
    } catch (error) {
      this.logger.error(`Failed to send product email to ${customerEmail}:`, error);
    }
  }
}
