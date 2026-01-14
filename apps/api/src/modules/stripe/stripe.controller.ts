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

interface CreateCheckoutDto {
  productSlug: string;
  email: string;
}

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    if (!body.email || !body.productSlug) {
      throw new BadRequestException('Email and product slug are required');
    }

    if (!this.stripeService.isConfigured()) {
      return { url: null, message: 'Payments not configured - contact support' };
    }

    const result = await this.stripeService.createCheckoutSession({
      productSlug: body.productSlug,
      email: body.email,
    });

    return result || { url: null, message: 'Failed to create checkout session' };
  }

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
