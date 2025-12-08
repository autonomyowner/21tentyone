import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TTSOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  // Default voice - Rachel (calm, soothing female voice)
  private readonly defaultVoiceId = '21m00Tcm4TlvDq8ikWAM';

  // Audio cache for pre-generated phrases
  private audioCache: Map<string, Buffer> = new Map();

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ELEVENLABS_API_KEY') || '';
  }

  async textToSpeech(text: string, options: TTSOptions = {}): Promise<Buffer> {
    const cacheKey = `${text}-${options.voiceId || this.defaultVoiceId}`;

    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    const voiceId = options.voiceId || this.defaultVoiceId;
    const url = `${this.baseUrl}/text-to-speech/${voiceId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: options.modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability ?? 0.75,
            similarity_boost: options.similarityBoost ?? 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        throw new Error(`TTS API error: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Cache the result
      this.audioCache.set(cacheKey, buffer);

      return buffer;
    } catch (error) {
      this.logger.error('TTS generation failed:', error);
      throw error;
    }
  }

  async getVoices(): Promise<unknown[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      this.logger.error('Failed to fetch voices:', error);
      throw error;
    }
  }

  // Pre-generate and cache common phrases for Flash Technique
  async preloadFlashPhrases(): Promise<void> {
    const phrases = [
      'Flash',
      'Begin slow tapping... left... right... left... right...',
      'Stay connected to your positive place...',
      'Keep your focus there completely...',
      'Stay with your positive place...',
      'Notice what you see there...',
      'What sounds do you hear...',
      'Feel the calm...',
      'Let those good feelings grow...',
      'Stop tapping...',
      'Take a deep breath...',
      'Now, lightly touch on what was bothering you...',
      'Just briefly... don\'t dwell on it...',
      'Notice if anything has changed...',
      'Take a moment to notice how you feel.',
      'Does the memory seem different in any way?',
      'Bring to mind what was bothering you earlier...',
      'How does it feel now, on a scale of zero to ten?',
      'Wonderful. Your mind did important work today.',
      'Notice your feet on the ground...',
      'Look around and name three things you can see...',
      'You can return anytime you need this space.',
    ];

    this.logger.log('Preloading Flash Technique audio phrases...');

    for (const phrase of phrases) {
      try {
        await this.textToSpeech(phrase);
        this.logger.debug(`Cached: "${phrase.substring(0, 30)}..."`);
      } catch (error) {
        this.logger.warn(`Failed to preload phrase: "${phrase.substring(0, 30)}..."`);
      }
    }

    this.logger.log(`Preloaded ${this.audioCache.size} audio phrases`);
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getCacheSize(): number {
    return this.audioCache.size;
  }

  clearCache(): void {
    this.audioCache.clear();
  }
}
