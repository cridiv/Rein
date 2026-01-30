import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResolutionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, title: string, goal: string, roadmap: any) {
    return await this.prisma.resolution.create({
      data: {
        userId,
        title,
        goal,
        roadmap,
      },
    });
  }

  async findAllByUser(userId: string) {
    console.log('Finding resolution for userId:', userId);

    const data = await this.prisma.resolution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Query result:', { data });
    return data;
  }

  async findOne(id: string, userId?: string) {
    const whereCondition = userId
      ? {
          id,
          OR: [
            { userId },
            { isPublic: true },
          ],
        }
      : {
          id,
          isPublic: true,
        };

    return await this.prisma.resolution.findFirst({
      where: whereCondition,
    });
  }

  async delete(id: string, userId: string) {
    await this.prisma.resolution.delete({
      where: {
        id,
        userId,
      },
    });

    return { success: true };
  }

  async togglePublic(id: string, userId: string, isPublic: boolean) {
    await this.prisma.resolution.update({
      where: {
        id,
        userId,
      },
      data: {
        isPublic,
      },
    });

    return { success: true };
  }
}