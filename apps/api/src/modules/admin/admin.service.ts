import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalCustomers,
      totalPurchases,
      totalRevenue,
      recentPurchases,
      emailsSent,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.purchase.count({ where: { status: 'completed' } }),
      this.prisma.purchase.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
      this.prisma.purchase.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          status: 'completed',
        },
      }),
      this.prisma.emailLog.count({ where: { status: 'sent' } }),
    ]);

    // Calculate previous period for comparison
    const previousPeriodStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const previousPurchases = await this.prisma.purchase.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: previousPeriodEnd,
        },
        status: 'completed',
      },
    });

    const growthRate = previousPurchases > 0
      ? ((recentPurchases - previousPurchases) / previousPurchases) * 100
      : 0;

    return {
      totalCustomers,
      totalPurchases,
      totalRevenue: (totalRevenue._sum.amount || 0) / 100, // Convert cents to euros
      recentPurchases,
      emailsSent,
      growthRate: Math.round(growthRate * 10) / 10,
    };
  }

  async getRevenue(period: '7d' | '30d' | '90d' = '30d') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const purchases = await this.prisma.purchase.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'completed',
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const revenueByDay: { date: string; revenue: number; count: number }[] = [];
    const dayMap = new Map<string, { revenue: number; count: number }>();

    purchases.forEach((p) => {
      const day = p.createdAt.toISOString().split('T')[0];
      const existing = dayMap.get(day) || { revenue: 0, count: 0 };
      dayMap.set(day, {
        revenue: existing.revenue + p.amount,
        count: existing.count + 1,
      });
    });

    // Fill in missing days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayStr = date.toISOString().split('T')[0];
      const data = dayMap.get(dayStr) || { revenue: 0, count: 0 };
      revenueByDay.push({
        date: dayStr,
        revenue: data.revenue / 100,
        count: data.count,
      });
    }

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0) / 100;

    return {
      totalRevenue,
      purchaseCount: purchases.length,
      revenueHistory: revenueByDay,
    };
  }

  async getCustomers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: limit,
        include: {
          purchases: {
            include: { product: true },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count(),
    ]);

    const customersWithStats = customers.map((customer) => ({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      createdAt: customer.createdAt,
      purchaseCount: customer.purchases.length,
      totalSpent: customer.purchases.reduce((sum, p) => sum + p.amount, 0) / 100,
      lastPurchase: customer.purchases[0]?.createdAt || null,
      products: customer.purchases.map((p) => p.product.name),
    }));

    return {
      data: customersWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPurchases(page: number = 1, limit: number = 20) {
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

    const formattedPurchases = purchases.map((p) => ({
      id: p.id,
      customerEmail: p.customer.email,
      customerName: p.customer.name,
      productName: p.product.name,
      productSlug: p.product.slug,
      amount: p.amount / 100,
      currency: p.currency,
      status: p.status,
      emailSent: p.emailSent,
      stripePaymentId: p.stripePaymentId,
      createdAt: p.createdAt,
    }));

    return {
      data: formattedPurchases,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProducts() {
    const products = await this.prisma.product.findMany({
      include: {
        purchases: {
          where: { status: 'completed' },
          select: { amount: true },
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price / 100,
      active: product.active,
      salesCount: product.purchases.length,
      totalRevenue: product.purchases.reduce((sum, p) => sum + p.amount, 0) / 100,
    }));
  }

  async getEmailLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.emailLog.count(),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
