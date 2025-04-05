# Full-Stack Application Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Directory Structure](#directory-structure)
5. [Installation and Setup](#installation-and-setup)
6. [Docker Configuration](#docker-configuration)
7. [Development Guide](#development-guide)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

## Introduction

This documentation provides a comprehensive guide to the full-stack application built with Next.js, Node.js/Express, and MySQL. The application is containerized using Docker and orchestrated with Docker Compose, making it easy to deploy in any environment.

## System Architecture

The application follows a microservices architecture with the following components:

1. **Frontend**: A React/Next.js application that provides the user interface
2. **Backend**: An Express.js API server that handles business logic and data access
3. **Database**: A MySQL database for data persistence
4. **Nginx**: A reverse proxy that routes requests to the appropriate services

Here's a diagram of how these components interact:

```
                    ┌─────────┐
                    │  Nginx  │
                    │(Reverse │
                    │ Proxy)  │
                    └────┬────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
    ┌──────▼──────┐            ┌───────▼──────┐
    │   Frontend  │            │    Backend   │
    │  (Next.js)  │            │  (Express.js)│
    └──────┬──────┘            └───────┬──────┘
           │                           │
           │                    ┌──────▼──────┐
           │                    │   Database  │
           │                    │   (MySQL)   │
           │                    └─────────────┘
           │
    ┌──────▼──────┐
    │    User     │
    │   Browser   │
    └─────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14.0.4
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Backend
- **Framework**: Express.js
- **Language**: JavaScript
- **Database ORM**: Prisma
- **API Style**: RESTful

### Database
- **Type**: MySQL 5.7
- **Schema Management**: Prisma migrations

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **Environment Variables**: .env files

## Directory Structure

```
testing-docker/
├── backend/              # Backend Express application
│   ├── prisma/           # Prisma schema and migrations
│   ├── Dockerfile        # Backend Docker configuration
│   ├── app.js            # Main application entry point
│   └── package.json      # Backend dependencies
├── frontend/             # Frontend Next.js application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── app/          # Next.js app directory
│   │   └── ...
│   ├── Dockerfile        # Frontend Docker configuration
│   └── package.json      # Frontend dependencies
├── nginx/                # Nginx configuration
│   └── conf/             # Nginx server blocks
├── mysql/                # MySQL configuration
│   └── my.cnf            # MySQL config file
├── .env                  # Environment variables
├── docker-compose.yml    # Main Docker Compose configuration
└── docker-compose.simple.yml # Simplified Docker Compose setup
```

## Installation and Setup

### Prerequisites
- Docker and Docker Compose installed
- Git installed (for cloning the repository)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/berdjds/testing-docker.git
   cd testing-docker
   ```

2. **Set up environment variables**
   Create or modify the `.env` file with the following variables:
   ```
   # MySQL Configuration
   MYSQL_ROOT_PASSWORD=mysecretpassword
   MYSQL_DATABASE=myapp
   MYSQL_USER=appuser
   MYSQL_PASSWORD=apppassword
   
   # Node Environment
   NODE_ENV=production
   ```

3. **Build and start the containers**
   ```bash
   docker-compose -f docker-compose.simple.yml up -d --build
   ```

4. **Verify the installation**
   Navigate to `http://localhost` or your server IP address in a web browser.

## Docker Configuration

### Frontend Dockerfile

The frontend Dockerfile uses a multi-stage build process:

```dockerfile
# Build stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy frontend files
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-slim

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=/api

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose frontend port
EXPOSE 3000

# Start the server correctly for standalone mode
CMD ["node", "server.js"]
```

### Backend Dockerfile

```dockerfile
FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]
```

### Docker Compose Configuration

The `docker-compose.simple.yml` file orchestrates all the services:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: mysecretpassword
      MYSQL_DATABASE: myapp
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppassword
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password
    networks:
      - app-network

  backend:
    build:
      context: ./backend
    container_name: backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://appuser:apppassword@mysql:3306/myapp
    depends_on:
      - mysql
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    container_name: frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: /api
    depends_on:
      - backend
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql-data:
    driver: local
```

## Development Guide

### Frontend Development

The frontend is a Next.js application with the following features:
- Server-side rendering
- Static page generation
- API routes
- Tailwind CSS for styling

To work on the frontend locally, you can run:

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

The backend is an Express.js application with the following features:
- RESTful API endpoints
- Prisma ORM for database access
- Error handling middleware
- CORS support

To work on the backend locally, you can run:

```bash
cd backend
npm install
npm run dev
```

### Database Schema Management

The database schema is managed using Prisma. The schema is defined in `backend/prisma/schema.prisma`:

```prisma
// This is your Prisma schema file
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

To update the database schema:

```bash
cd backend
npx prisma migrate dev --name <migration-name>
```

## Deployment Guide

### Deployment to VPS

Follow these steps to deploy the application to a VPS:

1. **SSH into your VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Create a directory for the application**
   ```bash
   mkdir -p ~/myapps
   cd ~/myapps
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/berdjds/testing-docker.git
   cd testing-docker
   ```

4. **Clean up any existing Docker resources (if needed)**
   ```bash
   docker stop $(docker ps -aq)
   docker rm $(docker ps -aq)
   docker network prune -f
   docker volume prune -f
   docker system prune -af --volumes
   ```

5. **Build and start the application**
   ```bash
   docker-compose -f docker-compose.simple.yml up -d --build
   ```

6. **Check the running containers**
   ```bash
   docker ps
   ```

7. **Check the logs if needed**
   ```bash
   docker-compose -f docker-compose.simple.yml logs -f
   ```

### Updates and Maintenance

To update the application with new changes:

1. **Pull the latest changes**
   ```bash
   cd ~/myapps/testing-docker
   git pull
   ```

2. **Rebuild and restart the containers**
   ```bash
   docker-compose -f docker-compose.simple.yml up -d --build
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   If the backend cannot connect to the database, check:
   - Database container is running: `docker ps | grep mysql`
   - Database credentials are correct in the environment variables
   - Network connectivity between containers: `docker network inspect app-network`

   Solution:
   ```bash
   # Restart the MySQL container
   docker-compose -f docker-compose.simple.yml restart mysql
   # Check logs
   docker-compose -f docker-compose.simple.yml logs mysql
   ```

2. **Frontend Cannot Connect to Backend**
   If the frontend cannot connect to the backend, check:
   - Nginx configuration in `nginx/conf/default.conf`
   - Backend container is running: `docker ps | grep backend`
   - Network connectivity: `docker network inspect app-network`

   Solution:
   ```bash
   # Check Nginx configuration
   docker exec -it nginx nginx -t
   # Restart Nginx
   docker-compose -f docker-compose.simple.yml restart nginx
   ```

3. **Container Build Failures**
   If container builds fail, check:
   - Dockerfile syntax
   - Dependencies are available
   - Disk space is sufficient

   Solution:
   ```bash
   # Check Docker build logs
   docker-compose -f docker-compose.simple.yml build --no-cache <service>
   ```

## Maintenance

### Backups

To backup the database:

```bash
docker exec -it mysql /usr/bin/mysqldump -u root -p<root-password> myapp > backup.sql
```

To restore from a backup:

```bash
cat backup.sql | docker exec -i mysql /usr/bin/mysql -u root -p<root-password> myapp
```

### Monitoring

To monitor container resources:

```bash
docker stats
```

To check container logs:

```bash
docker-compose -f docker-compose.simple.yml logs -f
```

### Scaling

The application can be scaled horizontally by adjusting the Docker Compose configuration. For production environments, consider using orchestration tools like Kubernetes or Docker Swarm for more advanced scaling capabilities.

---

This documentation provides a comprehensive guide to setting up, developing, deploying, and maintaining the full-stack application. For any additional questions or issues, please refer to the project repository or contact the development team.
