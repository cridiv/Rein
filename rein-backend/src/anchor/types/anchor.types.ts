export enum CommitmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked',
  OVERDUE = 'overdue',
  ESCALATED = 'escalated',
}

export enum ReminderResponseType {
  DONE = 'done',
  WORKING = 'working',
  BLOCKED = 'blocked',
  NO_RESPONSE = 'no_response',
}

export interface Commitment {
  id: string;
  userId: string;
  platformUserId?: string; // Slack user ID, Discord ID, etc.
  commitmentText: string;
  deadline: Date;
  context?: string;
  channelOrDm: string;
  createdAt: Date;
  status: CommitmentStatus;
  reminders?: Reminder[];
  escalations?: Escalation[];
}

export interface Reminder {
  id: string;
  commitmentId: string;
  sentAt: Date;
  messageId: string; // Platform's message ID
  responseType?: ReminderResponseType;
  responseText?: string;
  responseAt?: Date;
}

export interface Escalation {
  id: string;
  commitmentId: string;
  escalatedAt: Date;
  reason: string;
  messageId: string;
}

export interface CreateCommitmentDto {
  userId: string;
  platformUserId?: string;
  commitmentText: string;
  deadline: string; // ISO string, will be converted to Date
  context?: string;
  channelOrDm: string;
}

export interface SendReminderDto {
  commitmentId: string;
}

export interface CollectResponseDto {
  commitmentId: string;
  responseText: string;
  messageId: string; // Platform message ID to match with reminder
}

export interface EscalateDto {
  commitmentId: string;
  reason?: string;
}

export interface CreateCommitmentResponse {
  success: boolean;
  commitmentId?: string;
  message: string;
}

export interface SendReminderResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

export interface CollectResponseResponse {
  success: boolean;
  message: string;
  parsedResponse?: ReminderResponseType;
}

export interface ReminderStatusResponse {
  success: boolean;
  commitmentId: string;
  status: CommitmentStatus;
  totalReminders: number;
  respondedReminders: number;
  pendingReminders: number;
  latestResponse?: {
    type: ReminderResponseType;
    text: string;
    at: Date;
  };
}

export interface EscalateResponse {
  success: boolean;
  message: string;
  escalationCount?: number;
}