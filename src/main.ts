import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';

import corsConfig from 'src/core/config/cors.config';
import * as pkg from '../package.json';
import { AppModule } from './app.module';
import { ApiConfig } from './core/config/app.config';
import helmetConfig from './core/config/helmet.config';
import tokensConfig from './core/config/tokens.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);

  const env = ApiConfig.NODE_ENV;
  const port = ApiConfig.API_PORT;
  const versionMajor = pkg.version?.split('.')[0] ?? '1';
  const prefix = `api/v${versionMajor}`;
  const title: string = pkg?.name?.replace(/-/g, ' ').toUpperCase() ?? '';

  app.use(helmet(helmetConfig));
  app.enableCors(corsConfig);
  app.use(cookieParser());
  app.setGlobalPrefix(prefix);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/assets/',
  });

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(pkg.description)
    .addCookieAuth(tokensConfig.access)
    .setVersion(pkg.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    customSiteTitle: title,
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  });

  await app.listen(port ?? 3000);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${port}/${prefix}/docs`,
  );
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${prefix}`,
  );
  logger.log(`🌍 Environment: ${env}`);
}

void bootstrap();
