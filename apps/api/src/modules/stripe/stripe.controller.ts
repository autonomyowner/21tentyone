import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Public } from '../../common/decorators/public.decorator';

interface CreateCheckoutDto {
  email: string;
  billing: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
}

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    if (!this.stripeService.isConfigured()) {
      return { url: null, message: 'Stripe not configured' };
    }

    if (!body.email || !body.billing) {
      throw new BadRequestException('Email and billing period required');
    }

    const result = await this.stripeService.createCheckoutSession({
      email: body.email,
      billing: body.billing,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    });

    return result || { url: null, message: 'Failed to create checkout session' };
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    await this.stripeService.handleWebhook(req.rawBody, signature);
    return { received: true };
  }
}
