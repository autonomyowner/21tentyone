import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
