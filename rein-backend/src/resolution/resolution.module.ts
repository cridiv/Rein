import { Module } from '@nestjs/common';
import { ResolutionService } from './resolution.service';
import { ResolutionController } from './resolution.controller';
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [ResolutionService],
  controllers: [ResolutionController],
})
export class ResolutionModule {}