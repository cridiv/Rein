import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Commitment,
  CreateCommitmentDto,
  Reminder,
  Escalation,
  CommitmentStatus,
  ReminderResponseType,
} from './types/anchor.types';

@Injectable()
export class AnchorStorage {
  private readonly logger = new Logger(AnchorStorage.name);

  constructor(private prisma: PrismaService) {}

  // ============================================
  // COMMITMENT OPERATIONS
  // ============================================

  async createCommitment(dto: CreateCommitmentDto): Promise<Commitment> {
    // Ensure that 'commitment' is a valid property on PrismaService.
    // If not, use the correct Prisma client import, e.g., `import { PrismaClient } from '@prisma/client'`
    // and use `prisma.commitment.create` directly.
    return (this.prisma as any).commitment.create({
      data: {
        userId: dto.userId,
        platformUserId: dto.platformUserId,
        commitmentText: dto.commitmentText,
        deadline: new Date(dto.deadline),
        context: dto.context,
        channelOrDm: dto.channelOrDm,
        status: CommitmentStatus.PENDING,
      },
      include: {
        reminders: true,
        escalations: true,
      },
    });
  }

  async getCommitment(id: string): Promise<Commitment | null> {
    return (this.prisma as any).commitment.findUnique({
      where: { id },
      include: {
        reminders: {
          orderBy: { sentAt: 'desc' },
        },
        escalations: {
          orderBy: { escalatedAt: 'desc' },
        },
      },
    });
  }

  async getAllCommitments(): Promise<Commitment[]> {
    return (this.prisma as any).commitment.findMany({
      include: {
        reminders: true,
        escalations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCommitmentsByUser(userId: string): Promise<Commitment[]> {
    return (this.prisma as any).commitment.findMany({
      where: { userId },
      include: {
        reminders: true,
        escalations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCommitmentStatus(
    id: string,
    status: CommitmentStatus,
  ): Promise<Commitment> {
    return (this.prisma as any).commitment.update({
      where: { id },
      data: { status },
      include: {
        reminders: true,
        escalations: true,
      },
    });
  }

  // ============================================
  // REMINDER OPERATIONS
  // ============================================

  async addReminder(
    commitmentId: string,
    messageId: string,
  ): Promise<Reminder> {
    return (this.prisma as any).reminder.create({
      data: {
        commitmentId,
        messageId,
        sentAt: new Date(),
      },
    });
  }

  async updateReminderResponse(
    reminderId: string,
    responseType: ReminderResponseType,
    responseText: string,
  ): Promise<Reminder> {
    return (this.prisma as any).reminder.update({
      where: { id: reminderId },
      data: {
        responseType,
        responseText,
        responseAt: new Date(),
      },
    });
  }

  async findReminderByMessageId(messageId: string): Promise<Reminder | null> {
    return (this.prisma as any).reminder.findFirst({
      where: { messageId },
    });
  }

  // ============================================
  // ESCALATION OPERATIONS
  // ============================================

  async addEscalation(
    commitmentId: string,
    reason: string,
    messageId: string,
  ): Promise<Escalation> {
    return (this.prisma as any).escalation.create({
      data: {
        commitmentId,
        reason,
        messageId,
        escalatedAt: new Date(),
      },
    });
  }

  async getEscalationCount(commitmentId: string): Promise<number> {
    return (this.prisma as any).escalation.count({
      where: { commitmentId },
    });
  }
}