import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { buildResolutionPrompt } from '../common/utils/index';
import { ParsedResolution } from '../common/types/index';
import { GoalPreprocessorService } from '../preprocessor/goal-preprocessor';
import { ClarificationSession } from '../common/types/context';
import { PreprocessedGoal } from '../preprocessor/types/preprocessor';

export interface ResolutionResponse {
  title: string;
  description: string;
  resolution: ParsedResolution;
  shouldTriggerCalendar: boolean;
  calendarIntentReason?: string;
}

@Injectable()
export class GeneratorService {
  private ai: GoogleGenAI;

  constructor(private readonly goalPreprocessor: GoalPreprocessorService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });
  }

  async generateResolution(
    prompt: string, 
    modeType: 'plan' | 'agent',
    sessionData?: ClarificationSession
  ): Promise<ResolutionResponse> {
    // Use enriched data from clarification session if available
    let preprocessed: PreprocessedGoal;
    let conversationContext = '';
    
    if (sessionData) {
      preprocessed = this.buildEnrichedContext(sessionData);
      conversationContext = sessionData.history
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
    } else {
      preprocessed = await this.goalPreprocessor.preprocess(prompt);
    }

    const { goal, known, experienceLevel, timeframe, formatPreference, specificFocus } = preprocessed;
    const message = buildResolutionPrompt(goal, known, experienceLevel);

    // Define strict response schema using Type enum with dates
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        resolution: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              startDate: { type: Type.STRING },
              endDate: { type: Type.STRING },
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    resources: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          title: { type: Type.STRING },
                          link: { type: Type.STRING },
                          description: { type: Type.STRING },
                        },
                        required: ['type', 'title', 'link', 'description'],
                      },
                    },
                  },
                  required: ['id', 'title', 'description', 'resources'],
                },
              },
            },
            required: ['id', 'title', 'description', 'startDate', 'endDate', 'nodes'],
          },
        },
        triggerCalendar: { type: Type.BOOLEAN },
        calendarIntentReason: { 
          type: Type.STRING,
          nullable: true,
        },
      },
      required: ['title', 'resolution', 'triggerCalendar'],
    };

    // Calculate today's date for reference
    const today = new Date().toISOString().split('T')[0];

    const fullPrompt = `
You are an expert roadmap builder and learning specialist.

Your task is to generate a structured learning roadmap based on the goal below.

Additionally, detect if the user wants calendar integration — only set triggerCalendar to true if they explicitly mention scheduling, reminders, deadlines, calendar events, check-ins, etc.

User's original message: "${prompt}"

Roadmap goal: ${message}

EXTRACTED CONTEXT:
- Goal: ${goal}
- Known skills: ${known.join(', ') || 'None specified'}
- Experience level: ${experienceLevel || 'Not specified'}
- Timeframe: ${timeframe || 'No specific timeframe - use 30 days default'}
- Format preference: ${formatPreference || 'mixed'}
- Specific focus areas: ${specificFocus?.join(', ') || 'None specified'}

${conversationContext ? `CLARIFICATION CONVERSATION:\n${conversationContext}\n` : ''}
Today's date: ${today}

Examples where triggerCalendar = true:
- "Make a 6-week plan with weekly reminders"
- "Add this to my calendar with deadlines"

Examples where triggerCalendar = false:
- "Give me a roadmap to learn TypeScript"
- "How to master backend development"

ROADMAP GUIDELINES:
- Generate a concise, descriptive title (4-8 words) that captures the essence of the learning goal
- Each stage: meaningful title, 2–3 sentence description explaining why it's important
- Each stage MUST have startDate and endDate in ISO format (YYYY-MM-DD)
- Split the timeframe evenly across stages with daily granularity
- If no timeframe specified, use a reasonable default based on experience level:
  * Beginner: 45-60 days
  * Intermediate: 30-45 days
  * Advanced: 21-30 days
- Ensure dates are sequential and don't overlap (stage 2 starts day after stage 1 ends)
- Each node: detailed 2–3 sentence educational description
- Exactly 3 high-quality resources per node
- Respect format preference: ${formatPreference || 'mixed video, article, and project resources'}
- Use reputable sources (MDN, official docs, FreeCodeCamp, Traversy Media, etc.)
- Realistic and valid-looking links
- Respect specific focus areas: ${specificFocus?.join(', ') || 'general coverage'}

DATE CALCULATION EXAMPLE:
If timeframe is "2 weeks" (14 days) and there are 3 stages:
- Stage 1: startDate: ${today}, endDate: 4 days later
- Stage 2: startDate: day after stage 1 ends, endDate: 5 days later  
- Stage 3: startDate: day after stage 2 ends, endDate: 5 days later
Total: 4 + 5 + 5 = 14 days

Output must be valid JSON matching the schema.
`.trim();

    let text = '';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      console.log("Using model: gemini-2.5-flash");

      text = response.text ?? '';

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const parsed = JSON.parse(text);

      // Clean up the title - extract just the goal if it contains structured text
      let cleanTitle = parsed.title;
      
      // Remove "Here's what I understood:" and similar intro phrases
      cleanTitle = cleanTitle.replace(/^.*?(?:Here's what I understood|Here is what I understood|Understanding)[:\s]*\n*/i, '');
      
      // Extract content after "Goal:" (handles both **Goal:** and Goal:)
      const goalMatch = cleanTitle.match(/[•\-*\s]*\*?\*?Goal:\*?\*?\s*(.+?)(?:\n|[•\-*]|\*\*|$)/is);
      if (goalMatch) {
        cleanTitle = goalMatch[1].trim();
      }
      
      // Remove all markdown formatting, bullet points, and extra structure
      cleanTitle = cleanTitle
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/^[•\-*]\s+/gm, '') // Remove bullet points
        .replace(/\n.*/s, '') // Remove everything after first newline
        .replace(/[•\-*].*$/s, '') // Remove any trailing bullets and content
        .trim();

      // Generate a polished description for display
      const description = await this.generateDescription(cleanTitle, parsed.resolution);

      return {
        title: cleanTitle,
        description,
        resolution: parsed.resolution,
        shouldTriggerCalendar: parsed.triggerCalendar,
        calendarIntentReason: parsed.calendarIntentReason ?? undefined,
      };
    } catch (err: any) {
      console.error('Gemini generation failed:', err.message);
      console.error('Raw output (if any):', err?.response?.text?.());

      try {
        if (text) {
          const fallbackMatch = text.match(/\[[\s\S]*\]/);
          if (fallbackMatch) {
            const resolution = JSON.parse(fallbackMatch[0]);
            return {
              title: 'Learning Roadmap',
              description: 'A structured learning path to help you achieve your goals.',
              resolution,
              shouldTriggerCalendar: false,
            };
          }
        }
      } catch (fallbackErr) {
      }

      throw new Error(`Failed to generate or parse resolution: ${err.message}`);
    }
  }

  /**
   * Generate a polished description for the resolution
   */
  async generateDescription(title: string, roadmap: ParsedResolution): Promise<string> {
    try {
      // Extract key information from roadmap
      const stageCount = roadmap.length;
      const totalNodes = roadmap.reduce((sum, stage) => sum + (stage.nodes?.length || 0), 0);
      
      // Calculate timeframe
      const startDate = roadmap[0]?.startDate;
      const endDate = roadmap[roadmap.length - 1]?.endDate;
      let timeframeText = '';
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const weeks = Math.ceil(days / 7);
        timeframeText = weeks > 1 ? `${weeks} weeks` : `${days} days`;
      }

      const prompt = `You are a motivational coach. Generate a brief, inspiring description (2-3 sentences) for a learning resolution.

Title: ${title}
Stages: ${stageCount}
Total milestones: ${totalNodes}
Timeframe: ${timeframeText || 'flexible timeline'}

The description should:
- Be encouraging and actionable
- Highlight what the person will achieve
- Mention the structured approach with ${stageCount} stages
- Be concise (50-80 words)
- Not use bullet points
- Be in second person ("You will...")

Generate ONLY the description text, no additional formatting.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
          maxOutputTokens: 150,
        },
      });

      const description = response.text?.trim() || this.getFallbackDescription(title, stageCount, timeframeText);
      return description;
    } catch (error) {
      console.error('Failed to generate description:', error);
      return this.getFallbackDescription(title, roadmap.length, '');
    }
  }

  /**
   * Fallback description if LLM fails
   */
  private getFallbackDescription(title: string, stageCount: number, timeframe: string): string {
    const timeText = timeframe ? ` over ${timeframe}` : '';
    return `You'll master ${title.toLowerCase()} through a structured ${stageCount}-stage learning path${timeText}. Each stage builds on the previous one, ensuring you develop strong fundamentals and practical skills to achieve your goals.`;
  }

  /**
   * Build enriched context from clarification session
   * Combines parsedGoal with insights from the conversation
   */
  private buildEnrichedContext(session: ClarificationSession): PreprocessedGoal {
    return {
      goal: session.parsedGoal.goal,
      known: session.parsedGoal.known || [],
      experienceLevel: session.parsedGoal.experienceLevel,
      timeframe: session.parsedGoal.timeframe,
      formatPreference: session.parsedGoal.formatPreference,
      specificFocus: session.parsedGoal.specificFocus,
    };
  }
}