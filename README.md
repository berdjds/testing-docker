# Full Stack Application

A modern full-stack application with React (Next.js), Node.js, and MySQL.

## Features

- Next.js frontend with TypeScript
- Express.js backend with Prisma ORM
- MySQL database
- Docker containerization
- JWT authentication
- API rate limiting
- Health checks
- Error handling
- Security middleware

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Start the application:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:3306

## Development

To run the application in development mode:

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start services
docker-compose -f docker-compose.dev.yml up -d
```

## Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

## API Documentation

The API documentation is available at http://localhost:5000/api-docs when running in development mode.

## Security

- All environment variables must be properly set in production
- Default passwords must be changed
- CORS is configured for frontend origin only
- Rate limiting is enabled
- Helmet security headers are configured
- JWT authentication is required for protected routes

## License

MIT
