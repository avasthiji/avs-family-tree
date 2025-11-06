# 🚀 Quick Start Deployment Guide

**Quick reference guide for deploying AVS Family Tree Application on AWS**

---

## 📚 Documentation Index

All deployment documentation is organized as follows:

### Main Guides

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment overview
   - Architecture overview
   - Step-by-step deployment process
   - Post-deployment tasks
   - Troubleshooting

### Component-Specific Guides

2. **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Docker configuration
   - Dockerfile explanation
   - Building and running containers
   - Docker Compose setup
   - Production vs development

3. **[AWS_ECR_SETUP.md](./AWS_ECR_SETUP.md)** - Container registry setup
   - Creating ECR repository
   - Pushing images to ECR
   - Image tagging strategy
   - Lifecycle policies

4. **[AWS_ECS_DEPLOYMENT.md](./AWS_ECS_DEPLOYMENT.md)** - ECS deployment
   - Creating ECS cluster
   - Task definitions
   - Services configuration
   - Auto scaling

5. **[AWS_ALB_SETUP.md](./AWS_ALB_SETUP.md)** - Load balancer setup
   - Target groups
   - Application Load Balancer
   - SSL/TLS configuration
   - Health checks

6. **[CI_CD_PIPELINE.md](./CI_CD_PIPELINE.md)** - CI/CD pipeline
   - GitHub Actions setup
   - Automated deployments
   - Workflow configuration

7. **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - Environment configuration
   - Required variables
   - AWS Secrets Manager setup
   - Local development setup

8. **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Database setup
   - MongoDB Atlas account
   - Cluster creation
   - Connection string
   - Security configuration

---

## 🚀 Quick Start

### Step 1: Docker Setup

```bash
# Build Docker image
docker build -t avs-family-tree:latest .

# Test locally
docker run -p 3000:3000 avs-family-tree:latest
```

**See:** [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

### Step 2: AWS ECR Setup

```bash
# Create ECR repository
aws ecr create-repository --repository-name avs-family-tree

# Login to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker tag avs-family-tree:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
```

**See:** [AWS_ECR_SETUP.md](./AWS_ECR_SETUP.md)

---

### Step 3: MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

**See:** [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

---

### Step 4: AWS ECS Deployment

1. Create ECS cluster
2. Create task definition
3. Create service
4. Configure auto scaling

**See:** [AWS_ECS_DEPLOYMENT.md](./AWS_ECS_DEPLOYMENT.md)

---

### Step 5: Application Load Balancer

1. Create target group
2. Create ALB
3. Configure SSL/TLS
4. Attach to ECS service

**See:** [AWS_ALB_SETUP.md](./AWS_ALB_SETUP.md)

---

### Step 6: CI/CD Pipeline

1. Configure GitHub Secrets
2. Push code to main branch
3. Watch deployment in GitHub Actions

**See:** [CI_CD_PIPELINE.md](./CI_CD_PIPELINE.md)

---

## 📋 Deployment Checklist

### Prerequisites

- [ ] AWS Account created
- [ ] AWS CLI installed and configured
- [ ] Docker installed locally
- [ ] GitHub repository set up
- [ ] MongoDB Atlas account created

### Docker

- [ ] Dockerfile created
- [ ] Docker image builds successfully
- [ ] Docker image tested locally

### AWS ECR

- [ ] ECR repository created
- [ ] Docker image pushed to ECR
- [ ] Image tagged correctly

### MongoDB Atlas

- [ ] Cluster created
- [ ] Database user created
- [ ] IP addresses whitelisted
- [ ] Connection string obtained

### AWS ECS

- [ ] ECS cluster created
- [ ] Task definition created
- [ ] Service created
- [ ] Auto scaling configured

### Application Load Balancer

- [ ] Target group created
- [ ] ALB created
- [ ] SSL certificate installed
- [ ] ALB attached to ECS service

### CI/CD

- [ ] GitHub Secrets configured
- [ ] GitHub Actions workflow created
- [ ] Pipeline tested

### Environment Variables

- [ ] AWS Secrets Manager configured
- [ ] Environment variables set in task definition
- [ ] Local `.env.local` created

---

## 🔧 Common Commands

### Docker

```bash
# Build
docker build -t avs-family-tree:latest .

# Run
docker run -p 3000:3000 avs-family-tree:latest

# Compose
docker-compose up -d
```

### AWS ECR

```bash
# Login
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
```

### AWS ECS

```bash
# Update service
aws ecs update-service \
  --cluster avs-family-tree-cluster \
  --service avs-family-tree-service \
  --force-new-deployment

# List tasks
aws ecs list-tasks --cluster avs-family-tree-cluster
```

---

## 📞 Support

For issues or questions:

1. Check the specific guide for the component you're working on
2. Review the [Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting) section
3. Check AWS CloudWatch Logs for errors
4. Verify all prerequisites are met

---

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Happy Deploying! 🚀**


