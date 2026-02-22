import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ActivityService } from './activity.service';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @MessagePattern({ cmd: 'log_activity' })
  async logActivity(@Payload() data: any) {
    return this.activityService.logActivity(data);
  }

  @MessagePattern({ cmd: 'get_recent_activity' })
  async getRecentActivity(@Payload() limit: number = 10) {
    return this.activityService.getRecentActivity(limit);
  }
}
