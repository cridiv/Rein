import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { MessagingService } from '../../anchor/messaging.interface';

/**
 * Simple Slack messaging service using bot token
 * For development/testing - no OAuth required
 */
@Injectable()
export class SlackMessagingService implements MessagingService {
  private readonly logger = new Logger(SlackMessagingService.name);
  private readonly botToken: string;

  constructor() {
    // Use your bot token directly
    this.botToken = process.env.SLACK_BOT_TOKEN!; // Set this in your .env
    
    if (!this.botToken) {
      throw new Error('SLACK_BOT_TOKEN environment variable is required');
    }

    this.logger.log('Slack messaging service initialized (Bot Token mode)');
  }

  async sendMessage(
    channel: string,
    text: string,
    richContent?: any,
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.postMessage',
        {
          channel,
          text,
          blocks: richContent?.blocks, // Optional rich content
        },
        {
          headers: {
            'Authorization': `Bearer ${this.botToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      if (!response.data.ok) {
        throw new Error(`Slack API error: ${response.data.error}`);
      }

      return response.data.ts; // Slack message timestamp as ID
    } catch (error) {
      this.logger.error('Failed to send Slack message', error);
      throw error;
    }
  }

  formatMention(userId: string): string {
    return `<@${userId}>`;
  }
}