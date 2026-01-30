import { Module } from '@nestjs/common';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { GoalPreprocessorService } from '../preprocessor/goal-preprocessor';

@Module({
  controllers: [GeneratorController],
  providers: [GoalPreprocessorService, GeneratorService],
})
export class GeneratorModule {}
