# ML Infrastructure Implementation Checklist

## ✅ Completed Components

- [x] **Opik Client Module** - Centralized Opik client service
- [x] **Tracing Decorators** - `@Trace()` and `@TraceSpan()` decorators
- [x] **Tracing Service** - High-level tracing patterns
- [x] **LLM Service with Tracing** - Gemini integration with Opik
- [x] **Evaluation Service** - LLM-based evaluation of generated content
- [x] **Feedback Service** - User feedback collection and aggregation
- [x] **Python ML Model** - Core pipeline with @track decorators
- [x] **Dependencies** - Updated package.json with required packages
- [x] **Environment Configuration** - .env.example files
- [x] **Documentation** - ML_INFRASTRUCTURE.md guide

## 📋 Integration Checklist (Next Steps)

### 1. Import ML Infrastructure Module

**File**: `src/app.module.ts`

```typescript
import { MlInfrastructureModule } from './ml/ml-infrastructure.module';

@Module({
  imports: [
    // ... other modules
    MlInfrastructureModule,
  ],
  // ... rest of module config
})
export class AppModule {}
```

### 2. Update Generator Service

**File**: `src/generator/generator.service.ts`

- [ ] Inject `LlmServiceWithTracing` 
- [ ] Replace existing LLM calls with traced versions
- [ ] Use `TracingService.traceGoalGeneration()` for pipeline
- [ ] Ensure trace IDs are stored with goals

### 3. Update Resolution Service

**File**: `src/resolution/resolution.service.ts`

- [ ] Inject `EvaluationService` and `FeedbackService`
- [ ] Call `evaluateResolution()` after generation
- [ ] Store trace IDs with resolutions
- [ ] Add trace ID to database schema if not present

### 4. Update Generator Controller

**File**: `src/generator/generator.controller.ts`

- [ ] Add endpoint for resolution feedback
- [ ] Call `FeedbackService.logResolutionFeedback()`
- [ ] Return trace IDs in responses

### 5. Update Resolution Controller

**File**: `src/resolution/resolution.controller.ts`

- [ ] Add feedback submission endpoint
- [ ] Add metrics aggregation endpoint
- [ ] Use example code from `examples.ts`

### 6. Database Schema Updates

- [ ] Add `traceId` column to `resolutions` table
- [ ] Add `traceId` column to `plans` table
- [ ] Add `traceId` column to `coaching_sessions` table (if exists)
- [ ] Create `feedback` table to store user ratings
- [ ] Create `evaluation_metrics` table to cache scores

**Migration Example**:
```sql
ALTER TABLE resolutions ADD COLUMN trace_id VARCHAR(255);
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  goal_id UUID REFERENCES goals(id),
  trace_id VARCHAR(255),
  rating SMALLINT,
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Environment Setup

- [ ] Copy `.env.example` to `.env` in rein-backend
- [ ] Copy `.env.example` to `.env` in rein-model
- [ ] Fill in API keys:
  - [ ] `OPIK_API_KEY` from https://app.opik.ai
  - [ ] `GEMINI_API_KEY` from Google AI Studio
  - [ ] Database and Redis URLs
- [ ] Verify all services can connect

### 8. Python ML Model Setup

**In `rein-model/`**:

- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Test main.py: `python main.py`
- [ ] Set up as subprocess or HTTP service from NestJS
- [ ] Add error handling for model failures

**Option A - Subprocess** (simpler, same machine):
```typescript
import { spawn } from 'child_process';

const subprocess = spawn('python', ['path/to/rein-model/main.py']);
```

**Option B - HTTP Service** (more scalable):
```python
# Add to main.py
from fastapi import FastAPI
app = FastAPI()

@app.post("/preprocess")
async def preprocess_endpoint(goal: str):
    model = ReinMLModel()
    return model.preprocess_goal(goal, {})

# Run: uvicorn main:app --port 8000
```

Then call from NestJS:
```typescript
const response = await fetch('http://localhost:8000/preprocess', {
  method: 'POST',
  body: JSON.stringify({ goal })
});
```

### 9. Testing

- [ ] Test Opik trace creation (check Opik dashboard)
- [ ] Test LLM calls are traced
- [ ] Test evaluation scoring
- [ ] Test feedback logging
- [ ] Test error traces
- [ ] Verify metadata in traces
- [ ] Verify all trace IDs match

**Manual Test**:
```bash
curl -X POST http://localhost:3000/api/goals/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "goalDescription": "Run a 5K",
    "context": {"experience_level": "beginner"}
  }'
```

Then check https://app.opik.ai for traces.

### 10. Monitoring & Dashboards

- [ ] Set up Opik project
- [ ] Create custom views in Opik for:
  - [ ] Resolution quality scores
  - [ ] User satisfaction ratings
  - [ ] Feedback trends
  - [ ] Error rates
- [ ] Set up alerts for low scores
- [ ] Create reports for stakeholders

### 11. Documentation Updates

- [ ] Update API documentation with trace IDs in responses
- [ ] Document feedback endpoints
- [ ] Add examples to README
- [ ] Document debugging procedures

### 12. Performance & Optimization

- [ ] Measure trace overhead (should be <5%)
- [ ] Batch feedback logging if needed
- [ ] Cache evaluation results
- [ ] Optimize token estimation
- [ ] Add rate limiting if needed

## Troubleshooting

### Issue: No traces in Opik dashboard

**Check**:
1. OPIK_API_KEY is set and correct
2. OpikClientModule is imported in AppModule
3. Opik service is being injected correctly
4. endTrace() is being called
5. Network access to Opik API

**Debug**:
```typescript
// Add logging
constructor(private opik: OpikClientService) {
  console.log('OpikClientService injected');
}

// Check client initialization
const client = this.opik.getClient();
console.log('Client initialized:', client);
```

### Issue: JSON parsing errors in LLM responses

**Check**:
1. Response contains valid JSON
2. Regex extraction is working
3. LLM hasn't changed response format

**Debug**:
```typescript
const response = await model.generateContent(prompt);
console.log('Raw response:', response.text);
console.log('JSON extraction attempted');
```

### Issue: Feedback not reaching Opik

**Check**:
1. Trace ID matches original trace
2. Feedback service is injected
3. logFeedback() is being called
4. No exceptions during feedback submission

## Resources

- [Opik Documentation](https://docs.opik.ai)
- [Gemini API Docs](https://ai.google.dev/api)
- [NestJS Documentation](https://docs.nestjs.com)
- [Python Opik SDK](https://pypi.org/project/opik/)

## Support

For questions or issues:
1. Check ML_INFRASTRUCTURE.md for detailed info
2. Review example code in examples.ts
3. Check Opik dashboard for trace details
4. Review logs with `LOG_LEVEL=debug`
