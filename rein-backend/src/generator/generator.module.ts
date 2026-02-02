import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { GoalPreprocessorService } from '../preprocessor/goal-preprocessor';
import { ContextModule } from '../context/context.module';

@Module({
  imports: [ContextModule],
  controllers: [GeneratorController],
  providers: [GoalPreprocessorService, GeneratorService],
})
export class GeneratorModule {}
