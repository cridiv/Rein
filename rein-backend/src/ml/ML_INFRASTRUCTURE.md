# ML Infrastructure Architecture & Integration Guide

## Overview

The ML Infrastructure for Rein integrates Opik tracing and evaluation with NestJS backend and Python ML model for comprehensive AI coaching platform with continuous improvement capabilities.

## Architecture Components

### 1. **Opik Client Module** (`src/ml/opik/`)

**Purpose**: Centralized Opik client management for the entire application

**Components**:
- `OpikClientService`: Global service for creating traces, spans, and logging evaluations
- `OpikClientModule`: NestJS module providing Opik as a global dependency

**Key Methods**:
- `startTrace()`: Begin a new trace
- `createSpan()`: Create a sub-span within a trace
- `endSpan()`: Complete a span with output
- `logFeedback()`: Log user feedback for a trace
- `logEvaluation()`: Log evaluation metrics and scores

**Usage**:
```typescript
constructor(private opikService: OpikClientService) {}

async doSomething() {
  const trace = this.opikService.startTrace('operation_name', { metadata });
  try {
    // Do work
    this.opikService.endTrace(trace, 'success');
  } catch (error) {
    this.opikService.endTrace(trace, 'error', error);
  }
}
```

### 2. **Tracing Module** (`src/ml/tracing/`)

**Purpose**: High-level tracing utilities and decorators

**Components**:
- `@Trace()`: Decorator for automatic method tracing
- `@TraceSpan()`: Decorator for sub-operations
- `TracingService`: Service with common tracing patterns

**Available Patterns**:
- `traceLlmCall()`: Traces LLM generations with token estimation
- `tracePreprocessing()`: Traces data preprocessing stages
- `traceEvaluation()`: Traces evaluation operations
- `traceGoalGeneration()`: Traces end-to-end pipelines

**Example**:
```typescript
@Injectable()
export class MyService {
  constructor(private tracing: TracingService) {}

  @Trace({ name: 'my_operation' })
  async myOperation(input: string): Promise<string> {
    return await this.tracing.traceLlmCall('llm_call', 
      { model: 'gemini', prompt: input },
      () => this.generateContent(input)
    );
  }
}
```

### 3. **LLM Service with Tracing** (`src/ml/llm/`)

**Purpose**: Gemini integration with comprehensive Opik tracing

**Features**:
- Request/response logging with token estimation
- JSON response parsing and error handling
- Streaming support with chunk tracking
- Batch processing with error aggregation
- Automatic error tracing

**Methods**:
- `generateContent()`: Single LLM call with full tracing
- `generateContentStream()`: Streaming generation
- `generateContentBatch()`: Batch processing multiple prompts

**Token Estimation**: ~4 characters per token (rough approximation)

### 4. **Evaluation Service** (`src/ml/evaluation/`)

**Purpose**: LLM-based evaluation of generated content

**Evaluators**:
- `evaluateResolution()`: Scores generated resolutions on:
  - Clarity (0-10)
  - Specificity (0-10)
  - Measurability (0-10)
  - Actionability (0-10)

- `evaluatePlan()`: Scores execution plans on:
  - Coherence
  - Feasibility
  - Progressiveness
  - Clarity

- `evaluateCoachingResponse()`: Scores coaching on:
  - Relevance
  - Personalization
  - Motivation
  - Actionability

All evaluations are logged to Opik for feedback tracking.

### 5. **Feedback Service** (`src/ml/feedback/`)

**Purpose**: User feedback collection and aggregation

**Methods**:
- `logResolutionFeedback()`: 1-5 star rating with optional feedback
- `logPlanFeedback()`: Multi-dimensional feedback (feasibility, clarity, motivation)
- `logProgressFeedback()`: Progress updates and difficulty tracking
- `logCoachingSessionFeedback()`: Session satisfaction ratings
- `aggregateFeedbackMetrics()`: Aggregate feedback over time periods

All feedback is logged to the original traces for correlation analysis.

### 6. **Python ML Model** (`rein-model/main.py`)

**Purpose**: Core ML pipeline with Opik integration

**Classes**:
- `ReinMLModel`: Main model with decorated methods for tracing

**Pipeline Stages**:
1. `preprocess_goal()` - Clarify and structure user goals
2. `generate_resolution()` - Create detailed resolution strategy
3. `create_execution_plan()` - Build week-by-week plan
4. `evaluate_resolution_quality()` - Score resolution quality
5. `generate_coaching_response()` - Adaptive coaching messages

**Key Features**:
- All methods decorated with `@track` for automatic Opik tracing
- Structured output classes for type safety
- Error handling and logging
- End-to-end pipeline execution

## Data Flow

### User Submission to Traces

```
User Input (Goal)
  ↓
Backend API (GeneratorController)
  ↓
Python ML Model (via subprocess or HTTP)
  ├─ preprocess_goal (@track)
  ├─ generate_resolution (@track)
  ├─ evaluate_resolution_quality (@track)
  ├─ create_execution_plan (@track)
  └─ Opik traces logged for each stage
  ↓
Evaluation Service
  ├─ Additional quality scoring
  └─ Logged to Opik
  ↓
Backend Storage (DB)
  └─ traceId stored with goal record
```

### Feedback Loop to Opik

```
User Feedback (Rating + Comments)
  ↓
FeedbackService
  ├─ Structure feedback data
  ├─ Attach to original trace
  └─ Log to Opik via OpikClientService
  ↓
Opik Platform
  ├─ Aggregate feedback
  ├─ Compute trends
  └─ Generate insights for improvement
```

## Integration Points

### 1. **Generator Module** (`src/generator/`)

Import and use in GeneratorService:

```typescript
import { LlmServiceWithTracing } from '../ml/llm/llm-service-with-tracing';
import { EvaluationService } from '../ml/evaluation/evaluation.service';
import { TracingService } from '../ml/tracing/tracing.service';

@Injectable()
export class GeneratorService {
  constructor(
    private llm: LlmServiceWithTracing,
    private evaluation: EvaluationService,
    private tracing: TracingService,
  ) {}

  async generateGoal(userInput: string) {
    return await this.tracing.traceGoalGeneration(userId, userInput, async () => {
      const preprocessed = await this.llm.generateContent(
        systemPrompt, 
        userInput
      );
      // ... rest of pipeline
    });
  }
}
```

### 2. **Resolution Module** (`src/resolution/`)

Use evaluation and feedback services:

```typescript
@Injectable()
export class ResolutionService {
  constructor(
    private evaluation: EvaluationService,
    private feedback: FeedbackService,
  ) {}

  async createResolution(goal: Goal): Promise<Resolution> {
    const resolution = await generateResolution(goal);
    
    // Evaluate quality
    const evalResult = await this.evaluation.evaluateResolution(
      goal.id,
      resolution
    );
    
    // Store with trace ID
    return { ...resolution, traceId: trace.id, qualityScore: evalResult.score };
  }

  async handleUserFeedback(resolutionId: string, rating: number) {
    const resolution = await this.getResolution(resolutionId);
    await this.feedback.logResolutionFeedback(
      resolution.goalId,
      resolution.traceId,
      { rating }
    );
  }
}
```

### 3. **Chat/Coaching Module** (`src/context/`)

Use LLM and feedback for coaching:

```typescript
@Injectable()
export class ContextService {
  constructor(
    private llm: LlmServiceWithTracing,
    private feedback: FeedbackService,
    private tracing: TracingService,
  ) {}

  async generateCoachingResponse(userId: string, query: string) {
    return await this.tracing.traceLlmCall('coaching', { model: 'gemini', prompt: query },
      async () => {
        const response = await this.llm.generateContent(systemPrompt, query);
        return response;
      }
    );
  }

  async logSessionFeedback(sessionId: string, feedback: any) {
    await this.feedback.logCoachingSessionFeedback(sessionId, userId, feedback);
  }
}
```

## Configuration

### Backend (.env)

Required environment variables in `rein-backend/.env`:

```
GEMINI_API_KEY=xxx
OPIK_API_KEY=xxx
OPIK_PROJECT_NAME=rein-ai-coaching
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2000
NODE_ENV=development
PORT=3000
```

### Python Model (.env)

Required environment variables in `rein-model/.env`:

```
GEMINI_API_KEY=xxx
OPIK_API_KEY=xxx
OPIK_PROJECT_NAME=rein-ai-coaching
PYTHONUNBUFFERED=1
```

## Monitoring & Observability

### Opik Dashboard

All operations are automatically logged to Opik at `https://app.opik.ai`:

- **Traces Tab**: View all operations with full execution details
- **Feedback Tab**: Review user feedback and ratings
- **Evaluation Metrics**: Track quality scores across operations
- **Experiments**: Compare different model versions or prompts

### Metrics to Track

1. **Resolution Quality**
   - Clarity, Specificity, Measurability, Actionability scores
   - Overall quality score (average)
   - Trend over time

2. **User Satisfaction**
   - Average rating (1-5)
   - Usefulness, Clarity, Motivation ratings
   - Feedback volume and sentiment

3. **Plan Feasibility**
   - Coherence, Feasibility, Progressiveness scores
   - Completion rates
   - User adjustments/deviations

4. **Coaching Effectiveness**
   - Response relevance scores
   - Personalization ratings
   - Session satisfaction

## Debugging

### Enable Detailed Logging

Set in `.env`:
```
LOG_LEVEL=debug
TRACE_LOGGING_ENABLED=true
```

### Common Issues

1. **No traces appearing in Opik**
   - Verify OPIK_API_KEY is correct
   - Check OPIK_PROJECT_NAME matches project in dashboard
   - Ensure OpikClientModule is imported in AppModule

2. **Traces missing metadata**
   - Verify metadata is passed to `startTrace()`
   - Check trace completion (endTrace must be called)

3. **LLM Generation Failures**
   - Verify GEMINI_API_KEY is correct
   - Check token limits
   - Review error in Opik trace

## Next Steps

1. **Integrate into existing modules**: Update Generator, Resolution, Context services
2. **Set up feedback collection**: Add feedback endpoints to controllers
3. **Configure Opik dashboards**: Set up custom views for key metrics
4. **Test end-to-end pipeline**: Verify tracing works through full flow
5. **Monitor and iterate**: Use Opik insights to improve prompts and evaluation

## References

- [Opik Documentation](https://docs.opik.ai)
- [Google Gemini API](https://ai.google.dev)
- [NestJS Documentation](https://docs.nestjs.com)
