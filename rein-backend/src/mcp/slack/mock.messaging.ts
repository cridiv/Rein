import { Injectable, Logger } from '@nestjs/common';
import { MessagingService } from '../../anchor/messaging.interface';

/**
 * Mock messaging service for testing without real Slack/Discord
 * Logs messages to console and returns fake message IDs
 */
@Injectable()
export class MockMessagingService implements MessagingService {
  private readonly logger = new Logger(MockMessagingService.name);

  async sendMessage(
    channel: string,
    text: string,
    richContent?: any,
  ): Promise<string> {
    // Generate a fake message ID
    const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log to console
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`📤 MOCK MESSAGE SENT`);
    this.logger.log(`   Channel: ${channel}`);
    this.logger.log(`   Message ID: ${messageId}`);
    this.logger.log(`   Text: ${text}`);
    if (richContent) {
      this.logger.log(`   Rich Content: ${JSON.stringify(richContent, null, 2)}`);
    }
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return messageId;
  }

  formatMention(userId: string): string {
    return `@${userId}`;
  }
}