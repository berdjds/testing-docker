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

### Step-by-Step Deployment to a VPS

Follow these detailed instructions to deploy the application to a Virtual Private Server (VPS):

#### 1. Prerequisites on the VPS

Ensure your VPS has the following software installed:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Install Git
sudo apt install git -y
```

#### 2. Setting up GitHub Repository

If you're starting from scratch:

```bash
# Initialize a Git repository locally
git init

# Add your files
git add .

# Commit your changes
git commit -m "Initial commit"

# Create a GitHub repository through the GitHub website
# Then add the remote repository
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push your code to GitHub
git push -u origin main
```

If you're using an existing repository:

```bash
# Clone the repository to your local machine
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# Make changes as needed
# ...

# Commit and push changes
git add .
git commit -m "Your commit message"
git push
```

#### 3. Deploying to VPS

Follow these steps to deploy your application on the VPS:

##### 3.1. SSH into Your VPS

```bash
ssh username@your-vps-ip
```

##### 3.2. Create Application Directory Structure

```bash
# Create directory structure
mkdir -p ~/myapps
cd ~/myapps
```

##### 3.3. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

##### 3.4. Clean Up Any Existing Docker Resources (if needed)

```bash
# Stop running containers
docker stop $(docker ps -aq)

# Remove containers
docker rm $(docker ps -aq)

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Complete cleanup (use with caution, removes all unused resources)
docker system prune -af --volumes
```

##### 3.5. Create Required Environment Variables

```bash
# Create or edit .env file
cat > .env << EOF
# MySQL Configuration
MYSQL_ROOT_PASSWORD=mysecretpassword
MYSQL_DATABASE=myapp
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword

# Node Environment
NODE_ENV=production
EOF
```

##### 3.6. Build and Start Containers

```bash
# Build and start containers
docker-compose -f docker-compose.simple.yml up -d --build
```

##### 3.7. Verify Deployment

```bash
# Check if containers are running
docker ps

# Check logs
docker-compose -f docker-compose.simple.yml logs -f
```

##### 3.8. Access Your Application

Your application should now be accessible at:

```
http://your-vps-ip
```

#### A4. Updating Your Application

When you make changes to your application, follow these steps to update the deployment:

##### 4.1. Local Development

```bash
# Make changes to your code locally
# ...

# Commit and push changes
git add .
git commit -m "Your update message"
git push
```

##### 4.2. Updating on VPS

```bash
# SSH into your VPS
ssh username@your-vps-ip

# Navigate to your application directory
cd ~/myapps/your-repo-name

# Pull the latest changes
git pull

# Rebuild and restart containers
docker-compose -f docker-compose.simple.yml up -d --build
```

#### 5. Continuous Integration with GitHub Actions (Optional)

You can set up GitHub Actions to automatically deploy your application when changes are pushed to the main branch.

##### 5.1. Create GitHub Actions Workflow File

Create a file `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: SSH into VPS and deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ~/myapps/your-repo-name
            git pull
            docker-compose -f docker-compose.simple.yml up -d --build
```

##### 5.2. Set Up GitHub Repository Secrets

In your GitHub repository:
1. Go to Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `HOST`: Your VPS IP address
   - `USERNAME`: Your VPS username
   - `SSH_PRIVATE_KEY`: Your private SSH key

##### 5.3. Test the Workflow

Push a change to your main branch to trigger the workflow.

#### 6. Managing SSL with Let's Encrypt (Optional)

For secure HTTPS connections:

##### 6.1. Install Certbot

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx -y
```

##### 6.2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com
```

##### 6.3. Update Nginx Configuration

Certbot should automatically update your Nginx configuration, but you can verify it:

```bash
sudo nano /etc/nginx/sites-available/default
```

Verify that HTTPS redirects are properly configured:

```
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Other configurations...
}
```

#### 7. Backup and Recovery Procedures

##### 7.1. Backup Docker Volumes

```bash
# Create a backup directory
mkdir -p ~/backups

# Backup MySQL data
docker run --rm --volumes-from mysql -v ~/backups:/backup alpine sh -c "cd /var/lib/mysql && tar cvf /backup/mysql-backup-$(date +%Y%m%d).tar ."
```

##### 7.2. Backup Configuration Files

```bash
# Backup your docker-compose and environment files
cp docker-compose.simple.yml ~/backups/docker-compose.simple.yml.$(date +%Y%m%d)
cp .env ~/backups/.env.$(date +%Y%m%d)
```

##### 7.3. Restore from Backup

```bash
# Stop containers
docker-compose -f docker-compose.simple.yml down

# Restore MySQL data
docker run --rm --volumes-from mysql -v ~/backups:/backup alpine sh -c "cd /var/lib/mysql && tar xvf /backup/mysql-backup-YYYYMMDD.tar"

# Start containers
docker-compose -f docker-compose.simple.yml up -d
```

### Troubleshooting Deployment Issues

{{ ... }}
