import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  HttpException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { TtsService } from './tts.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

interface TextToSpeechDto {
  text: string;
  voiceId?: string;
}

@Controller('tts')
@SkipThrottle() // TTS needs many rapid requests during session
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post('speak')
  @UseGuards(ClerkAuthGuard)
  async textToSpeech(
    @Body() dto: TextToSpeechDto,
    @Res() res: Response,
  ): Promise<void> {
    if (!this.ttsService.isConfigured()) {
      throw new HttpException('TTS service not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    if (!dto.text || dto.text.trim().length === 0) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }

    if (dto.text.length > 1000) {
      throw new HttpException('Text too long (max 1000 characters)', HttpStatus.BAD_REQUEST);
    }

    try {
      const audioBuffer = await this.ttsService.textToSpeech(dto.text, {
        voiceId: dto.voiceId,
      });

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      });

      res.status(HttpStatus.OK).send(audioBuffer);
    } catch (error) {
      throw new HttpException(
        'Failed to generate speech',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @UseGuards(ClerkAuthGuard)
  getStatus() {
    return {
      configured: this.ttsService.isConfigured(),
      cacheSize: this.ttsService.getCacheSize(),
    };
  }

  @Post('preload')
  @UseGuards(ClerkAuthGuard)
  async preloadPhrases() {
    if (!this.ttsService.isConfigured()) {
      throw new HttpException('TTS service not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    await this.ttsService.preloadFlashPhrases();

    return {
      success: true,
      cacheSize: this.ttsService.getCacheSize(),
    };
  }
}
