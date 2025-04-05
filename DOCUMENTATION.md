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

### Docker Compose Files Comparison

The application includes multiple Docker Compose files for different deployment scenarios. Here is a detailed comparison of each file and instructions on how to use them:

#### 1. docker-compose.simple.yml

**Purpose**: Development & simple deployment

**Key Features**:
- Builds images from local Dockerfiles
- Uses MySQL 5.7 (more stable with Prisma)
- Simple configuration with hardcoded values
- No health checks
- Basic networking

**How to use**:
```bash
# Start services
docker-compose -f docker-compose.simple.yml up -d --build

# Stop services
docker-compose -f docker-compose.simple.yml down
```

#### 2. docker-compose.yml (Default)

**Purpose**: Development with environment variables

**Key Features**:
- Similar to simple but uses environment variables
- More flexibility with configuration
- Uses MySQL 5.7
- Creates volumes for development (hot reloading)

**How to use**:
1. Create a `.env` file with required variables:
```bash
# Create .env file
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

2. Run Docker Compose:
```bash
# Start services (no need for -f flag as this is the default)
docker-compose up -d --build

# Stop services
docker-compose down
```

#### 3. docker-compose.prod.yml (Production)

**Purpose**: Production deployment with pre-built images

**Key Features**:
- Uses pre-built images from GitHub Container Registry
- MySQL 8 (newer version)
- Has health checks for all services
- Includes SSL configuration for Nginx
- More robust environment variable configuration
- Configured for high availability

**How to use**:
1. Create a comprehensive `.env` file for production:
```bash
cat > .env << EOF
# MySQL Configuration
MYSQL_ROOT_PASSWORD=strong-production-password
MYSQL_DATABASE=myapp
MYSQL_USER=appuser
MYSQL_PASSWORD=secure-app-password

# JWT Secret for authentication
JWT_SECRET=your-very-secure-jwt-secret

# URLs
FRONTEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

# Node Environment
NODE_ENV=production
EOF
```

2. Run with the production file:
```bash
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Key Differences Between Docker Compose Files

1. **Image Sources**:
   - Simple/Default: Build from local Dockerfiles
   - Production: Pull pre-built images from GitHub Container Registry

2. **Database Version**:
   - Simple/Default: MySQL 5.7
   - Production: MySQL 8

3. **SSL/HTTPS**:
   - Simple/Default: HTTP only
   - Production: Configured for HTTPS with SSL volumes

4. **Health Checks**:
   - Simple/Default: None
   - Production: Health checks for all services

### Recommendation for Different Environments

1. **For Local Development**: Use `docker-compose.yml` (default)
2. **For Testing/Staging**: Use `docker-compose.simple.yml`
3. **For Production**: Use `docker-compose.prod.yml` after setting up proper environment variables and SSL certificates

### Production Setup with docker-compose.prod.yml

To properly set up the production environment using `docker-compose.prod.yml`:

1. **SSL Certificate Setup**:
   ```bash
   # Create directories for SSL certificates
   mkdir -p nginx/ssl

   # Generate self-signed certificates (for testing)
   # For production, use Let's Encrypt or another trusted certificate provider
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/private.key \
     -out nginx/ssl/certificate.crt
   ```

2. **Configure Nginx for HTTPS**:
   ```bash
   # Create or edit the Nginx configuration
   cat > nginx/conf/default.conf << 'EOF'
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /etc/nginx/ssl/certificate.crt;
       ssl_certificate_key /etc/nginx/ssl/private.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;

       # Frontend
       location / {
           proxy_pass http://frontend:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Backend API
       location /api/ {
           proxy_pass http://backend:5000/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   EOF
   ```

3. **Set Up GitHub Actions for Continuous Deployment**:
   Create a `.github/workflows/docker-publish.yml` file:
   ```yaml
   name: Docker Build and Publish

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   jobs:
     build-and-push:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Login to GitHub Container Registry
           uses: docker/login-action@v2
           with:
             registry: ghcr.io
             username: ${{ github.actor }}
             password: ${{ secrets.GITHUB_TOKEN }}

         - name: Build and push backend
           uses: docker/build-push-action@v4
           with:
             context: ./backend
             push: true
             tags: ghcr.io/berdjds/testing-docker-backend:latest

         - name: Build and push frontend
           uses: docker/build-push-action@v4
           with:
             context: ./frontend
             push: true
             tags: ghcr.io/berdjds/testing-docker-frontend:latest
   ```

4. **Deploy to Production Server**:
   ```bash
   # SSH into your production server
   ssh user@your-production-server
   
   # Clone the repository (if not already done)
   git clone https://github.com/berdjds/testing-docker.git
   cd testing-docker
   
   # Create the .env file with production values
   # (Use a secure method to transfer sensitive information)
   
   # Deploy with the production configuration
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

Remember to replace `yourdomain.com` with your actual domain name in all configurations.

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
