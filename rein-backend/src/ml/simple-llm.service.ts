import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

/**
 * Simplified LLM Service without complex tracing dependencies
 * Use this for initial integration until we fix the Opik setup
 */
@Injectable()
export class SimpleLlmService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  async generateContent(
    systemPrompt: string, 
    userPrompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxOutputTokens?: number;
      outputFormat?: 'text' | 'json' | 'markdown';
    } = {}
  ): Promise<string> {
    try {
      const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}`;
      
      const result = await this.genAI.models.generateContent({
        model: options.model || 'gemini-2.5-flash-lite',
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      });

      return result.text || 'No response generated';
    } catch (error) {
      console.error('LLM generation error:', error);
      return 'Error generating content. Please try again.';
    }
  }
}