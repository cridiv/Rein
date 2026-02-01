import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { MessagingService } from '../../anchor/messaging.interface';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Slack messaging service - now uses per-user tokens from OAuth
 */
@Injectable()
export class SlackMessagingService implements MessagingService {
  private readonly logger = new Logger(SlackMessagingService.name);

  constructor(private readonly prisma: PrismaService) {
    this.logger.log('Slack messaging service initialized (OAuth mode)');
  }

  async sendMessage(
    channel: string,
    text: string,
    richContent?: any,
  ): Promise<string> {
    // Extract userId from richContent or require it
    const userId = richContent?.userId;
    if (!userId) {
      throw new Error('userId required in richContent for OAuth messaging');
    }

    // Get user's Slack connection
    const connection = await this.prisma.slackConnection.findUnique({
      where: { userId },
    });

    if (!connection) {
      throw new Error(
        `User ${userId} has not connected their Slack account. Please connect at /auth/slack/connect?userId=${userId}`,
      );
    }

    try {
      // Create axios client with USER'S token
      const client = axios.create({
        baseURL: 'https://slack.com/api',
        headers: {
          Authorization: `Bearer ${connection.botAccessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      // Build Slack blocks if rich content is provided
      const blocks = richContent
        ? this.buildSlackBlocks(richContent)
        : undefined;

      // Use user's Slack user ID as the DM channel (or provided channel)
      const targetChannel = channel || connection.slackUserId;

      const response = await client.post('/chat.postMessage', {
        channel: targetChannel,
        text,
        blocks,
      });

      if (!response.data.ok) {
        throw new Error(
          response.data.error || 'Failed to send Slack message',
        );
      }

      this.logger.log(
        `Sent Slack message to ${targetChannel} for user ${userId}: ${response.data.ts}`,
      );
      return response.data.ts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Slack API error: ${error.message}`);
        throw new Error(`Slack API error: ${error.message}`);
      }
      throw error;
    }
  }

  formatMention(userId: string): string {
    return `<@${userId}>`;
  }

  private buildSlackBlocks(richContent: any): any[] {
    if (richContent.type === 'reminder') {
      return [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Commitment:* ${richContent.commitmentText}\n*Deadline:* ${richContent.deadline}${richContent.context ? `\n*Context:* ${richContent.context}` : ''}\n\n*What's the status?*`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: 'Reply with: `done`, `working`, or `blocked: <reason>`',
            },
          ],
        },
      ];
    }

    if (richContent.type === 'escalation') {
      return [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🚨 *ESCALATION*\n\n*Commitment:* ${richContent.commitmentText}\n*Deadline:* ${richContent.deadline}\n*Unanswered reminders:* ${richContent.unansweredCount}\n\n*This requires immediate attention.*`,
          },
        },
      ];
    }

    return [];
  }
}