import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [AuthModule, CycleModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
