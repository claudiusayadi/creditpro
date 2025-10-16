# CreditPro API

An all-in-one organizational management platform, fully production-ready RESTful API built with NestJS, providing a comprehensive backend solution for content management, user authentication, media handling, and organizational resources.

## Overview

CreditPro API is a modern, scalable backend application designed to power content-driven platforms. It features a robust authentication system, content management capabilities for blogs and events, career postings, resource management, and a centralized media handling system. Built with TypeScript and following industry best practices, the API ensures type safety, maintainability, and excellent developer experience.

## Core Features

### Authentication & Authorization

- JWT-based authentication with secure cookie storage
- Role-based access control (Admin, User)
- Email verification with 6-digit verification codes
- Password reset functionality with time-limited reset codes
- Refresh token rotation with Redis-backed session management
- Argon2 password hashing for enhanced security
- Rate limiting and throttling protection

### Content Management

- **Blogs**: Full CRUD operations with slug-based routing, category association, author attribution, and featured/published status management
- **Events**: Event management with date-based filtering, location tracking, registration URLs, and featured event support
- **Categories**: Hierarchical organization for blogs and resources with slug-based access
- **Resources**: Document and file management with type categorization, download tracking, and thumbnail support

### Media Management

- Centralized media handling with database tracking
- Support for images (PNG, JPG, WebP, GIF, SVG), documents (DOC, DOCX, TXT, RTF), and PDFs
- File validation with MIME type checking and magic number verification
- Automatic file organization by year and month
- Metadata management including alt text and descriptions
- Media statistics and analytics

### User Management

- User profile management
- Email verification workflow
- Password change functionality
- User role management

### Additional Modules

- **Career Postings**: Job listing management with location and type filtering
- **Contact System**: Contact form submission handling with status tracking
- **Dashboard**: Administrative analytics and overview
- **Health Monitoring**: System health checks for database and application status
- **Settings**: Application configuration management with key-value storage

## Technology Stack

### Core Framework

- **NestJS 11.x**: Progressive Node.js framework
- **TypeScript 5.x**: Type-safe development
- **Node.js**: Runtime environment

### Database & Caching

- **PostgreSQL**: Primary database with TypeORM
- **Redis**: Session management and caching
- **TypeORM 0.3.x**: Database ORM with migration support

### Authentication & Security

- **Passport.js**: Authentication middleware with JWT and Local strategies
- **JWT**: Token-based authentication
- **Argon2**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Request throttling with @nestjs/throttler

### File Handling

- **Multer**: Multipart form data handling
- **Magic Bytes**: File type validation
- **File Type Detection**: MIME type verification

### Email

- **Nodemailer**: Email delivery
- **Handlebars**: Email template rendering
- **@nestjs-modules/mailer**: NestJS email integration

### API Documentation

- **Swagger/OpenAPI**: Automatic API documentation generation
- **@nestjs/swagger**: NestJS Swagger integration

### Validation & Transformation

- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Zod**: Environment variable validation

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
src/
├── core/                    # Core functionality
│   ├── common/             # Shared utilities, DTOs, decorators, and interfaces
│   ├── config/             # Application configuration
│   ├── db/                 # Database module
│   ├── redis/              # Redis module
│   └── swagger/            # API documentation schemas
└── modules/                # Feature modules
    ├── auth/               # Authentication and authorization
    ├── blogs/              # Blog management
    ├── careers/            # Career postings
    ├── categories/         # Content categorization
    ├── contact/            # Contact form handling
    ├── dashboard/          # Administrative dashboard
    ├── email/              # Email service
    ├── events/             # Event management
    ├── health/             # Health monitoring
    ├── media/              # Media management
    ├── resources/          # Resource management
    └── users/              # User management
```

### Design Patterns

- Repository pattern for data access
- Dependency injection for loose coupling
- Guard-based authorization
- Interceptor-based response transformation
- Filter-based exception handling
- Strategy pattern for authentication

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
