import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('metrics')
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('revenue')
  async getRevenue(@Query('period') period?: '7d' | '30d' | '90d') {
    return this.adminService.getRevenue(period || '30d');
  }

  @Get('customers')
  async getCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getCustomers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('purchases')
  async getPurchases(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getPurchases(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('products')
  async getProducts() {
    return this.adminService.getProducts();
  }

  @Get('emails')
  async getEmailLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getEmailLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
