import { Module } from '@nestjs/common';
import { SlackAuthController } from './slack-auth.controller';
import { SlackAuthService } from './slack-auth.service';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlackAuthController],
  providers: [SlackAuthService],
  exports: [SlackAuthService],
})
export class SlackAuthModule {}