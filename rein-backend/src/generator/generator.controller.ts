import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GeneratorService, ResolutionResponse } from './generator.service';
import { ClarificationSessionService } from '../context/session/context-session.service';

@Controller('generate')
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly sessionService: ClarificationSessionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleChat(
    @Body('prompt') prompt: string,
    @Body('mode') modeType: 'plan' | 'agent',
    @Body('sessionId') sessionId?: string,
    @Body('userId') userId?: string,
  ): Promise<ResolutionResponse | { error: string }> {
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return { error: 'Prompt is required and must be a non-empty string' };
    }

    try {
      // Fetch session data if sessionId and userId provided
      let sessionData: Awaited<ReturnType<typeof this.sessionService.getSession>> | undefined = undefined;
      if (sessionId && userId) {
        sessionData = await this.sessionService.getSession(userId, sessionId);
        if (sessionData) {
          console.log('Using enriched context from clarification session:', sessionId);
        }
      }

      const result: ResolutionResponse = await this.generatorService.generateResolution(
        prompt.trim(), 
        modeType,
        sessionData || undefined
      );
      console.log('ROADMAP GENERATED SUCCESSFULLY');
      console.log('Calendar intent:', result.shouldTriggerCalendar);
      if (result.calendarIntentReason) {
        console.log('Reason:', result.calendarIntentReason);
      }

      // Return the full response — frontend can use both roadmap + calendar flag
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate roadmap';
      console.error('ERROR generating resolution:', errorMessage);
      if (error instanceof Object && 'stack' in error) {
        console.error(error.stack);
      }

      return { error: errorMessage };
    }
  }
}
