import { Module } from '@nestjs/common';
import { McpSlackController } from './mcp-slack.controller';
import { McpSlackService } from './mcp-slack.service';
import { SlackAuthModule } from './auth/slack-auth.module';
import { AnchorModule } from '../../anchor/anchor.module';
import { SlackMessagingService } from './slack.messaging';

@Module({
  imports: [AnchorModule.forRoot(SlackMessagingService), SlackAuthModule],
  controllers: [McpSlackController],
  providers: [McpSlackService],
  exports: [McpSlackService],
})
export class McpSlackModule {}
