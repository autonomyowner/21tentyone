import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { EmailModule } from './modules/email/email.module';
import { AdminModule } from './modules/admin/admin.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Global rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 60,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
    PrismaModule,
    HealthModule,
    StripeModule,
    ProductsModule,
    PurchasesModule,
    EmailModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
