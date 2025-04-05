# Quick Start Guide

This guide provides the essential steps to get the application up and running quickly.

## Prerequisites

- Docker and Docker Compose installed
- Git installed (for cloning the repository)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/berdjds/testing-docker.git
cd testing-docker
```

### 2. Start the Application

```bash
docker-compose -f docker-compose.simple.yml up -d --build
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost
```

Or if deploying to a server, use your server's IP address.

## Common Commands

### View Container Status

```bash
docker ps
```

### View Logs

```bash
docker-compose -f docker-compose.simple.yml logs -f
```

### Stop All Containers

```bash
docker-compose -f docker-compose.simple.yml down
```

### Restart a Specific Service

```bash
docker-compose -f docker-compose.simple.yml restart [service-name]
```
Replace `[service-name]` with one of: `frontend`, `backend`, `mysql`, or `nginx`.

### Clean Up Docker Resources

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker network prune -f
docker volume prune -f
docker system prune -af --volumes
```

## Application Structure

- **Frontend**: Next.js application running on port 3000
- **Backend**: Express.js API running on port 5000
- **Database**: MySQL 5.7 running on port 3306
- **Nginx**: Reverse proxy serving content on port 80

## Troubleshooting

If you encounter issues, refer to the full [DOCUMENTATION.md](./DOCUMENTATION.md) file for detailed troubleshooting guidance.

---

For detailed documentation including architecture, development guides, and maintenance procedures, please refer to the comprehensive [DOCUMENTATION.md](./DOCUMENTATION.md) file.
