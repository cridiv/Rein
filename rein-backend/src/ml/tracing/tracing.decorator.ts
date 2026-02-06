import { OpikClientService } from '../opik/opik-client.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('TracingDecorator');

export function Trace(options?: {
  name?: string;
  metadata?: Record<string, any>;
  captureArgs?: boolean;
  captureResult?: boolean;
}) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const opikService: OpikClientService = this.opikService;

      if (!opikService) {
        logger.warn(
          `OpikClientService not injected into ${target.constructor.name}`,
        );
        return originalMethod.apply(this, args);
      }

      const traceName =
        options?.name ||
        `${target.constructor.name}.${String(propertyKey)}`;

      const startTime = Date.now();
      let trace;

      try {
        // Prepare input data
        const input = options?.captureArgs !== false
          ? args.reduce((acc, arg, idx) => {
              acc[`arg_${idx}`] = typeof arg === 'object' && arg !== null
                ? JSON.stringify(arg).substring(0, 500)
                : arg;
              return acc;
            }, {})
          : undefined;

        trace = opikService.startTrace(traceName, {
          method: propertyKey,
          class: target.constructor.name,
          ...options?.metadata,
        }, input);

        // Execute the original method
        const result = await originalMethod.apply(this, args);

        // Prepare output data
        const output = options?.captureResult !== false && result
          ? (typeof result === 'object' && result !== null
              ? JSON.stringify(result).substring(0, 500)
              : result)
          : undefined;

        const duration = Date.now() - startTime;
        opikService.endTrace(trace, { result: output, duration });

        logger.debug(
          `Trace ${traceName} completed in ${duration}ms`,
        );

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        if (trace) {
          opikService.endTrace(trace, { 
            error: error instanceof Error ? error.message : String(error),
            duration,
          });
        }

        logger.error(
          `Error in traced method ${traceName}:`,
          error,
        );

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Span decorator for sub-operations within a trace
 */
export function TraceSpan(options?: {
  name?: string;
  captureInput?: boolean;
  captureOutput?: boolean;
}) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const opikService: OpikClientService = this.opikService;

      if (!opikService) {
        return originalMethod.apply(this, args);
      }

      const spanName =
        options?.name || `span_${String(propertyKey)}`;

      // Note: In a real implementation, we'd get the current trace from context
      // This is a simplified version
      const input = options?.captureInput
        ? args.reduce((acc, arg, idx) => {
            acc[`arg_${idx}`] = arg;
            return acc;
          }, {})
        : undefined;

      try {
        const result = await originalMethod.apply(this, args);

        logger.debug(`Span ${spanName} completed successfully`);

        return result;
      } catch (error) {
        logger.error(`Error in span ${spanName}:`, error);
        throw error;
      }
    };

    return descriptor;
  };
}
