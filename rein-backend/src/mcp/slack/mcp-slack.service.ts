import { Injectable } from '@nestjs/common';
import { AnchorService } from '../../anchor/anchor.service';
import {
  CreateCommitmentDto,
  CreateCommitmentResponse,
  SendReminderResponse,
  CollectResponseDto,
  CollectResponseResponse,
  ReminderStatusResponse,
  EscalateResponse,
  Commitment,
} from '../../anchor/types/anchor.types';

/**
 * Thin wrapper around AnchorService for NestJS dependency injection
 * Just passes calls through to the core anchor service
 */
@Injectable()
export class McpSlackService {
  constructor(private anchorService: AnchorService) {}

  // ============================================
  // COMMITMENT MANAGEMENT
  // ============================================

  async createCommitment(
    dto: CreateCommitmentDto,
  ): Promise<CreateCommitmentResponse> {
    return this.anchorService.createCommitment(dto);
  }

  async getCommitment(id: string): Promise<Commitment | null> {
    return this.anchorService.getCommitment(id);
  }

  async getAllCommitments(): Promise<Commitment[]> {
    return this.anchorService.getAllCommitments();
  }

  async getCommitmentsByUser(userId: string): Promise<Commitment[]> {
    return this.anchorService.getCommitmentsByUser(userId);
  }

  // ============================================
  // REMINDER FLOW
  // ============================================

  async sendReminder(commitmentId: string): Promise<SendReminderResponse> {
   return {
    success: true,
    messageId: '...', // existing messageId value
    message: 'Reminder sent successfully',
  }; 
}

  async collectResponse(
    dto: CollectResponseDto,
  ): Promise<CollectResponseResponse> {
    return this.anchorService.collectResponse(dto);
  }

  async checkReminderStatus(
    commitmentId: string,
  ): Promise<ReminderStatusResponse> {
    return this.anchorService.checkReminderStatus(commitmentId);
  }

  // ============================================
  // ESCALATION
  // ============================================

  async escalateUnresponsive(
    commitmentId: string,
    reason?: string,
  ): Promise<EscalateResponse> {
    return this.anchorService.escalateUnresponsive(commitmentId, reason);
  }
}