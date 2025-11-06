# 🐳 Docker Setup Guide

**Complete guide for Dockerizing the AVS Family Tree Application**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Dockerfile Explanation](#dockerfile-explanation)
4. [Building Docker Images](#building-docker-images)
5. [Running Containers](#running-containers)
6. [Docker Compose](#docker-compose)
7. [Production vs Development](#production-vs-development)
8. [Optimization Tips](#optimization-tips)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This application uses a multi-stage Docker build to create optimized production images. The Dockerfile is optimized for:
- Smaller image size
- Faster builds
- Security best practices
- Production-ready configuration

---

## ✅ Prerequisites

- Docker Desktop installed (or Docker Engine on Linux)
- Docker Compose installed
- Basic understanding of Docker concepts

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 📄 Dockerfile Explanation

### Multi-Stage Build Process

The Dockerfile uses three stages:

1. **deps**: Installs dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates the final production image

### Stage 1: Dependencies

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
```

- Uses Alpine Linux for smaller image size
- Installs only production dependencies
- Uses `npm ci` for faster, reliable installs

### Stage 2: Builder

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build
```

- Copies dependencies from deps stage
- Builds the Next.js application
- Disables telemetry for privacy

### Stage 3: Runner

```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

- Creates non-root user for security
- Copies only necessary files
- Sets proper permissions
- Runs as non-root user

---

## 🔨 Building Docker Images

### Basic Build

```bash
# Build the image
docker build -t avs-family-tree:latest .

# Build with specific tag
docker build -t avs-family-tree:v1.0.0 .
```

### Build with Arguments

```bash
# Build with build arguments
docker build \
  --build-arg NODE_ENV=production \
  -t avs-family-tree:latest .
```

### Build for Different Platforms

```bash
# Build for ARM64 (Apple Silicon, AWS Graviton)
docker build --platform linux/arm64 -t avs-family-tree:arm64 .

# Build for AMD64
docker build --platform linux/amd64 -t avs-family-tree:amd64 .
```

### Verify Build

```bash
# List images
docker images | grep avs-family-tree

# Check image size
docker images avs-family-tree:latest
```

---

## 🚀 Running Containers

### Basic Run

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your_secret \
  avs-family-tree:latest
```

### Run with Environment File

```bash
# Create .env.local file first
docker run -p 3000:3000 \
  --env-file .env.local \
  avs-family-tree:latest
```

### Run in Detached Mode

```bash
docker run -d \
  --name avs-app \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  avs-family-tree:latest
```

### Run with Volume Mounts

```bash
docker run -p 3000:3000 \
  -v $(pwd)/.env.local:/app/.env.local:ro \
  avs-family-tree:latest
```

---

## 🐙 Docker Compose

### Development Setup

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Setup

```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://mongodb:27017/avs-family-tree
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@avs-family-tree.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
MATRIMONIAL_FEATURE=true
EVENT_FEATURE=true
```

---

## 🏭 Production vs Development

### Production Dockerfile

- Multi-stage build for optimization
- Runs as non-root user
- Minimal dependencies
- Standalone Next.js output
- Production environment variables

### Development Dockerfile

- Single-stage build
- Hot reload support
- Development dependencies
- Volume mounts for live updates
- Development environment variables

### Choosing the Right Setup

**Use Production:**
- Deploying to AWS
- Running in production
- Need optimized image size
- Security is priority

**Use Development:**
- Local development
- Testing changes
- Need hot reload
- Development dependencies required

---

## ⚡ Optimization Tips

### 1. Use .dockerignore

The `.dockerignore` file excludes unnecessary files from the build context:

```
node_modules
.next
.env
.git
*.md
```

### 2. Layer Caching

Order Dockerfile commands from least to most frequently changing:

```dockerfile
# Copy package files first (changes less frequently)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code last (changes frequently)
COPY . .
```

### 3. Use Multi-Stage Builds

Reduces final image size by excluding build dependencies.

### 4. Use Alpine Linux

Smaller base image (about 5MB vs 170MB for full Node image).

### 5. Clean Up After Build

```dockerfile
RUN npm ci && npm cache clean --force
```

### 6. Use Specific Tags

Avoid using `latest` tag in production:

```bash
docker build -t avs-family-tree:v1.0.0 .
```

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build fails with dependency errors

```bash
# Clear Docker cache
docker builder prune

# Remove node_modules locally
rm -rf node_modules package-lock.json
npm install
```

### Container Won't Start

**Issue:** Container exits immediately

```bash
# Check logs
docker logs <container-id>

# Run interactively to debug
docker run -it --entrypoint /bin/sh avs-family-tree:latest
```

### Port Already in Use

**Issue:** Port 3000 already in use

```bash
# Use different port
docker run -p 3001:3000 avs-family-tree:latest

# Or find and stop process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Working

**Issue:** Environment variables not being read

```bash
# Verify environment variables
docker exec <container-id> env

# Check if .env.local is being read
docker run --env-file .env.local avs-family-tree:latest
```

### Database Connection Issues

**Issue:** Cannot connect to MongoDB

```bash
# Verify MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs avs-mongodb

# Test connection from container
docker exec -it avs-app sh
# Inside container:
# mongosh mongodb://mongodb:27017/avs-family-tree
```

### Memory Issues

**Issue:** Out of memory errors

```bash
# Increase Docker memory limit
# Docker Desktop > Settings > Resources > Memory

# Or use docker-compose with memory limits
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G
```

---

## 📊 Image Size Comparison

| Setup | Size | Notes |
|-------|------|-------|
| Full Node Image | ~900MB | Not recommended |
| Alpine Base | ~150MB | Recommended |
| Multi-stage Alpine | ~120MB | Optimized |
| Standalone Output | ~80MB | Production ready |

---

## ✅ Best Practices

1. **Use multi-stage builds** - Smaller final images
2. **Run as non-root user** - Better security
3. **Use .dockerignore** - Faster builds
4. **Pin base image versions** - Reproducible builds
5. **Use specific tags** - Avoid `latest` in production
6. **Clean up after installs** - Remove package managers
7. **Use health checks** - Better container orchestration
8. **Set resource limits** - Prevent resource exhaustion
9. **Use secrets management** - Don't hardcode secrets
10. **Scan images for vulnerabilities** - Security best practice

---

## 🔍 Useful Commands

```bash
# Build image
docker build -t avs-family-tree:latest .

# Run container
docker run -p 3000:3000 avs-family-tree:latest

# View logs
docker logs <container-id>

# Execute command in container
docker exec -it <container-id> sh

# List running containers
docker ps

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove image
docker rmi avs-family-tree:latest

# Clean up unused images
docker image prune -a

# View image layers
docker history avs-family-tree:latest

# Inspect image
docker inspect avs-family-tree:latest
```

---

## 📚 Next Steps

- [AWS ECR Setup Guide](./AWS_ECR_SETUP.md) - Push images to ECR
- [AWS ECS Deployment Guide](./AWS_ECS_DEPLOYMENT.md) - Deploy to ECS
- [CI/CD Pipeline Guide](./CI_CD_PIPELINE.md) - Automated deployments

---

**Questions?** Check the main [Deployment Guide](./DEPLOYMENT_GUIDE.md) or [Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting) section.


