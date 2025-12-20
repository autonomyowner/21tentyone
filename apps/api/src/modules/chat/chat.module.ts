import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { EmdrService } from './emdr.service';
import { AuthModule } from '../auth/auth.module';
import { AIModule } from '../../providers/ai/ai.module';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [AuthModule, AIModule, CycleModule],
  controllers: [ChatController],
  providers: [ChatService, EmdrService],
  exports: [ChatService, EmdrService],
})
export class ChatModule {}
