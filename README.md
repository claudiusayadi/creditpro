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

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **Yarn**: Package manager (npm also works)
- **PostgreSQL**: Version 14 or higher
- **Redis**: Version 6 or higher
- **Docker & Docker Compose** (optional, for containerized deployment)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd creditpro
```

2. Install dependencies:

```bash
yarn install
```

3. Create environment configuration:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```bash
# Application
API_PORT=5156
NODE_ENV=development
API_URL=http://localhost:5156

# Database
DB_URL=postgresql://postgres:password@localhost:5432/creditpro

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-64-char-secret-key-change-in-production
JWT_ISSUER=CreditPro
JWT_AUDIENCE=CreditPro
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH_USER=your-email@gmail.com
SMTP_AUTH_PASS=your-app-password
SMTP_FROM="CreditPro <noreply@creditpro.com>"

# Security
THROTTLER_TTL=60
THROTTLER_LIMIT=10
VERIFICATION_CODE_TTL=600
```

5. Set up the database:

```bash
# Create the database
create the db creditpro

# Run migrations
yarn migration:run
```

## Running the Application

### Development Mode

```bash
# Standard development mode
yarn start:dev

# Debug mode
yarn start:debug
```

The API will be available at `http://localhost:5156`

### Production Mode

```bash
# Build the application
yarn build

# Run production build
yarn start:prod
```

### Docker Deployment

```bash
# Development environment
docker compose -f compose.dev.yml up

# Production environment
docker compose compose.yml up -d
```

## API Documentation

The API documentation is automatically generated using Swagger and is available at:

```
http://localhost:5156/api/v1/docs
```

The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality for testing endpoints
- Authentication configuration for protected routes

### API Structure

All endpoints are prefixed with `/api/v1`:

#### Public Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User authentication
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/blogs` - List all blogs
- `GET /api/v1/blogs/:slug` - Get blog by slug
- `GET /api/v1/events` - List all events
- `GET /api/v1/events/:slug` - Get event by slug
- `GET /api/v1/resources` - List all resources
- `GET /api/v1/resources/:slug` - Get resource by slug
- `GET /api/v1/careers` - List all careers
- `GET /api/v1/careers/:slug` - Get career by slug
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/health` - Health check

#### Protected Endpoints (Require Authentication)

- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/signout` - Sign out
- `POST /api/v1/auth/change-password` - Change password

#### Admin-Only Endpoints (Require Admin Role)

- `POST /api/v1/blogs` - Create blog
- `PATCH /api/v1/blogs/:id` - Update blog
- `DELETE /api/v1/blogs/:id` - Delete blog
- `POST /api/v1/events` - Create event
- `PATCH /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `POST /api/v1/media/upload` - Upload media
- `DELETE /api/v1/media/:id` - Delete media
- `GET /api/v1/dashboard` - View dashboard analytics
- `GET /api/v1/users` - List all users
- `PATCH /api/v1/users/:id` - Update user

### Authentication

The API uses JWT tokens stored in HTTP-only cookies:

1. **Sign Up**: Create an account via `/auth/signup`
2. **Verify Email**: Check email for verification code and verify via `/auth/verify-email`
3. **Sign In**: Authenticate via `/auth/signin` to receive access and refresh tokens
4. **Access Protected Routes**: Tokens are automatically included in requests via cookies
5. **Refresh Token**: Use `/auth/refresh` to obtain new access token when expired

Tokens are automatically managed through secure, HTTP-only cookies:

- `CreditProAccessToken`: Short-lived access token (15 minutes)
- `CreditProRefreshToken`: Long-lived refresh token (7 days)

## Database

### Schema Management

The application uses TypeORM for database management with migration support.

#### Create a Migration

```bash
yarn migration:generate -- src/core/db/migrations/MigrationName
```

#### Run Migrations

```bash
yarn migration:run
```

#### Revert Last Migration

```bash
yarn migration:revert
```

### Database Schema Overview

Key entities:

- **Users**: User accounts with role-based access
- **Blogs**: Blog posts with author, category, and media relations
- **Events**: Events with date ranges and location information
- **Resources**: Downloadable files with category and media relations
- **Careers**: Job postings with location and type
- **Categories**: Taxonomy for organizing content
- **Media**: Centralized file management with metadata
- **Contact**: Contact form submissions

All entities include:

- Soft delete support (`deleted_at`)
- Automatic timestamps (`created_at`, `updated_at`)
- UUID primary keys

## Security Features

### Rate Limiting

The API implements request throttling to prevent abuse:

- 10 requests per 60-second window by default
- Configurable via `THROTTLER_TTL` and `THROTTLER_LIMIT` environment variables
- Applied globally to all endpoints

### Password Security

- Argon2 hashing algorithm for password storage
- Minimum password requirements enforced at validation layer
- Secure password reset flow with time-limited codes

### Token Management

- JWT tokens with configurable expiration
- Refresh token rotation prevents token reuse
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production

### Input Validation

- All DTOs validated using class-validator
- File upload validation with MIME type and magic number checking
- SQL injection prevention through TypeORM parameterized queries

### CORS Configuration

- Configurable allowed origins
- Credentials support for cookie-based authentication
- Secure headers via Helmet middleware

## File Storage

The application stores uploaded files in an organized directory structure:

```
uploads/
└── YYYY/
    └── MM/
        ├── image1.jpg
        ├── document.pdf
        └── ...
```

Files are automatically organized by year and month for easy management and backup. Each file is tracked in the database with metadata including:

- Original filename
- Generated filename
- MIME type
- File size
- File type (IMAGE, DOCUMENT, PDF)
- Upload date
- Alt text and description for accessibility

### Supported File Types

**Images**: PNG, JPG, JPEG, WebP, GIF, SVG
**Documents**: DOC, DOCX, TXT, RTF
**PDFs**: PDF

## Project Structure

```
creditpro/
├── src/
│   ├── core/
│   │   ├── common/          # Shared utilities and DTOs
│   │   ├── config/          # Configuration files
│   │   ├── db/              # Database connection and migrations
│   │   ├── redis/           # Redis connection
│   │   └── swagger/         # API documentation schemas
│   ├── modules/
│   │   ├── auth/            # Authentication and authorization
│   │   ├── blogs/           # Blog management
│   │   ├── careers/         # Career postings
│   │   ├── categories/      # Content categorization
│   │   ├── contact/         # Contact form handling
│   │   ├── dashboard/       # Administrative dashboard
│   │   ├── email/           # Email service
│   │   ├── events/          # Event management
│   │   ├── health/          # Health checks
│   │   ├── media/           # Media management
│   │   ├── resources/       # Resource management
│   │   └── users/           # User management
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── uploads/                 # File storage (not in git)
├── scripts/                 # Utility scripts
├── public/                  # Static assets
├── compose.yml              # Production Docker Compose
├── compose.dev.yml          # Development Docker Compose
├── Dockerfile               # Multi-stage Docker build
├── .env.example             # Environment variable template
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies

```

## License

This project is licensed under the MIT License.
