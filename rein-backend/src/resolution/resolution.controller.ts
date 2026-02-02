import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ResolutionService } from './resolution.service';

@Controller('resolution')
export class ResolutionController {
  constructor(private readonly resolutionService: ResolutionService,) {}

  @Post()
  async create(@Body() body: { userId: string; title: string; goal: string; roadmap: any }) {
    const { userId, title, goal, roadmap } = body;
    return this.resolutionService.create(userId, title, goal, roadmap);
  }

  @Get('user/:userId')
  async getAllByUser(@Param('userId') userId: string) {
    return this.resolutionService.findAllByUser(userId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Query('userId') userId?: string) {
    const resolution = await this.resolutionService.findOne(id, userId);
    if (!resolution) {
      throw new NotFoundException('Resolution not found');
    }
    return resolution;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    return this.resolutionService.delete(id, userId);
  }

  @Patch(':id/public')
  async togglePublic(@Param('id') id: string, @Body() body: { userId: string; isPublic: boolean }) {
    return this.resolutionService.togglePublic(id, body.userId, body.isPublic);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string, @Query('userId') userId?: string) {
    const stats = await this.resolutionService.getResolutionStats(id, userId);
    if (!stats) {
      throw new NotFoundException('Resolution not found');
    }
    return stats;
  }

  @Get(':id/tasks')
  async getTasks(@Param('id') id: string, @Query('userId') userId?: string) {
    const tasks = await this.resolutionService.getResolutionTasks(id, userId);
    if (!tasks) {
      throw new NotFoundException('Resolution not found');
    }
    return tasks;
  }

  @Get(':id/tasks/upcoming')
  async getUpcomingTasks(@Param('id') id: string, @Query('userId') userId?: string, @Query('limit') limit?: string) {
    const tasks = await this.resolutionService.getUpcomingTasks(id, userId, limit ? parseInt(limit) : 5);
    if (!tasks) {
      throw new NotFoundException('Resolution not found');
    }
    return tasks;
  }

  @Patch(':id/tasks/:taskId')
  async updateTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body() body: { userId: string; completed: boolean },
  ) {
    return this.resolutionService.updateTaskStatus(id, taskId, body.userId, body.completed);
  }
}