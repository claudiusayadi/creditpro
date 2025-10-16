import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bytes from 'bytes';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { Blog } from '../blogs/entities/blog.entity';
import { Career } from '../careers/entities/career.entity';
import { Category } from '../categories/entities/category.entity';
import { Contact } from '../contact/entities/contact.entity';
import { ContactStatus } from '../contact/enums/contact-status.enum';
import { Event } from '../events/entities/event.entity';
import { Media } from '../media/entities/media.entity';
import { MediaType } from '../media/interfaces/media.interface';
import { Resource } from '../resources/entities/resource.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/roles.enum';
import type {
  IBlogStats,
  ICareerStats,
  ICategoryStats,
  IContactStats,
  IDashboardAnalytics,
  IDashboardOverview,
  IEventStats,
  IMediaStats,
  IRecentActivity,
  IResourceStats,
  IUserStats,
} from './interfaces/dashboard-stats.interface';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly CACHE_KEYS = {
    OVERVIEW: 'dashboard:overview',
    ANALYTICS: 'dashboard:analytics',
    RECENT_ACTIVITY: 'dashboard:recent-activity',
    BLOG_STATS: 'dashboard:blog-stats',
    EVENT_STATS: 'dashboard:event-stats',
    CAREER_STATS: 'dashboard:career-stats',
    RESOURCE_STATS: 'dashboard:resource-stats',
    USER_STATS: 'dashboard:user-stats',
  };

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Career)
    private readonly careerRepo: Repository<Career>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getOverview(): Promise<IDashboardOverview> {
    const cached = await this.cacheManager.get<IDashboardOverview>(
      this.CACHE_KEYS.OVERVIEW,
    );

    if (cached) {
      this.logger.debug('Returning cached dashboard overview');
      return cached;
    }

    this.logger.log('Generating fresh dashboard overview');

    const [
      blogs,
      events,
      careers,
      contacts,
      media,
      resources,
      users,
      categories,
    ] = await Promise.all([
      this.getBlogStats(),
      this.getEventStats(),
      this.getCareerStats(),
      this.getContactStats(),
      this.getMediaStats(),
      this.getResourceStats(),
      this.getUserStats(),
      this.getCategoryStats(),
    ]);

    const overview: IDashboardOverview = {
      blogs,
      events,
      careers,
      contacts,
      media,
      resources,
      users,
      categories,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.OVERVIEW,
      overview,
      this.CACHE_TTL,
    );

    return overview;
  }

  async getBlogStats(): Promise<IBlogStats> {
    const cached = await this.cacheManager.get<IBlogStats>(
      this.CACHE_KEYS.BLOG_STATS,
    );

    if (cached) return cached;

    const [total, published, draft, byCategory] = await Promise.all([
      this.blogRepo.count(),
      this.blogRepo.count({ where: { published: true } }),
      this.blogRepo.count({ where: { published: false } }),
      this.blogRepo
        .createQueryBuilder('blog')
        .select('category.name', 'category')
        .addSelect('COUNT(blog.id)', 'count')
        .leftJoin('blog.category', 'category')
        .groupBy('category.id')
        .addGroupBy('category.name')
        .getRawMany<{ category: string | null; count: string }>()
        .then((results) =>
          results.map((r) => ({
            category: r.category || 'Uncategorized',
            count: parseInt(r.count, 10),
          })),
        ),
    ]);

    const stats: IBlogStats = {
      total,
      published,
      draft,
      byCategory,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.BLOG_STATS,
      stats,
      this.CACHE_TTL,
    );
    return stats;
  }

  async getEventStats(): Promise<IEventStats> {
    const cached = await this.cacheManager.get<IEventStats>(
      this.CACHE_KEYS.EVENT_STATS,
    );

    if (cached) return cached;

    const now = new Date();

    const [total, published, draft, upcoming, past, featured] =
      await Promise.all([
        this.eventRepo.count(),
        this.eventRepo.count({ where: { published: true } }),
        this.eventRepo.count({ where: { published: false } }),
        this.eventRepo
          .createQueryBuilder('event')
          .where('event.published = :published', { published: true })
          .andWhere('event.start_date > :now', { now })
          .getCount(),
        this.eventRepo
          .createQueryBuilder('event')
          .where('event.published = :published', { published: true })
          .andWhere('event.end_date < :now', { now })
          .getCount(),
        this.eventRepo.count({ where: { featured: true } }),
      ]);

    const stats: IEventStats = {
      total,
      published,
      draft,
      upcoming,
      past,
      featured,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.EVENT_STATS,
      stats,
      this.CACHE_TTL,
    );
    return stats;
  }

  async getCareerStats(): Promise<ICareerStats> {
    const cached = await this.cacheManager.get<ICareerStats>(
      this.CACHE_KEYS.CAREER_STATS,
    );

    if (cached) return cached;

    const now = new Date();

    const [total, active, expired] = await Promise.all([
      this.careerRepo.count(),
      this.careerRepo
        .createQueryBuilder('career')
        .where('career.deadline > :now', { now })
        .getCount(),
      this.careerRepo
        .createQueryBuilder('career')
        .where('career.deadline <= :now', { now })
        .getCount(),
    ]);

    const stats: ICareerStats = {
      total,
      active,
      expired,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.CAREER_STATS,
      stats,
      this.CACHE_TTL,
    );
    return stats;
  }

  async getContactStats(): Promise<IContactStats> {
    const [total, newCount, read, replied, archived] = await Promise.all([
      this.contactRepo.count(),
      this.contactRepo.count({ where: { status: ContactStatus.NEW } }),
      this.contactRepo.count({ where: { status: ContactStatus.READ } }),
      this.contactRepo.count({ where: { status: ContactStatus.REPLIED } }),
      this.contactRepo.count({ where: { status: ContactStatus.ARCHIVED } }),
    ]);

    return {
      total,
      new: newCount,
      read,
      replied,
      archived,
    };
  }

  async getMediaStats(): Promise<IMediaStats> {
    const [total, images, documents, pdfs, sizeResult] = await Promise.all([
      this.mediaRepo.count(),
      this.mediaRepo.count({ where: { type: MediaType.IMAGE } }),
      this.mediaRepo.count({ where: { type: MediaType.DOCUMENT } }),
      this.mediaRepo.count({ where: { type: MediaType.PDF } }),
      this.mediaRepo
        .createQueryBuilder('media')
        .select('SUM(media.size)', 'totalSize')
        .getRawOne<{ totalSize: string }>(),
    ]);

    const totalSize = parseInt(sizeResult?.totalSize ?? '0', 10);

    return {
      total,
      images,
      documents,
      pdfs,
      totalSize,
      totalSizeFormatted: bytes(totalSize) ?? '0 B',
    };
  }

  async getResourceStats(): Promise<IResourceStats> {
    const cached = await this.cacheManager.get<IResourceStats>(
      this.CACHE_KEYS.RESOURCE_STATS,
    );

    if (cached) return cached;

    const [total, published, draft, byCategory, byType, topDownloads] =
      await Promise.all([
        this.resourceRepo.count(),
        this.resourceRepo.count({ where: { published: true } }),
        this.resourceRepo.count({ where: { published: false } }),
        this.resourceRepo
          .createQueryBuilder('resource')
          .select('category.name', 'category')
          .addSelect('COUNT(resource.id)', 'count')
          .leftJoin('resource.category', 'category')
          .groupBy('category.id')
          .addGroupBy('category.name')
          .getRawMany<{ category: string | null; count: string }>()
          .then((results) =>
            results.map((r) => ({
              category: r.category || 'Uncategorized',
              count: parseInt(r.count, 10),
            })),
          ),
        this.resourceRepo
          .createQueryBuilder('resource')
          .select('resource.type', 'type')
          .addSelect('COUNT(resource.id)', 'count')
          .groupBy('resource.type')
          .getRawMany<{ type: string; count: string }>()
          .then((results) =>
            results.map((r) => ({
              type: r.type,
              count: parseInt(r.count, 10),
            })),
          ),
        this.resourceRepo
          .createQueryBuilder('resource')
          .select(['resource.id', 'resource.title', 'resource.download_count'])
          .orderBy('resource.download_count', 'DESC')
          .limit(10)
          .getMany()
          .then((resources) =>
            resources.map((r) => ({
              id: r.id,
              title: r.title,
              downloads: r.download_count,
            })),
          ),
      ]);

    const stats: IResourceStats = {
      total,
      published,
      draft,
      byCategory,
      byType,
      topDownloads,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.RESOURCE_STATS,
      stats,
      this.CACHE_TTL,
    );
    return stats;
  }

  async getUserStats(): Promise<IUserStats> {
    const cached = await this.cacheManager.get<IUserStats>(
      this.CACHE_KEYS.USER_STATS,
    );

    if (cached) return cached;

    const [total, admins, users, inactive] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: { role: UserRole.ADMIN } }),
      this.userRepo.count({ where: { role: UserRole.USER } }),
      this.userRepo.count({ where: { verified: false } }),
    ]);

    const stats: IUserStats = {
      total,
      admins,
      users,
      active: total - inactive,
      inactive,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.USER_STATS,
      stats,
      this.CACHE_TTL,
    );
    return stats;
  }

  async getCategoryStats(): Promise<ICategoryStats> {
    const [total, withBlogs, withResources] = await Promise.all([
      this.categoryRepo.count(),
      this.categoryRepo
        .createQueryBuilder('category')
        .innerJoin('category.blogs', 'blog')
        .select('COUNT(DISTINCT category.id)', 'count')
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0', 10)),
      this.categoryRepo
        .createQueryBuilder('category')
        .innerJoin('category.resources', 'resource')
        .select('COUNT(DISTINCT category.id)', 'count')
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0', 10)),
    ]);

    return {
      total,
      withBlogs,
      withResources,
    };
  }

  async getRecentActivity(limit: number = 5): Promise<IRecentActivity> {
    const cached = await this.cacheManager.get<IRecentActivity>(
      this.CACHE_KEYS.RECENT_ACTIVITY,
    );

    if (cached) return cached;

    const [blogs, contacts, events, users] = await Promise.all([
      this.blogRepo
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.author', 'author')
        .orderBy('blog.registry.createdAt', 'DESC')
        .limit(limit)
        .getMany()
        .then((items) =>
          items.map((b) => ({
            id: b.id,
            title: b.title,
            createdAt: b.registry.createdAt,
            author: b.author?.name ?? 'Unknown',
          })),
        ),
      this.contactRepo
        .createQueryBuilder('contact')
        .orderBy('contact.registry.createdAt', 'DESC')
        .limit(limit)
        .getMany()
        .then((items) =>
          items.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            createdAt: c.registry.createdAt,
            status: c.status,
          })),
        ),
      this.eventRepo
        .createQueryBuilder('event')
        .orderBy('event.registry.createdAt', 'DESC')
        .limit(limit)
        .getMany()
        .then((items) =>
          items.map((e) => ({
            id: e.id,
            title: e.title,
            startDate: e.start_date,
            status: e.published ? 'Published' : 'Draft',
          })),
        ),
      this.userRepo
        .createQueryBuilder('user')
        .orderBy('user.registry.createdAt', 'DESC')
        .limit(limit)
        .getMany()
        .then((items) =>
          items.map((u) => ({
            id: u.id,
            name: u.name ?? 'Unknown',
            email: u.email,
            createdAt: u.registry.createdAt,
          })),
        ),
    ]);

    const activity: IRecentActivity = {
      blogs,
      contacts,
      events,
      users,
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.RECENT_ACTIVITY,
      activity,
      this.CACHE_TTL,
    );

    return activity;
  }

  async getAnalytics(): Promise<IDashboardAnalytics> {
    const cached = await this.cacheManager.get<IDashboardAnalytics>(
      this.CACHE_KEYS.ANALYTICS,
    );

    if (cached) return cached;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [blogTrends, eventTrends, resourceTrends, topResources] =
      await Promise.all([
        this.blogRepo
          .createQueryBuilder('blog')
          .select("TO_CHAR(blog.registry.createdAt, 'YYYY-MM')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('blog.registry.createdAt >= :date', { date: sixMonthsAgo })
          .groupBy('month')
          .orderBy('month', 'ASC')
          .getRawMany<{ month: string; count: string }>(),
        this.eventRepo
          .createQueryBuilder('event')
          .select("TO_CHAR(event.registry.createdAt, 'YYYY-MM')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('event.registry.createdAt >= :date', { date: sixMonthsAgo })
          .groupBy('month')
          .orderBy('month', 'ASC')
          .getRawMany<{ month: string; count: string }>(),
        this.resourceRepo
          .createQueryBuilder('resource')
          .select("TO_CHAR(resource.registry.createdAt, 'YYYY-MM')", 'month')
          .addSelect('COUNT(*)', 'count')
          .where('resource.registry.createdAt >= :date', {
            date: sixMonthsAgo,
          })
          .groupBy('month')
          .orderBy('month', 'ASC')
          .getRawMany<{ month: string; count: string }>(),
        this.resourceRepo
          .createQueryBuilder('resource')
          .select(['resource.id', 'resource.title', 'resource.download_count'])
          .orderBy('resource.download_count', 'DESC')
          .limit(5)
          .getMany(),
      ]);

    const monthsMap = new Map<
      string,
      { blogs: number; events: number; resources: number }
    >();

    blogTrends.forEach((t) => {
      monthsMap.set(t.month, {
        blogs: parseInt(t.count, 10),
        events: 0,
        resources: 0,
      });
    });

    eventTrends.forEach((t) => {
      const existing = monthsMap.get(t.month) || {
        blogs: 0,
        events: 0,
        resources: 0,
      };
      monthsMap.set(t.month, { ...existing, events: parseInt(t.count, 10) });
    });

    resourceTrends.forEach((t) => {
      const existing = monthsMap.get(t.month) || {
        blogs: 0,
        events: 0,
        resources: 0,
      };
      monthsMap.set(t.month, {
        ...existing,
        resources: parseInt(t.count, 10),
      });
    });

    const monthly = Array.from(monthsMap.entries()).map(([month, data]) => ({
      month,
      ...data,
    }));

    const [recentContacts, activeUsers] = await Promise.all([
      this.contactRepo
        .createQueryBuilder('contact')
        .where('contact.registry.createdAt >= :date', {
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        })
        .getCount(),
      this.userRepo.count({ where: { verified: true } }),
    ]);

    const analytics: IDashboardAnalytics = {
      contentTrends: {
        monthly,
      },
      engagement: {
        topResources: topResources.map((r) => ({
          id: r.id,
          title: r.title,
          downloads: r.download_count,
        })),
        recentContacts,
        activeUsers,
      },
    };

    await this.cacheManager.set(
      this.CACHE_KEYS.ANALYTICS,
      analytics,
      this.CACHE_TTL,
    );

    return analytics;
  }

  async clearCache(): Promise<void> {
    this.logger.log('Clearing dashboard cache');
    const keys = Object.values(this.CACHE_KEYS);
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
