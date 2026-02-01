import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  // Optional: Helper for cleaning up in tests
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && key[0] !== '_' && key[0] !== '$'
    );

    return Promise.all(
      models.map((modelKey) => (this[modelKey as string] as any).deleteMany())
    );
  }
}