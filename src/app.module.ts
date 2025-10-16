import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CareersModule } from './modules/careers/careers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ContactsModule } from './modules/contact/contacts.module';
import { EmailModule } from './modules/email/email.module';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { UsersModule } from './modules/users/users.module';

import { validateEnv } from './core/config/app.config';
import { apiProviders } from './core/config/providers.config';
import throttlerConfig from './core/config/throttler.config';
import { DbModule } from './core/db/db.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync(throttlerConfig.asProvider()),
    DbModule,
    AuthModule,
    BlogsModule,
    CareersModule,
    CategoriesModule,
    ContactsModule,
    EmailModule,
    EventsModule,
    HealthModule,
    MediaModule,
    ResourcesModule,
    UsersModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [...apiProviders],
})
export class AppModule {}
