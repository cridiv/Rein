import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TracingService implements OnModuleInit {
  private opik: any;
  private Opik: any;
  private opikClient: any;

  async onModuleInit() {
    try {
      // Dynamically import Opik ESM module
      this.opik = await import('opik');
      this.Opik = this.opik.Opik;
      
      // Initialize Opik client
      this.opikClient = new this.Opik({
        projectName: process.env.OPIK_PROJECT_NAME || 'rein-ml',
      });
      
      console.log('✅ Opik tracing initialized successfully');
    } catch (error) {
      console.error('⚠️  Opik initialization failed:', error.message);
      console.log('Tracing will be disabled');
    }
  }

  /**
   * Trace an LLM generation call
   */
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
    if (!this.opikClient) {
      return await generateFn();
    }

    const trace = this.opikClient.trace({ name: `llm-${name}` });
    const span = trace.span({
      type: 'llm',
      name,
      input: { prompt: input.prompt },
      metadata: {
        model: input.model,
        temperature: input.temperature,
        maxTokens: input.maxTokens,
      },
    });

    try {
      const result = await generateFn();
      span.end({ output: { text: result } });
      return result;
    } catch (error) {
      span.end({ output: { error: error.message } });
      throw error;
    } finally {
      await trace.end();
    }
  }

  /**
   * Trace preprocessing operations
   */
  async tracePreprocessing(
    name: string,
    input: any,
    processFn: () => Promise<any>,
  ): Promise<any> {
    if (!this.opikClient) {
      return await processFn();
    }

    const trace = this.opikClient.trace({ name: `preprocessing-${name}` });
    const span = trace.span({
      type: 'task',
      name: 'preprocessing',
      input,
    });

    try {
      const result = await processFn();
      span.end({ output: result });
      return result;
    } catch (error) {
      span.end({ output: { error: error.message } });
      throw error;
    } finally {
      await trace.end();
    }
  }

  /**
   * Trace evaluation operations
   */
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
    if (!this.opikClient) {
      return await evaluateFn();
    }

    const trace = this.opikClient.trace({ name: `evaluation-${name}` });
    const span = trace.span({
      type: 'task',
      name: 'evaluation',
      input: context.input,
      metadata: {
        goalId: context.goalId,
        userId: context.userId,
      },
    });

    try {
      const result = await evaluateFn();
      span.end({ 
        output: {
          ...result,
          expectedOutput: context.output,
        },
      });
      return result;
    } catch (error) {
      span.end({ output: { error: error.message } });
      throw error;
    } finally {
      await trace.end();
    }
  }

  /**
   * Trace end-to-end goal generation pipeline
   */
  async traceGoalGeneration(
    userId: string,
    userInput: string,
    executePipeline: () => Promise<{
      preprocessed: any;
      generated: any;
      synced: any;
    }>,
  ): Promise<any> {
    if (!this.opikClient) {
      return await executePipeline();
    }

    const trace = this.opikClient.trace({ 
      name: 'goal-generation-pipeline',
      metadata: { userId },
    });
    
    const span = trace.span({
      type: 'task',
      name: 'goal-generation-pipeline',
      input: { userInput },
    });

    try {
      const result = await executePipeline();
      span.end({ output: result });
      return result;
    } catch (error) {
      span.end({ output: { error: error.message } });
      throw error;
    } finally {
      await trace.end();
    }
  }
}
