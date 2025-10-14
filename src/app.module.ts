import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

import { validateEnv } from './core/config/app.config';
import { apiProviders } from './core/config/providers.config';
import throttlerConfig from './core/config/throttler.config';
import { DbModule } from './core/db/db.module';

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
    EmailModule,
    HealthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [...apiProviders],
})
export class AppModule {}
