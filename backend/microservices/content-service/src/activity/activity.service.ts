import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async logActivity(data: {
    action: string;
    entityType: string;
    entityId: string;
    entityTitle: string;
    userId: string;
    userName?: string;
  }): Promise<Activity> {
    const activity = this.activityRepository.create(data);
    return this.activityRepository.save(activity);
  }

  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    return this.activityRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
