import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      where: { active: true },
      orderBy: { price: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductsWithStats() {
    const products = await this.prisma.product.findMany({
      include: {
        _count: {
          select: { purchases: true },
        },
        purchases: {
          select: { amount: true },
        },
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      active: product.active,
      salesCount: product._count.purchases,
      totalRevenue: product.purchases.reduce((sum, p) => sum + p.amount, 0),
    }));
  }
}
