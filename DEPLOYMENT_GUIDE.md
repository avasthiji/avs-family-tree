# 🚀 Complete AWS Deployment Guide

**Step-by-step guide to deploy AVS Family Tree Application on AWS**

This guide covers the complete deployment process from Docker setup to production deployment on AWS.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
   - [Step 1: Docker Setup](#step-1-docker-setup)
   - [Step 2: AWS Account Setup](#step-2-aws-account-setup)
   - [Step 3: MongoDB Atlas Setup](#step-3-mongodb-atlas-setup)
   - [Step 4: AWS ECR Setup](#step-4-aws-ecr-setup)
   - [Step 5: AWS ECS Setup](#step-5-aws-ecs-setup)
   - [Step 6: Application Load Balancer](#step-6-application-load-balancer)
   - [Step 7: CI/CD Pipeline](#step-7-cicd-pipeline)
   - [Step 8: Domain & SSL](#step-8-domain--ssl)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:

- ✅ AWS Account with appropriate permissions
- ✅ AWS CLI installed and configured
- ✅ Docker installed locally
- ✅ Git repository set up
- ✅ Domain name (optional but recommended)
- ✅ MongoDB Atlas account (recommended) or self-hosted MongoDB

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Route 53      │ (DNS)
└────────┬────────┘
         │
┌────────▼────────┐
│ Application     │
│ Load Balancer   │
└────────┬────────┘
         │
┌────────▼────────┐
│   ECS Cluster   │
│  ┌──────────┐   │
│  │  Task 1   │   │
│  │  (App)    │   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │  Task 2   │   │
│  │  (App)    │   │
│  └──────────┘   │
└────────┬────────┘
         │
┌────────▼────────┐
│  MongoDB Atlas  │ (External)
└─────────────────┘
```

---

## 📝 Step-by-Step Deployment

### Step 1: Docker Setup

#### 1.1 Test Docker Build Locally

```bash
# Build the Docker image
docker build -t avs-family-tree:latest .

# Test the container locally
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your_secret \
  avs-family-tree:latest
```

#### 1.2 Verify Docker Image

```bash
# Check if the image was created
docker images | grep avs-family-tree

# Test with docker-compose
docker-compose up -d
```

**See `DOCKER_SETUP.md` for detailed Docker configuration.**

---

### Step 2: AWS Account Setup

#### 2.1 Install AWS CLI

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

#### 2.2 Configure AWS CLI

```bash
aws configure

# Enter the following:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: [e.g., us-east-1]
# Default output format: json
```

#### 2.3 Create IAM User for Deployment

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonECS_FullAccess`
   - `AmazonVPCFullAccess`
   - `ElasticLoadBalancingFullAccess`
   - `IAMFullAccess` (or create custom policy with minimal permissions)

---

### Step 3: MongoDB Atlas Setup

**See `MONGODB_ATLAS_SETUP.md` for detailed MongoDB Atlas configuration.**

#### Quick Setup:

1. Create MongoDB Atlas account
2. Create a new cluster (Free tier is fine for testing)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for AWS, or specific ECS IPs)
5. Get connection string
6. Update environment variables

---

### Step 4: AWS ECR Setup

**See `AWS_ECR_SETUP.md` for detailed ECR configuration.**

#### Quick Setup:

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name avs-family-tree \
  --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push image
docker tag avs-family-tree:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/avs-family-tree:latest
```

---

### Step 5: AWS ECS Setup

**See `AWS_ECS_DEPLOYMENT.md` for detailed ECS configuration.**

#### Quick Setup:

1. Create ECS Cluster
2. Create Task Definition
3. Create Service
4. Configure Auto Scaling
5. Set up CloudWatch Logs

---

### Step 6: Application Load Balancer

**See `AWS_ALB_SETUP.md` for detailed ALB configuration.**

#### Quick Setup:

1. Create Target Group
2. Create Application Load Balancer
3. Configure Health Checks
4. Set up SSL Certificate (ACM)
5. Configure Listener Rules

---

### Step 7: CI/CD Pipeline

**See `CI_CD_PIPELINE.md` for detailed CI/CD configuration.**

#### Quick Setup:

1. Create GitHub Actions workflow
2. Configure AWS credentials in GitHub Secrets
3. Set up automated deployment on push to main branch

---

### Step 8: Domain & SSL

1. Create Route 53 hosted zone
2. Request SSL certificate in ACM
3. Configure ALB with SSL certificate
4. Update DNS records

---

## 🔧 Post-Deployment

### 1. Verify Deployment

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster avs-family-tree-cluster \
  --services avs-family-tree-service

# Check task status
aws ecs list-tasks \
  --cluster avs-family-tree-cluster \
  --service-name avs-family-tree-service
```

### 2. Seed Database

```bash
# Connect to running container
aws ecs execute-command \
  --cluster avs-family-tree-cluster \
  --task <task-id> \
  --container avs-family-tree \
  --command "/bin/sh" \
  --interactive

# Inside container, run seed script
npm run seed
```

### 3. Monitor Application

- CloudWatch Logs
- CloudWatch Metrics
- Application health checks
- ECS service events

---

## 🐛 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check CloudWatch Logs
   - Verify environment variables
   - Check health check configuration

2. **Database connection issues**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Verify network security groups

3. **ALB health check failures**
   - Check application is running on port 3000
   - Verify health check path
   - Check security group rules

4. **Image pull errors**
   - Verify ECR repository permissions
   - Check IAM role policies
   - Verify ECR login token

---

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)

---

## ✅ Deployment Checklist

- [ ] Docker image builds successfully
- [ ] MongoDB Atlas cluster created and accessible
- [ ] ECR repository created and image pushed
- [ ] ECS cluster and service created
- [ ] Application Load Balancer configured
- [ ] SSL certificate installed
- [ ] Domain configured and DNS updated
- [ ] CI/CD pipeline working
- [ ] Environment variables configured
- [ ] Database seeded
- [ ] Health checks passing
- [ ] Monitoring configured

---

**Next Steps:** Follow the individual guides for each component:
- `DOCKER_SETUP.md` - Docker configuration
- `AWS_ECR_SETUP.md` - Container registry setup
- `AWS_ECS_DEPLOYMENT.md` - ECS deployment
- `AWS_ALB_SETUP.md` - Load balancer setup
- `CI_CD_PIPELINE.md` - CI/CD pipeline
- `MONGODB_ATLAS_SETUP.md` - MongoDB setup
- `ENVIRONMENT_VARIABLES.md` - Environment configuration


