import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    customerId: string;
    productId: string;
    amount: number;
    stripePaymentId?: string;
  }) {
    return this.prisma.purchase.create({
      data,
      include: {
        customer: true,
        product: true,
      },
    });
  }

  async findAll(options: { page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      this.prisma.purchase.findMany({
        skip,
        take: limit,
        include: {
          customer: true,
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchase.count(),
    ]);

    return {
      data: purchases,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByCustomer(customerId: string) {
    return this.prisma.purchase.findMany({
      where: { customerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markEmailSent(purchaseId: string) {
    return this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { emailSent: true },
    });
  }

  async getRevenueStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const purchases = await this.prisma.purchase.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'completed',
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

    // Group by day
    const revenueByDay = purchases.reduce(
      (acc, p) => {
        const day = p.createdAt.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + p.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRevenue,
      purchaseCount: purchases.length,
      revenueByDay,
    };
  }
}
