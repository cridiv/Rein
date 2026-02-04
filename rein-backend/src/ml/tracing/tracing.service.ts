import { Injectable } from '@nestjs/common';
import { track } from '@opik/opik';

@Injectable()
export class TracingService {
  /**
   * Trace an LLM generation call
   */
  @track({ type: 'llm' })
  async traceLlmCall(
    name: string,
    input: {
      model: string;
      prompt: string;
      temperature?: number;
      maxTokens?: number;
    },
    generateFn: () => Promise<string>,
  ): Promise<string> {
    return await generateFn();
  }

  /**
   * Trace preprocessing operations
   */
  @track({ type: 'preprocessing' })
  async tracePreprocessing(
    name: string,
    input: any,
    processFn: () => Promise<any>,
  ): Promise<any> {
    return await processFn();
  }

  /**
   * Trace evaluation operations
   */
  @track({ type: 'evaluation' })
  async traceEvaluation(
    name: string,
    context: {
      goalId: string;
      userId: string;
      input: any;
      output: any;
    },
    evaluateFn: () => Promise<{
      score: number;
      reasoning: string;
      metrics?: Record<string, number>;
    }>,
  ): Promise<any> {
    return await evaluateFn();
  }

  /**
   * Trace end-to-end goal generation pipeline
   */
  @track({ type: 'pipeline' })
  async traceGoalGeneration(
    userId: string,
    userInput: string,
    executePipeline: () => Promise<{
      preprocessed: any;
      generated: any;
      synced: any;
    }>,
  ): Promise<any> {
    return await executePipeline();
  }
}
