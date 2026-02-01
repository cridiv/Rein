/**
 * Simple messaging interface that any platform (Slack, Discord, SMS) must implement
 */
export interface MessagingService {
  /**
   * Send a message to a channel or DM
   * @param channel - Channel ID or DM ID
   * @param text - Plain text message
   * @param richContent - Optional platform-specific rich content (Slack blocks, Discord embeds, etc.)
   * @returns Platform's message ID (Slack ts, Discord message ID, etc.)
   */
  sendMessage(
    channel: string,
    text: string,
    richContent?: any,
  ): Promise<string>;

  /**
   * Format a user mention for the platform
   * @param userId - User ID on the platform
   * @returns Formatted mention string (e.g., "<@U12345>" for Slack)
   */
  formatMention(userId: string): string;
}

export const MESSAGING_SERVICE = Symbol('MESSAGING_SERVICE');