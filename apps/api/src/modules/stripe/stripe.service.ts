import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe | null = null;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2024-11-20.acacia',
      });
      this.logger.log('Stripe initialized successfully');
    } else {
      this.logger.warn('Stripe secret key not configured - payments disabled');
    }
  }

  isConfigured(): boolean {
    return this.stripe !== null;
  }

  async createCheckoutSession(params: {
    email: string;
    billing: 'monthly' | 'yearly';
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string } | null> {
    if (!this.stripe) {
      this.logger.warn('Stripe not configured - cannot create checkout session');
      return null;
    }

    const priceId = params.billing === 'yearly'
      ? this.configService.get<string>('stripe.yearlyPriceId')
      : this.configService.get<string>('stripe.monthlyPriceId');

    if (!priceId) {
      this.logger.error(`Price ID not configured for ${params.billing} billing`);
      return null;
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: params.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: {
          billing: params.billing,
        },
      });

      return { url: session.url! };
    } catch (error) {
      this.logger.error('Failed to create Stripe checkout session:', error);
      throw error;
    }
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not configured');
    }

    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        this.logger.log(`Checkout completed for customer: ${session.customer_email}`);
        // TODO: Update user subscription status in database
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        this.logger.log(`Subscription ${event.type}: ${subscription.id}`);
        // TODO: Update user subscription status in database
        break;

      default:
        this.logger.log(`Unhandled webhook event: ${event.type}`);
    }
  }
}
