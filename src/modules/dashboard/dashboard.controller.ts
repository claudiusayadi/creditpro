import { Controller, Delete, Get, Query } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/roles.enum';
import { DashboardService } from './dashboard.service';
import type {
  IDashboardAnalytics,
  IDashboardOverview,
  IRecentActivity,
} from './interfaces/dashboard-stats.interface';

@Roles(UserRole.ADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get dashboard overview',
    description:
      'Retrieves comprehensive statistics for all modules including blogs, events, careers, contacts, media, resources, users, and categories.',
  })
  @ApiOkResponse({
    description: 'Dashboard overview statistics retrieved successfully',
    type: 'object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  @Get('overview')
  async getOverview(): Promise<IDashboardOverview> {
    return this.dashboardService.getOverview();
  }

  @ApiOperation({
    summary: 'Get dashboard analytics',
    description:
      'Retrieves analytics and trend data including content creation trends over the last 6 months and engagement metrics.',
  })
  @ApiOkResponse({
    description: 'Dashboard analytics retrieved successfully',
    type: 'object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  @Get('analytics')
  async getAnalytics(): Promise<IDashboardAnalytics> {
    return this.dashboardService.getAnalytics();
  }

  @ApiOperation({
    summary: 'Get recent activity',
    description:
      'Retrieves recent activity across all modules including latest blogs, contacts, events, and users.',
  })
  @ApiOkResponse({
    description: 'Recent activity retrieved successfully',
    type: 'object',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  @Get('recent-activity')
  async getRecentActivity(
    @Query('limit') limit?: string,
  ): Promise<IRecentActivity> {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.dashboardService.getRecentActivity(parsedLimit);
  }

  @ApiOperation({
    summary: 'Clear dashboard cache',
    description:
      'Manually clear all dashboard caches to force fresh data retrieval. Use this after bulk data changes. Admin only.',
  })
  @ApiNoContentResponse({ description: 'Dashboard cache cleared successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  @Delete('cache')
  async clearCache(): Promise<void> {
    return this.dashboardService.clearCache();
  }
}
