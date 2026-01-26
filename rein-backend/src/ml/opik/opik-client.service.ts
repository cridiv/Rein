import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Opik } from 'opik';

@Injectable()
export class OpikClientService implements OnModuleInit, OnModuleDestroy {
  private opik: Opik;
  private readonly logger = new Logger(OpikClientService.name);

  async onModuleInit() {
    try {
      // Initialize Opik client with API key and workspace from environment
      this.opik = new Opik({
        apiKey: process.env.OPIK_API_KEY || '',
        projectName: process.env.OPIK_PROJECT_NAME || 'rein-ai-coaching',
      });

      this.logger.log('Opik client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Opik client', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      // Cleanup if needed
      this.logger.log('Opik client cleanup completed');
    } catch (error) {
      this.logger.error('Error during Opik client cleanup', error);
    }
  }

  /**
   * Get the Opik client instance
   */
  getClient(): Opik {
    if (!this.opik) {
      throw new Error('Opik client not initialized');
    }
    return this.opik;
  }

  /**
   * Start a trace for tracking a complete operation
   */
  startTrace(name: string, metadata?: Record<string, any>) {
    const client = this.getClient();
    return client.trace({
      name,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });
  }

  /**
   * Create a span within a trace for sub-operations
   */
  createSpan(trace: any, name: string, input?: Record<string, any>) {
    return trace.span({
      name,
      input: input
        ? {
            data: input,
            timestamp: new Date().toISOString(),
          }
        : undefined,
    });
  }

  /**
   * Log output and complete a span
   */
  endSpan(span: any, output: any, feedback?: Record<string, any>) {
    span.end({
      output: {
        data: output,
        timestamp: new Date().toISOString(),
      },
      feedback: feedback,
    });
  }

  /**
   * Log a completed trace
   */
  endTrace(trace: any, status: 'success' | 'error' = 'success', error?: Error) {
    trace.end({
      status,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  /**
   * Log feedback for a trace (e.g., user rating, metric score)
   */
  logFeedback(traceId: string, feedback: Record<string, any>) {
    const client = this.getClient();
    return client.log_feedback(traceId, feedback);
  }

  /**
   * Create an evaluation dataset
   */
  createDataset(name: string, description?: string) {
    const client = this.getClient();
    return client.create_dataset({
      name,
      description,
    });
  }

  /**
   * Log evaluation result
   */
  logEvaluation(
    traceId: string,
    scorerName: string,
    score: number,
    metadata?: Record<string, any>,
  ) {
    const client = this.getClient();
    return client.log_evaluation(traceId, {
      scorer_name: scorerName,
      score,
      metadata,
    });
  }
}
