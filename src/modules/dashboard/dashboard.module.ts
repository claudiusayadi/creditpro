import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Blog } from '../blogs/entities/blog.entity';
import { Career } from '../careers/entities/career.entity';
import { Category } from '../categories/entities/category.entity';
import { Contact } from '../contact/entities/contact.entity';
import { Event } from '../events/entities/event.entity';
import { Media } from '../media/entities/media.entity';
import { Resource } from '../resources/entities/resource.entity';
import { User } from '../users/entities/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Career,
      Category,
      Contact,
      Event,
      Media,
      Resource,
      User,
    ]),
    CacheModule.register({
      ttl: 300000, // 5 minutes
      max: 100, // Maximum number of items in cache
    }),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
